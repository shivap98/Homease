import React, {Component} from "react";
import {ScrollView, View, Text, Alert, LayoutAnimation} from 'react-native';
import {Button, List, Provider as PaperProvider, Switch, TextInput} from 'react-native-paper';
import paperTheme from './common/paperTheme';
import theme from './common/theme';
import getDB from './Cloud';
import {CardSection} from './common';
import componentStyles from './common/componentStyles';

class EditChore extends Component{
    static navigationOptions = () => {
        return {
            title: 'Edit Chore'
        };
    };

    state = {
        choreName: '',
        users: [
            {name: 'user1', selected: false},
            {name: 'user2', selected: false},
            {name: 'user3', selected: false}
        ],
        chores: [
            {key: '1', name: 'Dishes', status: 'incomplete', description: 'Chore 1', recursiveChore: true, selectedUsers: ['user1', 'user3'], currentUser: 'user1', previousUser: 'user3'},
            {key: '2', name: 'Cleaning', status: 'in progress', description: 'Chore 2', recursiveChore: false, selectedUsers: ['user2'], currentUser: 'user2'}
        ],
        recursiveChore: false,
        description: '',
        multiLine: true,
        currentUser: '',
        previousUser: '',
        edit: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        let chore = this.state.chores.filter(chore =>{
            return chore.key === this.props.route.params.key;
        })[0];
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
        this.setState({edit: !this.state.edit})
    }

    onCreateChoreClicked(){
        console.log("Clicked save chore button");
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
    }

    onRollBackClicked(){
        console.log("ROLLBACK CLICKED");
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
                    style={styles.buttonContainedStyle}
                    mode="contained"
                    onPress={() => {this.onRollBackClicked()}}
                >
                    ROLLBACK CHORE TO USER
                </Button>
            </View>
        )
    }

    showPreviousUser(){
        if(this.state.recursiveChore === true){
            return (
                <List.Accordion
                    title="LAST COMPLETED BY"
                    onPress={() => {LayoutAnimation.easeInEaseOut()}}
                >
                    {this.renderPreviousUser()}
                </List.Accordion>
            )
        }
    }

    showGroupMembers(){
        return(
            <View style={componentStyles.cardSectionWithBorderStyle}>
                <Text style={styles.cardHeaderTextStyle}>GROUP MEMBERS</Text>
                <List.Accordion
                    title="List of members in group"
                    onPress={() => {LayoutAnimation.easeInEaseOut()}}
                >
                    {this.renderListOfMembers()}
                </List.Accordion>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
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
                                    onValueChange={() => {this.onEditClicked()}}
                                />
                            </CardSection>
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
                            {this.showGroupMembers()}
                            <View style={componentStyles.cardSectionWithBorderStyle}>
                                <Text style={styles.cardHeaderTextStyle}>ASSIGNMENT INFORMATION</Text>
                                <TextInput
                                    style={styles.textInputStyle}
                                    label='Currently assigned user'
                                    mode='outlined'
                                    value={this.state.currentUser}
                                    keyboardAppearance='dark'
                                    editable={false}
                                    onChangeText={textString => {}}
                                />
                                {this.showPreviousUser()}
                            </View>
                            <Button
                                color={theme.buttonColor}
                                style={styles.buttonContainedStyle}
                                mode="contained"
                                onPress={() => {this.onCreateChoreClicked()}}
                            >
                                Save changes to chore
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
    }
};

export default EditChore;
