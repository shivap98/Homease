import React, {Component} from 'react';
import {Text, View} from 'react-native';
import theme from './common/theme';


class Chores extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <Text>CHORES</Text>
            </View>
        );
    }
}


export default Chores;
