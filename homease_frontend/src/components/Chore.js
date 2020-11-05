import React, {Component} from "react";
import {ScrollView, View, Image, Text, Alert, LayoutAnimation, Platform, TouchableOpacity} from 'react-native';
import {Button, List, Provider as PaperProvider, Switch, TextInput, Modal, Portal} from 'react-native-paper';
import paperTheme from './common/paperTheme';
import theme from './common/theme';
import getDB from './Cloud';
import {CardSection} from './common';
import componentStyles from './common/componentStyles';
import ImagePicker from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';



const options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

class Chore extends Component{

    state = {
		choreName: '',
		avatarSource: '',
        users: [
            {name: 'user1', selected: false},
            {name: 'user2', selected: false},
            {name: 'user3', selected: false}
        ],
        chores: [
            {key: '1', name: 'Dishes', status: 'incomplete', description: 'Chore 1', recursiveChore: true, selectedUsers: ['user1', 'user3'], currentUser: 'user1', previousUser: 'user3'},
            {key: '2', name: 'Cleaning', status: 'in progress', description: 'Chore 2', recursiveChore: false, selectedUsers: ['user2'], currentUser: 'user2'}
		],
		photoURL: '',
        recursiveChore: false,
        description: '',
        multiLine: true,
        currentUser: '',
        previousUser: '',
        edit: false,
        modalVisible: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        //TODO: change this for actual db call
        // let chore = this.state.chores.filter(chore =>{
        //     return chore.key === this.props.route.params.key;
        // })[0];

        // console.log(this.props.route.params.key)
        let chore = this.state.chores[0]
        console.log(chore.name);

        let users = this.state.users;
        users = users.map(user =>{
            if(chore.selectedUsers.includes(user.name)){
                user.selected = true;
            }
            return user;
        });
        console.log(users);
        this.props.navigation.setOptions({ title: 'Chore' });
        this.setState({choreName: chore.name, description: chore.description, users: users,selectedUsers: chore.selectedUsers, recursiveChore: chore.recursiveChore, currentUser: chore.currentUser, previousUser: chore.previousUser});
    }

    onSelectPressed(selectedUser, index){
        console.log("Select pressed");
        if(this.state.edit === true) {
            let users = this.state.users;
            if (this.state.recursiveChore === true) {
                users[index].selected = !selectedUser.selected;
                let selectedUsers = this.state.selectedUsers;
                if (users[index].selected === true) {
                    selectedUsers.push(users[index].name);
                } else {
                    selectedUsers = selectedUsers.filter(user => user !== users[index].name);
                }
                this.setState({users: users, selectedUsers: selectedUsers});
            } else {
                if (selectedUser.selected === false) {
                    console.log("Clicked new user");
                    users = users.map(user => {
                        user.selected = false;
                        return user;
                    });
                    users[index].selected = true;
                    let selectedUsers = [];
                    selectedUsers.push(users[index].name);
                    this.setState({users: users, selectedUsers: selectedUsers}); //UPDATE CURRENT USER FIELD ONLY IF THEY SAVE CHANGES
                } else {
                    console.log("Clicked selected user again");
                }
            }
        }else{
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

    renderListOfMembers (){
        let members = this.state.users;
        return members.map((item, index)=>{
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

    onEditClicked(){
        console.log("edit was "+this.state.edit);

        let users = this.state.users;
        let hasSelectedUsers = users.some(user => user.selected === true);
        if(hasSelectedUsers === false){
            Alert.alert(
                'Oops!',
                'Please select at least one user to assign the chore to!',
                [
                    {
                        text: 'OK',
                        onPress: () => {},
                        style: 'cancel',
                    },

                ],
                {cancelable: false},
            );
        } else {
            this.setState({edit: !this.state.edit})
        }

    }


    onRollBackClicked(){
        console.log("ROLLBACK CLICKED");
    }

    onCompleteClicked() {
        console.log("Complete button pressed");
        this.setState({modalVisible: !this.state.modalVisible});
    }

    onInProgressButtonClicked() {
        console.log("In Progress button pressed")
    }
    onDeleteButtonClicked() {
        console.log("Delete button pressed")

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

	onImageButtonPressed() {
		ImagePicker.showImagePicker(options, (response) => {
			// console.log('Response = ', response);

			if (response.didCancel) {
			  console.log('User cancelled image picker');
			} else if (response.error) {
			  console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
			  console.log('User tapped custom button: ', response.customButton);
			} else {
				// this.setState({
                //     photoURL: response.uri,
				// });
				
				const source = { uri: response.uri };

				// You can also display the image using data:
				// const source = { uri: 'data:image/jpeg;base64,' + response.data };
			
				this.setState({
				  avatarSource: source,
				});
            }
        });
			
	}

	showImage(){
		//console.log('PhotoUrl is: ' + this.state.photoURL)

		

        if(this.state.photoURL !== ''){

// 			ImgToBase64.getBase64String(this.state.photoURL)
//   .then(base64String => console.log(base64String))
//   .catch(err => console.log(error));
            
            return(
                // <TouchableOpacity
                //     style={{justifyContent: 'center', alignItems: 'center'}}
                //     onPress={this.onImageButtonPressed.bind(this)}
                // >
                    <Image
                        source={{uri: this.state.avatarSource}}
                        style={styles.modalImageStyle}
                        //resizeMode='contain'
                    />
                // </TouchableOpacity>
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
                            onDismiss = {() => { this.onCompleteClicked() }}
                            contentContainerStyle={styles.containerStyle}
                        >
                            <Text style={styles.modalHeaderTextStyle}>COMPLETE CHORE</Text>
                            <Button onPress={this.onImageButtonPressed.bind(this)}>
                                <Text style={styles.modalHeaderTextStyle}>
                                    Add Image
                                </Text>
                            </Button>
                            <Button onPress={()=>{console.log("CLICKED DONE.")}}>
                                <Text style={styles.modalHeaderTextStyle}>
                                    Done
                                </Text>
                            </Button>
							{/* {this.showImage()} */}
							<Image
								source={{uri: this.state.avatarSource.uri}}
								style={styles.modalImageStyle}
								//resizeMode='contain'
							/>
                            <Button onPress={()=>{this.onCompleteClicked()}}>
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
                                        getDB({ data: {
                                            uid: this.state.uid,
                                            phoneNumber: this.state.phoneNumber,
                                            venmoUsername: this.state.venmoUsername
                                        }}, "editUser");
                                        if (this.state.groupid && this.state.groupid != '') {
                                            getDB({ data: {
                                                groupid: this.state.groupid,
                                                groupName: this.state.groupName,
                                            }}, "editGroup");
                                        }
                                        this.setState({edit: !this.state.edit})
                                    }}
                                />
                            </CardSection>
                            <View style={componentStyles.cardSectionWithBorderStyle}>
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
                                    value={this.state.currentUser}
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
