import React, {Component} from 'react';
import {Text, View, ScrollView, LayoutAnimation} from 'react-native';
import theme from './common/theme';

class AddExpense extends Component{
    render(){
        return(
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <Text>TEST</Text>
            </View>
        )
    }
}

export default AddExpense;
