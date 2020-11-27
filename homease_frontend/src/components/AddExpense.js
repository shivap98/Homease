import React, {Component} from 'react';
import {Text, View, ScrollView, LayoutAnimation} from 'react-native';
import theme from './common/theme';
import paperTheme from './common/paperTheme';
import componentStyles from './common/componentStyles';
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';

class AddExpense extends Component{

    state={
        title: '',
        description: ''
    }

    componentDidMount(){
        this.props.navigation.setOptions({title: 'Add an Expense'})
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
                                onPress={() => {console.log("Test")}}
                            >
                                View Balances
                            </Button>
                            <Text style={styles.cardHeaderTextStyle}>List of expenses in group</Text>
                        </View>
                        {/*<View style={componentStyles.cardSectionWithBorderStyle}></View>*/}
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

export default AddExpense;
