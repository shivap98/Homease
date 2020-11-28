import React, {Component} from 'react';
import {Text, View, ScrollView, Alert} from 'react-native';
import theme from './common/theme';
import paperTheme from './common/paperTheme';
import componentStyles from './common/componentStyles';
import {Button, Divider, List, Provider as PaperProvider, Switch, TextInput} from 'react-native-paper';
import {CardSection} from './common';

class Expense extends Component{

    state={
        mockExpenses: [
            {id: '1', title: 'First expense', description: 'Random Description', paidBy: '1', amount: 10, dateTime: 'Thu Nov 26 2020 02:51:31 GMT-0500 (EST)', splitBetweenUsers:['1', '3']},
            {id: '2', title: 'Second expense', description: 'Random Description', paidBy: '2', amount: 30, dateTime: 'Thu Nov 26 2020 01:51:31 GMT-0500 (EST)', splitBetweenUsers:['2', '3', '1']},
            {id: '3', title: 'Third expense', description: 'Random Description', paidBy: '1', amount: 20, dateTime: 'Thu Nov 26 2020 03:51:31 GMT-0500 (EST)', splitBetweenUsers:['1', '3', '4']}
        ],
        expense: {},
        title: '',
        description: '',
        amount: '',
        users: [
            {userID: '1', name: 'Aman Wali', selected: false},
            {userID: '2', name: 'Kartik Mittal', selected: false},
            {userID: '3', name: 'Sehaj Randhawa', selected: false},
            {userID: '4', name: 'Shiv Paul', selected: false}
        ],
        selectedUsers: [],
        edit: false
    };

    componentDidMount(){
        let expenseId = this.props.route.params.key;
        console.log("Expense clicked is ", expenseId);

        let expense = this.state.mockExpenses.filter(expense => expense.id === expenseId)[0];
        let title = expense.title;
        let description = expense.description;
        let amount = expense.amount;
        let selectedUsers = expense.splitBetweenUsers;
        let users = this.state.users;
        users = users.map(user => {
            user.selected = selectedUsers.includes(user.userID);
            return user;
        });
        console.log(users);
        console.log("Split between ", selectedUsers);
        this.setState({expense: expense, title: title, description: description, amount: amount, selectedUsers: selectedUsers, users: users});
    }

    onSelectPressed(selectedUser, index){
        console.log("Select pressed");
        console.log("selected users at time of click"+this.state.selectedUsers);
        if(!this.state.edit)
        {
            Alert.alert(
                'Oops!',
                'Please click edit to make changes!',
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

            users[index].selected = !selectedUser.selected;
            let selectedUsers = this.state.selectedUsers;
            if (users[index].selected === true) {
                selectedUsers.push(users[index].userID);
            } else {
                selectedUsers = selectedUsers.filter(user => user !== users[index].userID);
            }
            this.setState({users: users, selectedUsers: selectedUsers});
        }
    }

    onSavePressed(){
        let users = this.state.users;
        let hasSelectedUsers = users.some(user => user.selected === true);
        if(this.state.title.length === 0){
            Alert.alert(
                'Oops!',
                'Title cannot be empty!',
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
        else if(!(parseFloat(this.state.amount) > 0.0)){
            Alert.alert(
                'Oops!',
                'Please enter amount greater than 0!',
                [
                    {
                        text: 'OK',
                        onPress: () => {},
                        style: 'cancel',
                    },

                ],
                {cancelable: false},
            );
        }else if(hasSelectedUsers === false){
            Alert.alert(
                'Oops!',
                'Please select at least one user to split the expense with!',
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
        console.log("Clicked Save expense");
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

    render(){
        return(
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
                                    onValueChange={() => {
                                        console.log("Edit clicked");
                                        this.setState({edit: !this.state.edit})
                                    }}
                                />
                            </CardSection>
                            <View style={{flexDirection: 'row'}}>
                                <TextInput
                                    style={styles.titleInputStyle}
                                    editable={this.state.edit}
                                    label='Expense Title'
                                    mode='outlined'
                                    value={this.state.title}
                                    onChangeText={textString => this.setState({title: textString})}
                                />
                                <TextInput
                                    style={styles.priceInputStyle}
                                    label='Amount'
                                    mode='outlined'
                                    value={'$'+this.state.amount}
                                    keyboardType='numeric'
                                    editable={this.state.edit}
                                    maxLength={8}
                                    onChangeText={textString => this.setState({amount: textString.replace(/[^0-9.]/g, '')})}
                                />
                            </View>
                            <TextInput
                                style={styles.textInputStyle}
                                label='Expense Description'
                                mode='outlined'
                                editable={this.state.edit}
                                multiline= {true}
                                value={this.state.description}
                                onChangeText={textString => this.setState({description: textString})}
                            />
                            <View style={{margin: 10}}/>
                            <View style={componentStyles.cardSectionWithBorderStyle}>
                                <Text style={styles.cardHeaderTextStyle}>GROUP MEMBERS TO SPLIT WITH</Text>
                                <Divider style={{backgroundColor: 'white'}}/>
                                {this.renderListOfMembers()}
                            </View>
                            <Button
                                color={theme.buttonColor}
                                style={styles.buttonContainedStyle}
                                mode="contained"
                                onPress={() => {this.onSavePressed()}}
                            >
                                Save expense
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
        borderColor: theme.lightColor,
        flex: 1,
        marginTop: 20,
    },
    titleInputStyle: {
        borderColor: theme.lightColor,
        flex: 2,
        marginTop: 20,
    },
    priceInputStyle: {
        borderColor: theme.lightColor,
        flex: 1,
        marginTop: 20,
        margin: 10
    },
    buttonContainedStyle: {
        height: 47,
        justifyContent: 'center',
        flex: 1,
        marginTop: 25
    },
    cardHeaderTextStyle: {
        fontWeight: 'bold',
        margin: 10,
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


export default Expense;
