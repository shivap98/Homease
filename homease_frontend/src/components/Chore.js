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
    };

    constructor(props) {
        super(props);
    }

    async componentDidMount(){

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
        } }, "getGroupFromGroupID");


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

        console.log("Selected user is "+ chore.selectedUsers);

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
            groupid: groupid
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
            console.log("users are "+this.state.users);
            console.log("CURRENT USER IS: "+this.state.currentUser);
            let currentUser = this.state.users.find(x => x.uid === this.state.currentUser);
            return currentUser.name;
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
        let previousUser = this.state.previousUser;
        return (
            <View>
                <Text style={styles.unselectedTextStyle}>
                    {previousUser}
                </Text>
                <Button
                    color={theme.buttonColor}
                    style={{...styles.buttonContainedStyle, marginTop: 20}}
                    mode="contained"
                    onPress={() => {this.onRollBackClicked()}}
                >
                    <Text style={componentStyles.smallButtonTextStyle}>
                        Rollback chore
                    </Text>
                </Button>
            </View>
        )
    }

    showPreviousUser(){
        if(this.state.recursiveChore === true){
            return (
                <List.Accordion
                    title="Last Completed by"
                    onPress={() => {LayoutAnimation.easeInEaseOut()}}
                >
                    {this.renderPreviousUser()}
                </List.Accordion>
            )
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

    onRollBackClicked(){
        console.log("ROLLBACK CLICKED");
    }

    onCompleteClicked() {
        console.log("Complete button pressed");
        this.setState({modalVisible: true});
    }

    onInProgressButtonClicked() {
        console.log("In Progress button pressed")
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
        console.log("CLICKED DONE.")
        console.log(this.state.selectedUsers)
        console.log('recursive: ', this.state.recursiveChore)
        console.log(this.state.users)

        let chore = {}

        if (this.state.recursiveChore) {
            let users = this.state.users

            if (this.state.selectedUsers.length == 1) {
                chore = {
                    choreName: this.state.choreName,
                    currentUser: this.state.currentUser,
                    description: this.state.description,
                    lastDoneBy: this.state.currentUser,
                    lastDoneDate: moment().format("MM/DD/YYYY h:mm a"),
                    lastDonePhoto: this.state.photoURL,
                    recursiveChore: this.state.recursiveChore,
                    selectedUsers: this.state.selectedUsers,
                    status: 'Incomplete'
                }
            } else {
                let nextUserKey = -1
                for (var key in this.state.selectedUsers) {
                    if (this.state.selectedUsers[key] == this.state.currentUser) {
                        nextUserKey = key
                    }
                }
                nextUserKey = (nextUserKey + 1) % this.state.selectedUsers.length
                console.log(nextUserKey)

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
                chore = {
                    choreName: this.state.choreName,
                    currentUser: nextUserUID,
                    description: this.state.description,
                    lastDoneBy: this.state.currentUser,
                    lastDoneDate: moment().format("MM/DD/YYYY h:mm a"),
                    lastDonePhoto: this.state.photoURL,
                    recursiveChore: this.state.recursiveChore,
                    selectedUsers: this.state.selectedUsers,
                    status: 'Incomplete'
                }
            }

        } else {
            chore = {
                choreName: this.state.choreName,
                currentUser: this.state.currentUser,
                description: this.state.description,
                lastDoneBy: this.state.currentUser,
                lastDoneDate: moment().format("MM/DD/YYYY h:mm a"),
                lastDonePhoto: this.state.photoURL,
                recursiveChore: this.state.recursiveChore,
                selectedUsers: this.state.selectedUsers,
                status: 'Complete',
            }
        }

        console.log(chore)

        res = await getDB({ data: {
            chore: chore,
            choreid: this.state.choreid,
            groupid: this.state.groupid
        }}, "editChore");
        console.log(res)

        this.setState({modalVisible: false, photoURL: ''});
        this.props.navigation.goBack()
    }

    onModalClose() {
        console.log("Modal Closed");
        this.setState({modalVisible: false, photoURL: ''});
    }

	onImageButtonPressed() {
		ImagePicker.showImagePicker(options, (response) => {
			if (response.didCancel) {
              console.log('User cancelled image picker');
			} else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
			  console.log('User tapped custom button: ', response.customButton);
			} else {
				const source = { uri: response.data };
				this.setState({
				  	photoURL: source.uri,
				});
            }
        });

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
                                                    chore: {
                                                        choreName: this.state.choreName,
                                                        selectedUsers: this.state.selectedUsers,
                                                        recursiveChore: this.state.recursiveChore,
                                                        description: this.state.description,
                                                        currentUser: this.state.currentUser,
                                                        status: this.state.status,
                                                        lastDoneDate: this.state.lastDoneDate,
                                                        lastDoneBy: this.state.lastDoneBy,
                                                        lastDonePhoto: this.state.lastDonePhoto
                                                    }
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

                            <CardSection>

                                <Button
                                    color={theme.buttonColor}
                                    style={styles.buttonContainedStyle}
                                    mode="contained"
                                    onPress={() => {this.onInProgressButtonClicked()}}
                                >
                                    <Text style={componentStyles.smallButtonTextStyle}>
                                                In Progress
                                    </Text>
                                </Button>
                                <Button
                                    color={theme.buttonColor}
                                    style={styles.buttonContainedStyle}
                                    mode="contained"
                                    onPress= {() => {this.onCompleteClicked()}}
                                >
                                    <Text style={componentStyles.smallButtonTextStyle}>
                                        Complete
                                    </Text>
                                </Button>


                            </CardSection>
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
