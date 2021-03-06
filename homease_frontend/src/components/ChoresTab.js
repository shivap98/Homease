import React, {Component} from 'react';
import {Text, View, TouchableOpacity, TouchableHighlight, ScrollView, Image} from 'react-native';
import theme from './common/theme';
import componentStyles from './common/componentStyles';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Button, FAB, Modal, Portal, Provider as PaperProvider, ActivityIndicator, Colors} from 'react-native-paper';
import getDB from './Cloud';
import auth from '@react-native-firebase/auth';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import paperTheme from './common/paperTheme';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

class ChoresTab extends Component {

    state = {
        loading: true,
        myChoresList: [],
        allChoresList: [],
        remindersList: [],
        photoURL: '',
        modalVisible: false,
        currentSwipedKey: '',
        creepList: [],
        photoURI: '',
        reminderModalVisible: false,
        reminderChoreName: '',
        reminderChoreKey: '',
    }

    groupid = ''

    constructor(props) {
        super(props);
	}

	async getDbInfo(uid, groupid) {
        this.setState({allChoresList: [], myChoresList: [], remindersList: []});
		chores = await getDB({data: {groupid: groupid}}, 'getChoresByGroupID');
		var allChoresList = [];
		var myChoresList = [];
        var remindersList = [];
        var creepList = [];
        var reminderChoreName = '';
        var reminderChoreKey = '';
		for(key in chores.result){
			var obj = chores.result[key];
			var name = '';
			var status = 'Incomplete';
			var selectedUsers = [];
			var choreId = '';
			var description = '';
            var lastDoneBy = '';
            var lastDoneDate = '';
            var lastDonePhoto = '';
            var currentUser = '';
            var recursiveChore = '';
            var currentUser = '';
            var isChore = false;
            var reminderActive = false;
            var timestamp
			for (var prop in obj) {
				if (!obj.hasOwnProperty(prop)) continue;
				if(prop == "choreName"){
					name = obj[prop];
				} else if(prop == "status"){
					status = obj[prop]
				} else if(prop == "selectedUsers"){
					selectedUsers = obj[prop]
				} else if(prop == "choreId"){
				    choreId = obj[prop];
                } else if(prop == "description"){
				    description = obj[prop];
                } else if(prop == "lastDoneBy"){
				    lastDoneBy = obj[prop];
                } else if(prop == "lastDoneDate"){
                    lastDoneDate = obj[prop];
                } else if(prop == "lastDonePhoto"){
                    lastDonePhoto = obj[prop];
                } else if(prop == "currentUser"){
                    currentUser = obj[prop];
                } else if(prop == "recursiveChore"){
                    recursiveChore = obj[prop];
                } else if(prop == "currentUser"){
                    currentUser = obj[prop];
                } else if(prop == "isChore"){
				    isChore = obj[prop];
                } else if(prop == "reminderActive"){
				    reminderActive = obj[prop];
                } else if(prop == "timestamp"){
				    timestamp = obj[prop];
                }
            }

            res = await getDB({data: {uid: currentUser} }, "getUser")
            var currentUserName = res.result.firstName + " " + res.result.lastName

            if(!isChore){
                remindersList.push({key, name, status, selectedUsers, description, lastDoneBy, lastDoneDate, lastDonePhoto, currentUser, recursiveChore, currentUserName, isChore, timestamp, reminderActive})
            } else if (currentUser === uid && status !== 'Complete') {
                if(reminderActive){
                    reminderChoreName = name;
                    reminderChoreKey = key;
                }
                myChoresList.push({key, name, status, selectedUsers, description, lastDoneBy, lastDoneDate, lastDonePhoto, currentUser, recursiveChore, currentUserName, isChore, timestamp, reminderActive})
            } else {
                allChoresList.push({key, name, status, selectedUsers, description, lastDoneBy, lastDoneDate, lastDonePhoto, currentUser, recursiveChore, currentUserName, isChore, timestamp, reminderActive})
            }
        }

		if(reminderChoreName.length === 0) {
            this.setState({allChoresList, myChoresList, remindersList, reminderModalVisible: false, reminderChoreName, reminderChoreKey});
        }else{
		    this.setState({allChoresList: allChoresList, myChoresList: myChoresList, remindersList: remindersList, reminderModalVisible: true, reminderChoreName: reminderChoreName, reminderChoreKey: reminderChoreKey});
        }
	}

	async componentDidMount(){
		var uid = null
        if (auth().currentUser) {
            uid = auth().currentUser.uid

            this.setState({uid: auth().currentUser.uid})
        } else {
            uid = firebase.auth().currentUser.uid
            this.setState({uid: firebase.auth().currentUser.uid})
        }
		res = await getDB({data: {uid: uid} }, "getUser")

		if(res.result.groupid){
            this.groupid = res.result.groupid
			this.setState({groupid: this.groupid})
			
			firebase.database().ref('/groups/'+res.result.groupid + '/').on('value', (snapshot) => {
				this.getDbInfo(uid, this.state.groupid)
			})
        }
        
        this.setState({ loading: false })
	}

     onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    onPressChore(data) {
        this.props.navigation.navigate('Chore', {key: data.item.key, groupid: this.groupid});
    }

    renderMyChores = data => {
        return (
            <TouchableHighlight
                onPress={() => {this.onPressChore(data)}}
                style={styles.rowFront}
                underlayColor={theme.lightColor}
            >
                <View>
                    <Text
                        style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}
                    >
                        {data.item.name}
                    </Text>
                    <Text
                        style={{color: 'white', fontSize: 18}}
                    >
                        Status: {data.item.status}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }

    renderAllChores = data => {
        return(
        <TouchableHighlight
            onPress={() => {this.onPressChore(data)}}
            style={styles.rowFront}
            underlayColor={theme.lightColor}
        >
            <View>
                <Text
                    style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}
                >
                    {data.item.name}
                </Text>
                <Text
                    style={{color: 'white', fontSize: 18}}
                >
                    Status: {data.item.status}
                </Text>
                <Text
                    style={{color: 'white', fontSize: 18}}
                >
                    Current User: {data.item.currentUserName}
                </Text>
            </View>
        </TouchableHighlight>
        );
    }

    async onDoneButtonClicked() {

        let chore = {}
        let choreKey = this.state.currentSwipedKey;
        let choreObj = this.state.myChoresList.find(chore => chore.key === choreKey);

        var storageURL = ''
        if (this.state.photoURI !== '') {
            const uploadUri = Platform.OS === 'ios' ? this.state.photoURI.replace('file://', '') : this.state.photoURI;

            imageRef = storage().ref(choreKey)

            await imageRef.putFile(uploadUri);
            storageURL = await imageRef.getDownloadURL()
        }

        if (choreObj.recursiveChore) {
            let mems = choreObj.selectedUsers;
            let users = [];
            for (var key in mems) {
                var user = await getDB({ data: { uid: mems[ key ] } }, "getUser");
                users.push({ name: user.result.firstName + " " + user.result.lastName, uid: mems[ key ], outOfHouse: user.result.outOfHouse });
            }

            if (choreObj.selectedUsers.length === 1) {
                chore = {
                    choreName: choreObj.name,
                    currentUser: choreObj.currentUser,
                    description: choreObj.description,
                    lastDoneBy: choreObj.currentUser,
                    lastDoneDate: moment().format("MM/DD/YYYY h:mm a"),
                    lastDonePhoto: storageURL,
                    recursiveChore: choreObj.recursiveChore,
                    selectedUsers: choreObj.selectedUsers,
                    status: 'Incomplete'
                }
            } else {
                let nextUserKey = -1;
                for (var key in choreObj.selectedUsers) {
                    if (choreObj.selectedUsers[key] === choreObj.currentUser) {
                        nextUserKey = parseInt(key)
                    }
                }
                nextUserKey = (nextUserKey + 1) % choreObj.selectedUsers.length;

                let usersMap = {};
                for (var key in users) {
                    usersMap[users[key].uid] = users[key]
                }


                for (var i = 0; i < choreObj.selectedUsers.length; i++) {
                    let userUID = choreObj.selectedUsers[nextUserKey];
                    if (usersMap[userUID].outOfHouse == false) {
                        break
                    }
                    nextUserKey = (nextUserKey + 1) % choreObj.selectedUsers.length
                }
                let nextUserUID = choreObj.selectedUsers[nextUserKey];
                chore = {
                    choreName: choreObj.name,
                    currentUser: nextUserUID,
                    description: choreObj.description,
                    lastDoneBy: choreObj.currentUser,
                    lastDoneDate: moment().format("MM/DD/YYYY h:mm a"),
                    lastDonePhoto: storageURL,
                    recursiveChore: choreObj.recursiveChore,
                    selectedUsers: choreObj.selectedUsers,
                    status: 'Incomplete'
                }
            }
        } else {
            chore = {
                choreName: choreObj.name,
                currentUser: choreObj.currentUser,
                description: choreObj.description,
                lastDoneBy: choreObj.currentUser,
                lastDoneDate: moment().format("MM/DD/YYYY h:mm a"),
                lastDonePhoto: storageURL,
                recursiveChore: choreObj.recursiveChore,
                selectedUsers: choreObj.selectedUsers,
                status: 'Complete',
            };
        }

        chore.reminderActive = false
        chore.isChore = false
        chore.timestamp = ""

        res = await getDB({ data: {
                chore: chore,
                choreid: choreObj.key,
                groupid: this.groupid
            }}, "editChore");

        this.setState({modalVisible: false, photoURL: '', photoURI: ''});
    }

    onCompleteClicked(data) {
        this._swipeListView.safeCloseOpenRow();
        this.setState({modalVisible: true, currentSwipedKey: data.item.key});
    }

	onImageButtonPressed(){
	    ImagePicker.showImagePicker(options, async (response) => {
			if (response.didCancel) {
              console.log('User cancelled image picker');
			} else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
			  console.log('User tapped custom button: ', response.customButton);
			} else {
				const source = { data: response.data, uri: response.uri };

				this.setState({
					photoURL: source.data,
					photoURI: source.uri
			  });
            }
        });
    }

    async onInProgressButtonClicked(key) {

        let chore = {}
        let choreKey = key;
        let choreObj = this.state.myChoresList.find(chore => chore.key === choreKey);

        choreObj.status = "In Progress";

        chore = {
            choreName: choreObj.name,
            currentUser: choreObj.currentUser,
            description: choreObj.description,
            lastDoneBy: choreObj.lastDoneBy,
            lastDoneDate: choreObj.lastDoneDate,
            lastDonePhoto: this.state.photoURL,
            recursiveChore: choreObj.recursiveChore,
            selectedUsers: choreObj.selectedUsers,
            status: choreObj.status,
            reminderActive: choreObj.reminderActive,
            isChore: choreObj.isChore,
            timestamp: choreObj.timestamp
        };

        res = await getDB({
            data: {
                chore: chore,
                choreid: choreObj.key,
                groupid: this.groupid
            }
        }, "editChore");
    }

    renderSwipeOptions = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.inProgressButtonStyle]}
                onPress={async () => {await this.onInProgressButtonClicked(data.item.key)}}
            >
                <Icon name='progress-check' size={30}/>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.doneButtonStyle]}
                onPress={async () => {this.onCompleteClicked(data)
                }}
            >
                <Icon name='check' size={30}/>
            </TouchableOpacity>
        </View>
    );

    showImage() {
        if(this.state.photoURL !== ''){
            console.log('photo loaded')
            return(
                <Image
                    source={{uri: `data:image/png;base64,${this.state.photoURL}`}}
                    style={styles.modalImageStyle}
                />
            )
        }
    }

    onModalClose() {
        console.log("Modal Closed");
        this.setState({modalVisible: false, photoURL: ''});
    }

    async onReminderModalClose() {
        console.log("Reminder Modal Closed");
        let chore = {}
        let choreKey = this.state.reminderChoreKey;
        let choreObj = this.state.myChoresList.find(chore => chore.key === choreKey);
        console.log("My chores is ", JSON.stringify(this.state.myChoresList));
        console.log("Reminder chore name is ", this.state.reminderChoreName);
        console.log("Reminder chore key is ", this.state.reminderChoreKey);
        console.log("Chores is: ", JSON.stringify(choreObj));

        chore = {
            choreName: choreObj.name,
            currentUser: choreObj.currentUser,
            description: choreObj.description,
            lastDoneBy: choreObj.lastDoneBy,
            lastDoneDate: choreObj.lastDoneDate,
            lastDonePhoto: choreObj.lastDonePhoto,
            recursiveChore: choreObj.recursiveChore,
            selectedUsers: choreObj.selectedUsers,
            status: choreObj.status,
            reminderActive: false,
            isChore: choreObj.isChore,
            timestamp: choreObj.timestamp
        };

        console.log("Chore is ", JSON.stringify(chore));

        res = await getDB({
            data: {
                chore: chore,
                choreid: choreObj.key,
                groupid: this.groupid
            }
        }, "editChore");

        console.log("Result is ", JSON.stringify(res));
        this.setState({reminderModalVisible: false});
    }

    renderCards() {
        if (this.state.loading) {
            return (
                <View style={componentStyles.cardSectionWithBorderStyle}>
                    <ActivityIndicator animating={true} color={Colors.blue800} />
                </View>
            )
        } else {
            return (
                <View>
                    <View style={componentStyles.cardSectionWithBorderStyle}>
                        <Text style={styles.cardHeaderTextStyle}>Reminders for group</Text>
                        <SwipeListView
                            data={this.state.remindersList}
                            renderItem={this.renderMyChores}
                            disableRightSwipe={true}
                            disableLeftSwipe={true}
                            onRowDidOpen={this.onRowDidOpen}
                        />
                    </View>
                    <View style={componentStyles.cardSectionWithBorderStyle}>
                        <Text style={styles.cardHeaderTextStyle}>My Chores</Text>
                        <SwipeListView
                            data={this.state.myChoresList}
                            renderItem={this.renderMyChores}
                            renderHiddenItem={this.renderSwipeOptions}
                            rightOpenValue={-150}
                            disableRightSwipe={true}
                            previewRowKey={'0'}
                            previewOpenValue={-40}
                            previewOpenDelay={5000}
                            onRowDidOpen={this.onRowDidOpen}
                            ref={ref => this._swipeListView = ref}
                        />
                    </View>
                    <View style={componentStyles.cardSectionWithBorderStyle}>
                        <Text style={styles.cardHeaderTextStyle}>All Chores</Text>
                        <SwipeListView
                            data={this.state.allChoresList}
                            renderItem={this.renderAllChores}
                            disableRightSwipe={true}
                            disableLeftSwipe={true}
                            onRowDidOpen={this.onRowDidOpen}
                        />
                    </View>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <Portal>
                        <Modal
                            visible={this.state.modalVisible}
                            onDismiss = {() => { this.onModalClose() }}
                            contentContainerStyle={styles.containerStyle}
                        >
                            <Text style={styles.modalHeaderTextStyle}>COMPLETE CHORE</Text>
                            <Button onPress={this.onImageButtonPressed.bind(this)}>
                                <Text style={styles.modalHeaderTextStyle}>
                                    Add Image
                                </Text>
                            </Button>
                            <TouchableOpacity
                                style={{justifyContent: 'center', alignItems: 'center'}}
                            >
                                {this.showImage()}
                            </TouchableOpacity>
                            <Button onPress={async () => {this.onDoneButtonClicked()}}>
                                <Text style={styles.modalHeaderTextStyle}>
                                    Done
                                </Text>
                            </Button>
                            <Button onPress={()=>{this.onModalClose()}}>
                                Cancel
                            </Button>
                        </Modal>
                    </Portal>
                    <Portal>
                        <Modal
                            visible={this.state.reminderModalVisible}
                            onDismiss = {async () => {
                                await this.onReminderModalClose()
                            }}
                            contentContainerStyle={styles.containerStyle}
                        >
                            <Text style={styles.modalHeaderTextStyle}>Reminder to complete chore: {this.state.reminderChoreName}</Text>
                            <Button onPress={async () => {
                                await this.onReminderModalClose()
                            }}>
                                Dismiss reminder
                            </Button>
                        </Modal>
                    </Portal>
                <ScrollView>
                        {this.renderCards()}
                </ScrollView>
                </PaperProvider>
                <FAB
                        style={styles.fab}
                        small
                        color={theme.darkColor}
                        icon="plus"
                        onPress={() => {
                            console.log("Pressed fab");
                            this.props.navigation.navigate('CreateChore');
                        }}
                />
            </View>
        );
    }
}

const styles = {

    cardHeaderTextStyle: {
        fontWeight: 'bold',
        color: theme.buttonTextColor,
        textAlign: 'center',
        marginBottom: 20
    },
    rowFront: {
        backgroundColor: theme.lightColor,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        flex: 1,
        paddingLeft: 20,
        padding: 10,
        margin: 7
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    inProgressButtonStyle: {
        backgroundColor: 'yellow',
        right: 75,
    },
    doneButtonStyle: {
        backgroundColor: '#09af00',
        right: 0,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme.lightColor
    },
    modalImageStyle: {
        height: 150,
        width: 150,
        alignItems: 'center'
    },
    modalHeaderTextStyle:{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: theme.bigButtonFontSize
    },
    containerStyle : {
        backgroundColor: 'white',
        padding: 20,
    },
};


export default ChoresTab;
