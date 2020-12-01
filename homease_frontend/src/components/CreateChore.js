import React, {Component} from "react";
import {ScrollView, View, Text, Alert, LayoutAnimation, TouchableOpacity} from 'react-native';
import {Button, List, Provider as PaperProvider, Switch, TextInput, Dialog, Modal, Portal} from 'react-native-paper';
import paperTheme from './common/paperTheme';
import theme from './common/theme';
import getDB from './Cloud';
import {CardSection} from './common';
import componentStyles from './common/componentStyles';
import auth from '@react-native-firebase/auth';
import firebase from 'firebase';
import DatePicker from 'react-native-date-picker';

class CreateChore extends Component{
    state = {
		choreName: '',
		groupid: '',
        users: [
            {name: 'user1', selected: false},
            {name: 'user2', selected: false},
            {name: 'user3', selected: false}
        ],
        selectedUsers:[],
        recursiveChore: false,
        description: '',
        multiLine: true,
        isChore: true,
        timestamp: new Date(),
        modalVisible: false,
    };

    constructor(props) {
		super(props);
	}

	async getDbUserInfo(res){
		grp = await getDB({data: {groupid: res.result.groupid} }, "getGroupFromGroupID")
		mems = grp.result.users
		values = []
		for (var key in mems) {
			var user = await getDB({data: {uid: mems[key]} }, "getUser")
			values.push({name: user.result.firstName + " " + user.result.lastName, admin: user.result.admin, uid: mems[key], selected: false});
		}
		this.setState({
			groupid: res.result.groupid,
			users: values,
		})
	}

    async componentDidMount() {
        this.props.navigation.setOptions({title: 'Create'})
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
			firebase.database().ref('/groups/'+res.result.groupid + '/users/').on('value', (snapshot) => {
				this.getDbUserInfo(res)
			})
		}
    }

    onSelectPressed(selectedUser, index){
        console.log("Select pressed");
        if(!this.state.isChore){
            Alert.alert(
                'Oops!',
                'Reminders are automatically assigned to entire group!',
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
            console.log("selected users at time of click" + this.state.selectedUsers);
            let users = this.state.users;
            if (this.state.recursiveChore === true) {
                users[index].selected = !selectedUser.selected;
                let selectedUsers = this.state.selectedUsers;
                if (users[index].selected === true) {
                    selectedUsers.push(users[index].uid);
                } else {
                    selectedUsers = selectedUsers.filter(user => user !== users[index].uid);
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
                    selectedUsers.push(users[index].uid);
                    this.setState({users: users, selectedUsers: selectedUsers});
                } else {
                    console.log("Clicked selected user again");
                }
            }
        }
    }

    renderListOfMembers (){
		let members = this.state.users;
		if(members){
			return members.map((item, index)=>{
				return(
					<List.Item
						title={item.name}
						titleStyle={(item.selected) ? styles.selectedTextStyle : styles.unselectedTextStyle}
						key={index}
						onPress={() => {this.onSelectPressed(item, index)}}
					/>
				)
			})
		}
    }

    onRecursiveClicked(){
        if(this.state.recursiveChore === true){
            let users = this.state.users;
            users = users.map(user => {
                user.selected=false;
                return user;
            });
            console.log("Setting recursiveChore to false");
            let selectedUsers = [];
            this.setState({users: users, recursiveChore: false, selectedUsers: selectedUsers})
        }else{
            this.setState({recursiveChore: true})
        }
    }

    async onCreateChorePressed(){
        console.log("Clicked create chore button");
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
		}

		let resp = await getDB(
		{
			data: {
				groupid: this.state.groupid,
				choreName: this.state.choreName,
				selectedUsers: this.state.selectedUsers,
				recursiveChore: this.state.recursiveChore,
				description: this.state.description,
				status: "Incomplete",
                currentUser: this.state.selectedUsers[ 0 ],
                reminderActive: false,
                isChore: true,
                timestamp: ""
			},
		},
		'createChore');

        console.log(resp)
        this.props.navigation.goBack()
    }

    async onCreateReminderPressed(){
        console.log("Clicked create reminder button");
        console.log("Date is ", this.state.timestamp.toString());
        if(this.state.timestamp < new Date()){
            Alert.alert(
                'Oops!',
                'Please select a timestamp in the future!',
                [
                    {
                        text: 'OK',
                        onPress: () => {},
                        style: 'cancel',
                    },

                ],
                {cancelable: false},
            );
        }else if(this.state.choreName.length === 0){
            Alert.alert(
                'Oops!',
                'Reminder name cannot be empty!',
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

            let users = this.state.users;
            let hasSelectedUsers = users.some(user => user.selected === true);

            let timeStamp = new Date();

            let resp = await getDB(
                {
                    data: {
                        groupid: this.state.groupid,
                        choreName: this.state.choreName,
                        selectedUsers: this.state.selectedUsers,
                        recursiveChore: this.state.recursiveChore,
                        description: this.state.description,
                        status: "Incomplete",
                        currentUser: this.state.selectedUsers[0],
                        reminderActive: false,
                        isChore: false,
                        timestamp: timeStamp.toString()
                    },
                },
                'createChore');

            console.log(resp);
            this.props.navigation.goBack();
        }
    }

    onDateButtonPressed(){
        console.log("Setting dialog to true");
        this.setState({modalVisible: !this.state.modalVisible})
    }

    renderChoreOrReminder() {
        if (this.state.isChore) {
            return (
                <View>
                    <TextInput
                        style={styles.textInputStyle}
                        label='Chore Name'
                        mode='outlined'
                        value={this.state.choreName}
                        onChangeText={textString => this.setState({choreName: textString})}
                    />
                    <CardSection>
                        <Text style={{
                            fontWeight: 'bold',
                            flex: 1,
                            marginTop: 7,
                            marginRight: 15,
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            Recurring chore?
                        </Text>
                        <Switch
                            value={this.state.recursiveChore}
                            onValueChange={() => {
                                this.onRecursiveClicked();
                            }}
                        />
                    </CardSection>
                    <View style={componentStyles.cardSectionWithBorderStyle}>
                        <Text style={styles.cardHeaderTextStyle}>GROUP MEMBERS</Text>
                        <List.Accordion
                            title="List of members in group"
                            onPress={() => {
                                LayoutAnimation.easeInEaseOut()
                            }}
                        >
                            {this.renderListOfMembers()}
                        </List.Accordion>
                    </View>
                    <TextInput
                        style={styles.textInputStyle}
                        label='Chore Description'
                        mode='outlined'
                        multiline={true}
                        value={this.state.description}
                        onChangeText={textString => this.setState({description: textString})}
                    />
                </View>
            )
        } else {
            return (
                <View>
                    <TextInput
                        style={styles.textInputStyle}
                        label='Reminder Name'
                        mode='outlined'
                        value={this.state.choreName}
                        onChangeText={textString => this.setState({choreName: textString})}
                    />
                    <View style={{margin: 5}}/>
                    <View style={componentStyles.cardSectionWithBorderStyle}>
                        <Text style={styles.cardHeaderTextStyle}>GROUP MEMBERS</Text>
                        {this.renderListOfMembers()}
                    </View>
                    <Button onPress={()=>{this.onDateButtonPressed()}}>Click to select Date for reminder</Button>
                    <TextInput
                        style={styles.textInputStyle}
                        label='Reminder Description'
                        mode='outlined'
                        multiline={true}
                        value={this.state.description}
                        onChangeText={textString => this.setState({description: textString})}
                    />
                </View>
            )
        }
    }

    choreButtonColor(){
        if(this.state.isChore) {
            return theme.buttonColor;
        }
        return 'grey'
    }

    reminderButtonColor(){
        if(!this.state.isChore){
            return theme.buttonColor;
        }
        return 'grey'
    }

    onChorePressed(){
        if(!this.state.isChore){
            this.setState({isChore: true, choreName: '', description: '', recursiveChore: false, selectedUsers: []})
        }
    }

    onReminderPressed(){
        let users=this.state.users;
        let selectedUsers = users.map((user) => user.uid);
        users = users.map(user => {
            if(selectedUsers.includes(user.uid)){
                user.selected = true;
            }else{
                user.selected = false;
            }
            return user;
        });
        console.log("selectedUsers is ", selectedUsers);
        if(this.state.isChore){
            this.setState({users: users, isChore: false, choreName: '', description: '', recursiveChore: false, selectedUsers: selectedUsers, timestamp: new Date()})
        }
    }

    async onCreatePressed() {
        if (this.state.isChore) {
            await this.onCreateChorePressed();
        }else{
            await this.onCreateReminderPressed();
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <Portal>
                        <Modal
                            visible={this.state.modalVisible}
                            onDismiss = {() => { this.onDateButtonPressed() }}
                            contentContainerStyle={styles.containerStyle}
                        >
                            <Button>Select Date</Button>
                            {/*<Text style={styles.modalHeaderTextStyle}>Select Date</Text>*/}
                            <DatePicker
                                date={this.state.timestamp}
                                textColor={theme.buttonTextColor}
                                onDateChange={date => {this.setState({timestamp: date})}}
                            />
                            <Button onPress={()=>{this.onDateButtonPressed()}}>
                                Done
                            </Button>
                        </Modal>
                    </Portal>
                    <ScrollView>
                        <View style={styles.optionsViewStyle}>
                            <Button
                                color={this.choreButtonColor()}
                                style={styles.optionsButtonStyle}
                                mode="contained"
                                onPress={() => {this.onChorePressed()}}
                            >
                                Chore
                            </Button>
                            <Button
                                color={this.reminderButtonColor()}
                                style={styles.optionsButtonStyle}
                                mode="contained"
                                onPress={() => {this.onReminderPressed()}}
                            >
                                Reminder
                            </Button>
                        </View>
                        <View style={styles.viewStyle}>
                            {this.renderChoreOrReminder()}
                            <Button
                                color={theme.buttonColor}
                                style={styles.buttonContainedStyle}
                                mode="contained"
                                onPress={() => {this.onCreatePressed()}}
                            >
                                Create
                            </Button>
                        </View>
                    </ScrollView>
                </PaperProvider>
            </View>
        )
    }
}

const styles = {

    optionsViewStyle: {
        marginTop: 10,
        padding: 12,
        flex: 1,
        flexDirection: 'row'
    },

    optionsButtonStyle: {
        height: 47,
        justifyContent: 'center',
        flex: 1,
        marginTop: 25,
        marginLeft: 5,
        marginRight: 5
    },

    viewStyle: {
        margin: 10,
        marginTop: -20,
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
        marginTop: 25
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
    containerStyle : {
        backgroundColor: theme.backgroundColor,
        padding: 20,
    },
    modalHeaderTextStyle:{
        textColor: theme.buttonColor,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: theme.bigButtonFontSize
    }
};

export default CreateChore;
