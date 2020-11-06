import React, {Component} from "react";
import {ScrollView, View, Image, Text, Alert, LayoutAnimation, Platform, TouchableOpacity} from 'react-native';
import {Button, List, Provider as PaperProvider, Switch, TextInput, Modal, Portal} from 'react-native-paper';
import paperTheme from './common/paperTheme';
import theme from './common/theme';
import getDB from './Cloud';
import {CardSection} from './common';
import componentStyles from './common/componentStyles';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import firebase from 'firebase';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';



const options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

class Chore extends Component{

    state = {
        choreName: "",
        currentUser: "",
        description: "",
        lastDoneBy: "",
        lastDoneDate: "",
        lastDonePhoto: "",
        recursiveChore: "",
        selectedUsers: [],
        users: [],
        status: "",
        choreid: "",
        groupid: "",
		photoURL: "",
		previousUser: "",
        edit: false,
        loggedInUID: "temp"
    };

    constructor(props) {
        super(props);
    }

    packageChoreObj() {
        let chore = {
            choreName: this.state.choreName,
            currentUser: this.state.currentUser,
            description: this.state.description,
            lastDoneBy: this.state.lastDoneBy,
            lastDoneDate: this.state.lastDoneDate,
            lastDonePhoto: this.state.photoURL,
            recursiveChore: this.state.recursiveChore,
            selectedUsers: this.state.selectedUsers,
            status: this.state.status,
        }

        return chore
    }

    async componentDidMount(){

        var uid = null
        if (auth().currentUser) {
            uid = auth().currentUser.uid

            this.setState({ uid: auth().currentUser.uid })
        } else {
            uid = firebase.auth().currentUser.uid
            this.setState({ uid: firebase.auth().currentUser.uid })
        }

        let groupid = this.props.route.params.groupid;
        let choreid = this.props.route.params.key;

        let chore = await getDB({ data: {
                groupid: groupid,
                choreid: choreid
            }},
            "getChoreByID");

        chore = chore.result;


        let groupInfo = await getDB({ data: {
            groupid: groupid
        }}, "getGroupFromGroupID");


        let mems = groupInfo.result.users;
        let users = [];
        for (var key in mems) {
            var user = await getDB({ data: { uid: mems[ key ] } }, "getUser");
            users.push({ name: user.result.firstName + " " + user.result.lastName, uid: mems[ key ], outOfHouse: user.result.outOfHouse });
        }

        users = users.map(user => {
            if(chore.selectedUsers.includes(user.uid)){
                user.selected = true;
            }else{
                user.selected = false;
            }
            return user;
        });

        this.setState({
            choreName: chore.choreName,
            currentUser: chore.currentUser,
            description: chore.description,
            lastDoneBy: chore.lastDoneBy,
            lastDoneDate: chore.lastDoneDate,
            lastDonePhoto: chore.lastDonePhoto,
            recursiveChore: chore.recursiveChore,
            users: users,
            selectedUsers: chore.selectedUsers,
            status: chore.status,
            choreid: choreid,
            groupid: groupid,
            loggedInUID: uid
        });
    }

    onSelectPressed(selectedUser, index){
        console.log("Select pressed");
        if(this.state.edit === true) {
            let users = this.state.users;
            if (this.state.recursiveChore === true) {
                if(users[index].uid === this.state.currentUser){
                    Alert.alert(
                        'Oops!',
                        'Current user cannot be removed from Recurring Chores',
                        [
                            {
                                text: 'OK',
                                onPress: () => {},
                                style: 'cancel',
                            },

                        ],
                        {cancelable: false},
                    );
                }else {
                    users[index].selected = !selectedUser.selected;
                    let selectedUsers = this.state.selectedUsers;
                    if (users[index].selected === true) {
                        selectedUsers.push(users[index].uid);
                    } else {
                        selectedUsers = selectedUsers.filter(user => user !== users[index].uid);
                    }
                    this.setState({users: users, selectedUsers: selectedUsers});
                }
            } else {
                if (selectedUser.selected === false) {
                    console.log("Clicked new user");
                    users = users.map(user => {
                        user.selected = false;
                        return user;
                    });
                    users[index].selected = true;
                    let selectedUsers = [];
                    selectedUsers.push(users[index].uid);
                    this.setState({users: users, selectedUsers: selectedUsers, currentUser: selectedUsers[0]});
                } else {
                    console.log("Clicked selected user again");
                }
            }
        } else {
            Alert.alert(
                'Oops!',
                'Click the edit button to update chore assignments',
                [
                    {
                        text: 'OK',
                        onPress: () => {},
                        style: 'cancel',
                    },

                ],
                {cancelable: false},
            );
        }
    }

    getCurrentUserName() {
        if(this.state.users.length > 0) {
            let users = this.state.users
            for (var key in users) {
                if (users[key].uid === this.state.currentUser) {
                    return users[key].name
                }
            }
        }
    }

    getUserNameFromId(userId) {
        if(this.state.users.length>0){
            let users = this.state.users
            for (var key in users) {
                if (users[key].uid === userId) {
                    return users[key].name
                }
            }
        }
    }

    renderListOfMembers() {
        let members = this.state.users;
        return members.map((item, index) => {
            return(
                <List.Item
                    title={item.name}
                    titleStyle={(item.selected) ? styles.selectedTextStyle : styles.unselectedTextStyle}
                    key={index}
                    onPress={() => {
                        this.onSelectPressed(item, index);
                    }}
                />
            )
        })
    }

    renderPreviousUser (){
        let previousUserId = this.state.lastDoneBy;
        let previousUserName = this.getUserNameFromId(previousUserId);
        if (previousUserName) {
            return (
                <View>
                    <Text style={styles.unselectedTextStyle}>
                        {previousUserName}
                    </Text>
                    <Text style={styles.unselectedTextStyle}>
                        {this.state.lastDoneDate}
                    </Text>
                    {this.showPreviousImage()}
                    <Button
                        color={theme.buttonColor}
                        style={{...styles.buttonContainedStyle, marginTop: 20}}
                        mode="contained"
                        onPress={async = () => {this.onRollBackClicked()}}
                    >
                        <Text style={componentStyles.smallButtonTextStyle}>
                            Rollback chore
                        </Text>
                    </Button>
                </View>
            )
        } else {
            return(
                <Text style={styles.unselectedTextStyle}>
                    Chore not completed yet
                </Text>
            )
        }
    }

    showPreviousUser(){
        if(this.state.recursiveChore === true){
            return (
                <List.Accordion
                    title="Last Completed By"
                    onPress={() => {LayoutAnimation.easeInEaseOut()}}
                >
                    {this.renderPreviousUser()}
                </List.Accordion>
            )
        } else {
            let previousUserId = this.state.lastDoneBy;
            let previousUserName = this.getUserNameFromId(previousUserId);
            if (previousUserName) {
                return (
                    <View>
                        <Text style={styles.unselectedTextStyle}>
                            {previousUserName}
                        </Text>
                        <Text style={styles.unselectedTextStyle}>
                            {this.state.lastDoneDate}
                        </Text>
                        {this.showPreviousImage()}
                    </View>
                )
            } else {
                return(
                    <Text style={styles.unselectedTextStyle}>
                        Chore not completed yet
                    </Text>
                )
            }
        }
    }

    showGroupMembers(){
        return(
            <View>
                <List.Accordion
                    title="List of members"
                    onPress={() => {LayoutAnimation.easeInEaseOut()}}
                >
                    {this.renderListOfMembers()}
                </List.Accordion>
            </View>
        )
    }

    renderProgressButtons() {
        if (this.state.loggedInUID === this.state.currentUser && this.state.status !== 'Complete') {
            return (
                <CardSection>
                    <Button
                        color={theme.buttonColor}
                        style={styles.buttonContainedStyle}
                        mode="contained"
                        onPress={() => {
                            Alert.alert(
                                'This will mark the chore \'In Progress\'. Are you sure?',
                                '',
                                [
                                    {
                                        text: 'No',
                                        onPress: () => { },
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Yes',
                                        onPress: () => { this.onInProgressButtonClicked() },
                                    }
                                ],
                                { cancelable: false },
                            );
                        }}
                    >
                        <Text style={componentStyles.smallButtonTextStyle}>
                            In Progress
                                    </Text>
                    </Button>
                    <Button
                        color={theme.buttonColor}
                        style={styles.buttonContainedStyle}
                        mode="contained"
                        onPress={() => { this.onCompleteClicked() }}
                    >
                        <Text style={componentStyles.smallButtonTextStyle}>
                            Complete
                        </Text>
                    </Button>


                </CardSection>
            )
        }
        else {
            return (<View/>)
        }
    }

    async onRollBackClicked(){
        console.log("ROLLBACK CLICKED");
        let chore = this.packageChoreObj()
        chore.currentUser = this.state.lastDoneBy
        chore.status = 'Incomplete'
        res = await getDB({ data: {
            chore: chore,
            choreid: this.state.choreid,
            groupid: this.state.groupid
        }}, "editChore");
        console.log(res)

        this.props.navigation.goBack()
    }

    onCompleteClicked() {
        console.log("Complete button pressed");
        this.setState({modalVisible: true});
    }

    async onInProgressButtonClicked() {
        console.log("In Progress button pressed")

        this.setState({
            status: "In Progress"
        })

        chore = this.packageChoreObj()
        chore.status = "In Progress"

        res = await getDB({
            data: {
                chore: chore,
                choreid: this.state.choreid,
                groupid: this.state.groupid
            }
        }, "editChore");

        console.log(res)

        if (res.result === "success") {
            this.props.navigation.goBack()
        }
    }
    async onDeleteButtonClicked() {
        console.log("Delete button pressed")
        let ans = await getDB({
            data: {
                groupid: this.state.groupid,
                choreid: this.state.choreid
            }
        }, "deleteChore");

        if (ans.result === "success") {

            this.props.navigation.goBack()
        }
    }

    async onDoneButtonClicked() {

		const uploadUri = Platform.OS === 'ios' ? this.state.photoURI.replace('file://', '') : this.state.photoURI;

		imageRef = storage().ref(this.state.choreid)

		await imageRef.putFile(uploadUri);
		storageURL = await imageRef.getDownloadURL()
		console.log(storageURL)
        console.log("CLICKED DONE.")
        console.log(this.state.selectedUsers)

        let chore = this.packageChoreObj()

        if (this.state.recursiveChore) {
            let users = this.state.users

            if (this.state.selectedUsers.length == 1) {
                chore.lastDoneBy = this.state.currentUser
                chore.lastDoneDate = moment().format("MM/DD/YYYY h:mm a")
                chore.lastDonePhoto = storageURL
                chore.status = 'Incomplete'
            } else {
                let nextUserKey = -1
                for (var key in this.state.selectedUsers) {
                    if (this.state.selectedUsers[key] == this.state.currentUser) {
                        nextUserKey = parseInt(key)
                        break
                    }
                }
                nextUserKey = (nextUserKey + 1) % this.state.selectedUsers.length

                let usersMap = {}
                for (var key in users) {
                    usersMap[users[key].uid] = users[key]
                }

                for (var i = 0; i < this.state.selectedUsers.length; i++) {
                    let userUID = this.state.selectedUsers[nextUserKey]
                    if (usersMap[userUID].outOfHouse == false) {
                        break
                    }
                    nextUserKey = (nextUserKey + 1) % this.state.selectedUsers.length
                }
                let nextUserUID = this.state.selectedUsers[nextUserKey]
                
                chore.currentUser = nextUserUID
                chore.lastDoneBy = this.state.currentUser
                chore.lastDoneDate = moment().format("MM/DD/YYYY h:mm a")
                chore.lastDonePhoto = storageURL
                chore.status = 'Incomplete'
            }

        } else {
            chore.lastDoneBy = this.state.currentUser
            chore.lastDoneDate = moment().format("MM/DD/YYYY h:mm a")
            chore.lastDonePhoto = storageURL
            chore.status = 'Complete'
		}
		
		console.log(chore)

        res = await getDB({ data: {
            chore: chore,
            choreid: this.state.choreid,
            groupid: this.state.groupid
        }}, "editChore");
        console.log(res)

        this.setState({modalVisible: false, photoURL: ''});
        if (res.result === "success") {
            this.props.navigation.goBack()
        }
    }

    onModalClose() {
        console.log("Modal Closed");
        this.setState({modalVisible: false, photoURL: ''});
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

				// try {
				//   await task;
				// } catch (e) {
				//   console.error(e);
				// }

				//const {imageName, uploadUri} = this.state;
				// firebase
				// .storage()
				// .ref(filename)
				// .putFile(uploadUri)
				// .then((snapshot) => {
				// 	//You can check the image is now uploaded in the storage bucket
				// 	console.log(`${imageName} has been successfully uploaded.`);
				// })
				// .catch((e) => console.log('uploading image error => ', e));

				this.setState({
					photoURL: source.data,
					photoURI: source.uri
			  });
            }
        });

    }

    showPreviousImage() {
        if(this.state.lastDonePhoto !== ''){
            console.log('photo loaded');
            return(
                <View style={{alignItems: 'center'}}>
                    <Image
                        source={{uri: `data:image/png;base64,${this.state.photoURL}`}}
                        style={styles.lastDoneImageStyle}
                    />
                </View>
            )
        }
    }

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

    displayChoreType() {
        let message = "Loading info...";
        if(this.state.recursiveChore === false) {
            message = "This is a non-recurring chore.";
        }
        else if(this.state.recursiveChore === true){
            message = "This is a recurring chore.";
        }
        return(
            <Text style={styles.cardHeaderTextStyle}>{message}</Text>
        )
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
								onPress={this.onImageButtonPressed.bind(this)}
							>
								{this.showImage()}
                			</TouchableOpacity>
                            <Button onPress={async = () => {this.onDoneButtonClicked()}}>
                                <Text style={styles.modalHeaderTextStyle}>
                                    Done
                                </Text>
                            </Button>
                            <Button onPress={()=>{this.onModalClose()}}>
                                Cancel
                            </Button>
                        </Modal>
                    </Portal>
                    <ScrollView>
                        <View style={styles.viewStyle}>
                            <CardSection>
                                <Text style={{
                                    fontWeight: 'bold',
                                    flex: 1,
                                    marginTop: 7,
                                    marginRight: 15,
                                    color: 'white',
                                    textAlign: 'right'
                                }}>
                                    EDIT
                                </Text>
                                <Switch
                                    value={this.state.edit}
                                    onValueChange={async = () => {
                                        if(this.state.edit === true) {
                                            getDB({
                                                data: {
                                                    groupid: this.state.groupid,
                                                    choreid: this.state.choreid,
                                                    chore: this.packageChoreObj()
                                                }
                                            }, "editChore");
                                        }
                                        this.setState({edit: !this.state.edit})
                                    }}
                                />
                            </CardSection>
                            <View style={componentStyles.cardSectionWithBorderStyle}>
                                {this.displayChoreType()}
                                <TextInput
                                    style={styles.textInputStyle}
                                    label='Chore Name'
                                    mode='outlined'
                                    theme={{
                                        colors: {
                                            placeholder: this.state.edit ? 'white' : theme.lightColor,
                                            text: this.state.edit ? 'white' : theme.lightColor,
                                            primary: this.state.edit ? 'white' : theme.lightColor,
                                        }
                                    }}
                                    value={this.state.choreName}
                                    onChangeText={textString => this.setState({choreName: textString})}
                                    editable={this.state.edit}
                                />
                                <TextInput
                                    style={styles.textInputStyle}
                                    label='Chore Description'
                                    mode='outlined'
                                    theme={{
                                        colors: {
                                            placeholder: this.state.edit ? 'white' : theme.lightColor,
                                            text: this.state.edit ? 'white' : theme.lightColor,
                                            primary: this.state.edit ? 'white' : theme.lightColor,
                                        }
                                    }}
                                    multiline= {true}
                                    value={this.state.description}
                                    onChangeText={textString => this.setState({description: textString})}
                                    editable={this.state.edit}
                                />
                                <TextInput
                                        style={styles.textInputStyle}
                                        label='Current User'
                                        mode='outlined'
                                        value={this.getCurrentUserName()}
                                        keyboardAppearance='dark'
                                        editable={false}
                                        onChangeText={textString => {}}
                                />
                                {this.showGroupMembers()}
                            </View>
                            <View style={componentStyles.cardSectionWithBorderStyle}>
                                <Text style={styles.cardHeaderTextStyle}>LAST DONE INFORMATION</Text>
                                {this.showPreviousUser()}
                            </View>
                            {this.renderProgressButtons()}

                            
                            <Button
                                color={theme.buttonColor}
                                style={{...styles.buttonContainedStyle, marginLeft: 15, marginRight: 15}}
                                mode="contained"
                                color='red'
                                onPress={() => {
                                    Alert.alert(
                                        'Are you sure?',
                                        '',
                                        [
                                            {
                                                text: 'No',
                                                onPress: () => {},
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'Yes',
                                                onPress: () => {this.onDeleteButtonClicked()},
                                            }
                                        ],
                                        {cancelable: false},
                                    );
                                }}
                            >
                                <Text style={componentStyles.smallButtonTextStyle}>
                                            Delete
                                </Text>
                            </Button>
                        </View>
                    </ScrollView>
                </PaperProvider>
            </View>
        )
    }
}

const styles = {

    viewStyle: {
        margin: 10,
        padding: 12,
        flex: 1,
    },

    textInputStyle: {
        flex: 1,
        marginTop: 20
    },

    buttonContainedStyle: {
        height: 47,
        justifyContent: 'center',
        flex: 1,
        margin: 5
    },
    cardHeaderTextStyle: {
        fontWeight: 'bold',
        marginTop: 10,
        flex: 1,
        color: theme.buttonTextColor,
        textAlign: 'center'
    },
    selectedTextStyle:{
        fontWeight: 'bold',
        marginTop: 10,
        flex: 1,
        color: theme.lightColor,
        textAlign: 'center'
    },
    unselectedTextStyle:{
        fontWeight: 'bold',
        marginTop: 10,
        flex: 1,
        color: theme.buttonTextColor,
        textAlign: 'center'
	},
	profilePicStyle: {
        height: 150,
        width: 150,
        alignItems: 'center',
        flex: 1,
    },
    modalImageStyle: {
        height: 150,
        width: 150,
        alignItems: 'center'
    },
    lastDoneImageStyle: {
        height: 200,
        width: 200,
        alignItems: 'center'
    },
    containerStyle : {
        backgroundColor: 'white',
        padding: 20,
    },
    modalHeaderTextStyle:{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: theme.bigButtonFontSize
    }
};

export default Chore;
