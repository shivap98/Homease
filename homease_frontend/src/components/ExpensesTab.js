import React, {Component} from 'react';
import {Text, View} from 'react-native';
import theme from './common/theme';

class ExpensesTab extends Component{
    render(){
        return(
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <Text>
                    Expenses tab
                </Text>
            </View>
        )
    }
}

export default ExpensesTab;
