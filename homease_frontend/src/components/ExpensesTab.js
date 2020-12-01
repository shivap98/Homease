import React, {Component} from 'react';
import {Text, View, ScrollView} from 'react-native';
import theme from './common/theme';
import {Button, FAB, List, Provider as PaperProvider, Divider} from 'react-native-paper';
import paperTheme from './common/paperTheme';
import componentStyles from './common/componentStyles';
import auth from '@react-native-firebase/auth';
import firebase from 'firebase';
import getDB from './Cloud';
import {CardSection} from './common';

class ExpensesTab extends Component{

    state = {
        mockExpenses: [
            {id: '1', title: 'First expense', description: 'Random Description', paidBy: '1', amount: 10, dateTime: 'Thu Nov 26 2020 02:51:31 GMT-0500 (EST)', splitBetweenUsers:['1', '3']},
            {id: '2', title: 'Second expense', description: 'Random Description', paidBy: '2', amount: 30, dateTime: 'Thu Nov 26 2020 01:51:31 GMT-0500 (EST)', splitBetweenUsers:['2', '3', '1']},
            {id: '3', title: 'Third expense', description: 'Random Description', paidBy: '1', amount: 20, dateTime: 'Thu Nov 26 2020 03:51:31 GMT-0500 (EST)', splitBetweenUsers:['1', '3', '4']}
        ],
        users: [
            {userID: '1', name: 'Aman Wali'},
            {userID: '2', name: 'Kartik Mittal'},
            {userID: '3', name: 'Sehaj Randhawa'},
            {userID: '4', name: 'Shiv Paul'}
        ],
	};

	async getExpenses(res){
		let result = await getDB({ data: {
			groupid: res.result.groupid,
		}},
		"getExpensesByGroupID");

		console.log(result.result)

		// list = result.result
		// values = []
		// for (var key in list) {
		// 	values.push(list[key]);
		// }
		// console.log(values)
		// this.setState({list: values})
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

			firebase.database().ref('/groups/'+res.result.groupid + '/expenses/').on('value', (snapshot) => {
				this.getExpenses(res)
			})
		}
        
    }

    getUserFromID(id){
        let users = this.state.users;
        return users.filter(user => user.userID === id);
    }

    showItemDate(item){
        console.log(item.dateTime.toString().substr(4, 20));
        let descr = item.dateTime.toString().substr(4, 20);
        descr = descr + "\n" + "Paid by: " + this.getUserFromID(item.paidBy)[0].name;
        return descr;
    }

    showDivider(expenses, index){
        if(index<expenses.length-1){
            return (
                <Divider style={{backgroundColor: 'white'}}/>
            )
        }
    }

    compareDate(a, b){
        const d1 = new Date(a.dateTime);
        const d2 = new Date(b.dateTime);

        let comparison = 0;

        if(d1 > d2){
            comparison = 1;
        }else if(d1 < d2){
            comparison = -1;
        }
        return comparison;
    }

    renderListOfExpenses(){
        console.log("List of expenses clicked");
        let expenses = this.state.mockExpenses;
        expenses = expenses.sort(this.compareDate);
        if(expenses){
            return expenses.map((item, index)=>{
                return(
                    <View>
                        <List.Item
                            title={item.title}
                            key={index}
                            description={this.showItemDate(item)}
                            onPress={() => {this.props.navigation.navigate('Expense', {key: item.id})}}
                            right={props =>
                                <CardSection>
                                        <Text style={styles.amountTextStyle}>
                                            {"$"+item.amount}
                                        </Text>
                                </CardSection>
                            }
                        />
                        {this.showDivider(expenses, index)}
                    </View>
                )
            })
        }
    }

    render(){
        return(
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <ScrollView>
                        <View style={componentStyles.cardSectionWithBorderStyle}>
                            <Button
                                color={theme.buttonColor}
                                style={styles.buttonContainedStyle}
                                mode="contained"
                                onPress={() => {this.props.navigation.navigate('Balances');}}
                            >
                                View Balances
                            </Button>
                            <Text style={styles.cardHeaderTextStyle}>List of expenses in group</Text>
                            {this.renderListOfExpenses()}
                        </View>
                    </ScrollView>
                </PaperProvider>
                <FAB
                    style={styles.fab}
                    small
                    color={theme.darkColor}
                    icon="plus"
                    onPress={() => {
                        console.log("Pressed fab");
                        this.props.navigation.navigate('AddExpense', {users: this.state.users, groupid: this.state.groupid, uid: this.state.uid});
                    }}
                />
            </View>
        )
    }
}

const styles = {
    buttonContainedStyle: {
        height: 47,
        justifyContent: 'center',
        flex: 1,
        marginTop: 25
    },
    cardHeaderTextStyle: {
        fontWeight: 'bold',
        marginTop: 20,
        flex: 1,
        color: theme.buttonTextColor,
        textAlign: 'center'
    },
    amountTextStyle:{
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.lightColor
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme.lightColor
    },
};

export default ExpensesTab;
