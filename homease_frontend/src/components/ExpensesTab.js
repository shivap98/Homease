import React, {Component} from 'react';
import {Text, View, ScrollView, LayoutAnimation} from 'react-native';
import theme from './common/theme';
import {Button, FAB, List, Provider as PaperProvider, Divider} from 'react-native-paper';
import paperTheme from './common/paperTheme';
import componentStyles from './common/componentStyles';
import {CardSection} from './common';

class ExpensesTab extends Component{

    state = {
        mockExpenses: [
            {desc: 'First expense', paidBy: '1', amount: 10, dateTime: 'Thu Nov 26 2020 02:51:31 GMT-0500 (EST)'},
            {desc: 'Second expense', paidBy: '2', amount: 30, dateTime: 'Thu Nov 26 2020 01:51:31 GMT-0500 (EST)'},
            {desc: 'Third expense', paidBy: '1', amount: 20, dateTime: 'Thu Nov 26 2020 03:51:31 GMT-0500 (EST)'}
        ],
        users: [
            {userID: '1', name: 'Aman Wali'},
            {userID: '2', name: 'Kartik Mittal'},
            {userID: '3', name: 'Abhignan Daravana'}
        ],
        expensesExpanded: true
    };

    onBalanceClicked(){
        let d1 = Date().toString();//.substr(0, 24);
        console.log("Clicked balance button at ", d1);
        let d2 = new Date(this.state.mockExpenses[0].dateTime);
        let d3 = new Date(this.state.mockExpenses[1].dateTime);
        let d4 = new Date(this.state.mockExpenses[2].dateTime);
        console.log("D2 is ", d2.toString());
        console.log("D3 is ", d3.toString());
        console.log("D4 is ", d4.toString());
        if(d2 < d3){
            console.log(d2.toString(), " is lower than ", d3.toString());
        }else if(d3 < d2){
            console.log(d3.toString(), " is lower than ", d2.toString());
        }else{
            console.log("Equal");
        }
        console.log("Test");
    }

    onExpensePressed(expense){
        console.log("Clicked expense ",expense.desc);
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

    sortExpenses(expenses){
        console.log("TEst");
        return expenses.sort(this.compareDate);
    }

    renderListOfExpenses(){
        console.log("List of expenses clicked");
        let expenses = this.state.mockExpenses;
        expenses = this.sortExpenses(expenses);
        if(expenses){
            return expenses.map((item, index)=>{
                return(
                    <View>
                        <List.Item
                            title={item.desc}
                            key={index}
                            description={this.showItemDate(item)}
                            onPress={() => {this.onExpensePressed(item)}}
                            right={props =>
                                <CardSection>
                                        <Text style={styles.amountTextStyle}>
                                            {"$"+item.amount}
                                        </Text>
                                </CardSection>
                            }
                        />
                        {this.showDivider(expenses, index)}
                        {/*<Divider style={{backgroundColor: 'white'}}/>*/}
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
                                onPress={() => {this.onBalanceClicked()}}
                            >
                                View Balances
                            </Button>
                            <Text style={styles.cardHeaderTextStyle}>List of expenses in group</Text>
                            {this.renderListOfExpenses()}
                        </View>
                        {/*<View style={componentStyles.cardSectionWithBorderStyle}></View>*/}
                    </ScrollView>
                </PaperProvider>
                <FAB
                    style={styles.fab}
                    small
                    color={theme.darkColor}
                    icon="plus"
                    onPress={() => {
                        console.log("Pressed fab");
                        this.props.navigation.navigate('AddExpense');
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
