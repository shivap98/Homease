import React, {Component} from 'react';
import {Text, View} from 'react-native';
import theme from './common/theme';


class Account extends Component {

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <Text>ACCOUNT</Text>
            </View>
        );
    }
}

export default Account;