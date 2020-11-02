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
            {key: '1', name: 'Dishes', status: 'incomplete', description: 'Chore 1', recursiveChore: true, selectedUsers: ['user1', 'user3']},
            {key: '2', name: 'Cleaning', status: 'in progress', description: 'Chore 2', recursiveChore: false, selectedUsers: ['user2']}
        ],
        recursiveChore: false,
        description: '',
        multiLine: true
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
        console.log(users);
        users = users.map(user =>{
            if(chore.selectedUsers.includes(user.name)){
                user.selected = true;
            }
            return user;
        });
        console.log(users);
        this.setState({choreName: chore.name, description: chore.description, users: users,selectedUsers: chore.selectedUsers, recursiveChore: chore.recursiveChore});
        this.props.navigation.setOptions({ title: 'Chore' })
    }

    onSelectPressed(selectedUser, index){
        console.log("Select pressed");
        let users = this.state.users;
        if(this.state.recursiveChore === true) {
            users[index].selected = !selectedUser.selected;
            let selectedUsers = this.state.selectedUsers;
            if(users[index].selected === true){
                selectedUsers.push(users[index].name);
            }else{
                selectedUsers = selectedUsers.filter(user => user !== users[index].name);
            }
            this.setState({users: users, selectedUsers: selectedUsers});
        }else{
            if(selectedUser.selected === false){
                console.log("Clicked new user");
                users = users.map(user => {
                    user.selected=false;
                    return user;
                });
                users[index].selected = true;
                let selectedUsers = [];
                selectedUsers.push(users[index].name);
                this.setState({users: users, selectedUsers: selectedUsers});
            }else{
                console.log("Clicked selected user again");
            }
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
                    onPress={() => {this.onSelectPressed(item, index)}}
                />
            )
        })

    }

    onRecursiveClicked(){
        console.log("data check in props");
        console.log(this.props.route.params.key);
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

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <ScrollView>
                        <View style={styles.viewStyle}>
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
                                    Recursive chore?
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
                                    onPress={() => {LayoutAnimation.easeInEaseOut()}}
                                >
                                    {this.renderListOfMembers()}
                                </List.Accordion>
                            </View>
                            <TextInput
                                style={styles.textInputStyle}
                                label='Chore Description'
                                mode='outlined'
                                multiline= {true}
                                value={this.state.description}
                                onChangeText={textString => this.setState({description: textString})}
                            />
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
