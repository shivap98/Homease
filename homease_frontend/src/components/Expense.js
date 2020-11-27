import React, {Component} from 'react';
import {Text, View, ScrollView} from 'react-native';
import theme from './common/theme';
import paperTheme from './common/paperTheme';
import componentStyles from './common/componentStyles';
import {Button, Provider as PaperProvider} from 'react-native-paper';

class Expense extends Component{
    render(){
        return(
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <ScrollView>
                        <View style={componentStyles.cardSectionWithBorderStyle}>
                            <Text>TEST</Text>
                        </View>
                    </ScrollView>
                </PaperProvider>
            </View>
        )
    }
}

export default Expense;
