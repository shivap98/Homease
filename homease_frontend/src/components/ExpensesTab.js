import React, {Component} from 'react';
import {Text, View, ScrollView, LayoutAnimation} from 'react-native';
import theme from './common/theme';
import {Button, FAB, List, Provider as PaperProvider} from 'react-native-paper';
import paperTheme from './common/paperTheme';
import componentStyles from './common/componentStyles';

class ExpensesTab extends Component{

    state = {
        mockExpenses: [
            {desc: 'First expense', paidBy: '1', amount: 10, dateTime: 'Thu Nov 26 2020 02:51:31 GMT-0500 (EST)'},
            {desc: 'Second expense', paidBy: '2', amount: 30, dateTime: 'Thu Nov 26 2020 01:51:31 GMT-0500 (EST)'},
            {desc: 'Third expense', paidBy: '1', amount: 20, dateTime: 'Thu Nov 26 2020 03:51:31 GMT-0500 (EST)'}
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

    renderListOfExpenses(){
        console.log("List of expenses clicked");
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
                            {/*<Text style={styles.cardHeaderTextStyle}>Group Expenses</Text>*/}
                            <List.Accordion
                                title="List of expenses in group"
                                onPress={() => {
                                    this.setState({expensesExpanded: !this.state.expensesExpanded});
                                    return LayoutAnimation.easeInEaseOut();
                                }}
                                expanded={this.state.expensesExpanded}
                            >
                                {this.renderListOfExpenses()}
                            </List.Accordion>
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme.lightColor
    },
};

export default ExpensesTab;
