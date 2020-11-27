import React, {Component} from 'react';
import {Text, View, ScrollView, LayoutAnimation, Alert} from 'react-native';
import theme from './common/theme';
import paperTheme from './common/paperTheme';
import componentStyles from './common/componentStyles';
import {Button, List, Provider as PaperProvider, TextInput, Divider} from 'react-native-paper';

class AddExpense extends Component{

    state={
        title: '',
        description: '',
        amount: '',
        users: [
            {userID: '1', name: 'Aman Wali', selected: false},
            {userID: '2', name: 'Kartik Mittal', selected: false},
            {userID: '3', name: 'Abhignan Daravana'}
        ],
        selectedUsers: [],
    };

    componentDidMount(){
        console.log("Test");
        this.props.navigation.setOptions({title: 'Add an Expense'})
    }

    onSelectPressed(selectedUser, index){
        console.log("Select pressed");
        console.log("selected users at time of click"+this.state.selectedUsers);
        let users = this.state.users;

        users[index].selected = !selectedUser.selected;
        let selectedUsers = this.state.selectedUsers;
        if(users[index].selected === true){
            selectedUsers.push(users[index].uid);
        }else{
            selectedUsers = selectedUsers.filter(user => user !== users[index].uid);
        }
        this.setState({users: users, selectedUsers: selectedUsers});
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

    onAddExpenseClicked(){
        let users = this.state.users;
        let hasSelectedUsers = users.some(user => user.selected === true);
        if(this.state.title.length === 0){
            Alert.alert(
                'Oops!',
                'Please enter a title!',
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
        console.log("Clicked Add expense");
    }

    render(){
        return(
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <ScrollView>
                        <View style={styles.viewStyle}>
                            <View style={{flexDirection: 'row'}}>
                                <TextInput
                                    style={styles.titleInputStyle}
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
                                    maxLength={8}
                                    onChangeText={textString => this.setState({amount: textString.replace(/[^0-9.]/g, '')})}
                                />
                            </View>
                            <TextInput
                                style={styles.textInputStyle}
                                label='Expense Description'
                                mode='outlined'
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
                                onPress={() => {this.onAddExpenseClicked()}}
                            >
                                Add expense
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

export default AddExpense;
