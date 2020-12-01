import React, {Component} from 'react';
import {Text, View, ScrollView, FlatList, Linking} from 'react-native';
import theme from './common/theme';
import paperTheme from './common/paperTheme';
import componentStyles from './common/componentStyles';
import {Provider as PaperProvider, Button} from 'react-native-paper';

const mockBalances = [
    {
        id: "a-b",
        amount: 10
    }, 
    {
        id: "b-a",
        amount: -10
    }, 
    {
        id: "a-c",
        amount: -5
    }, 
    {
        id: "c-a",
        amount: 5
    }, 
    {
        id: "b-c",
        amount: 0
    }, 
    {
        id: "c-b",
        amount: 0
    }, 
]

const mockUsers = {
    "a" : {
        name: "Kartik"
    }, 
    "b" : {
        name: "Shiv"
    }, 
    "c" : {
        name: "Sehaj"
    }
}

class Balances extends Component{

    state = {
        balances: mockBalances, 
        users: mockUsers
    }


    componentDidMount() {

        //TODO: get balances and users from DB and set the state


    }

    onSettleButtonPressed(uid1, uid2, amount) {
        console.log("settle pressed", uid1, uid2, amount)

        //TODO: venmo deep link for uid2

        let link = 'venmo://paycharge?txn=pay&recipients=a&amount=10&note=Homease';
        Linking.openURL(link);
    }

    renderItem(balance) {
        //TODO: maybe only render item if uid1-uid2, uid1 matches current user

        var ids = balance.id.split("-")

        var uid1 = ids[0]
        var uid2 = ids[1]

    
        //TODO: get all the users before hand and use uid to get name

        var name1 = this.state.users[uid1].name
        var name2 = this.state.users[uid2].name

        if (balance.amount > 0) {
            return(
                <View style={{margin: 10, justifyContent: 'flex-start', flexDirection: 'row'}}>
                    <Text 
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: theme.buttonTextColor, 
                            alignSelf: "center"
                        }}
                    >
                            {name1} owes {name2}  ${balance.amount}
                    </Text>
                    <Button
                        color={theme.buttonColor}
                        style={{marginLeft: 'auto'}}
                        mode="contained"
                        onPress={() => {this.onSettleButtonPressed(uid1, uid2, balance.amount)}}
                    >
                        <Text style={componentStyles.smallButtonTextStyle}>
                            Settle
                        </Text>
                    </Button>
                </View>
            )
        }
    }
    
    render() {
        return(
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <ScrollView style={{padding: 20}}>
                        <FlatList
                            data={this.state.balances}
                            renderItem={({ item }) => {return this.renderItem(item)}}
                            extraData={this.state}
                            keyExtractor={item => item.id.toString()}
                        />
                    </ScrollView>
                </PaperProvider>
            </View>
        )
    }
}

export default Balances;
