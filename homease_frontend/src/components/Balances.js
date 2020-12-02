import React, {Component} from 'react';
import {Text, View, ScrollView, FlatList, Linking} from 'react-native';
import theme from './common/theme';
import paperTheme from './common/paperTheme';
import componentStyles from './common/componentStyles';
import {Provider as PaperProvider, Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firebase from 'firebase';
import getDB from './Cloud';

const mockBalances = [
    {
        id: "a-b",
        amount: 10
    }, 
    {
        id: "b-a",
        amount: -10
    }, 
]

const mockUsers = [
	{
		name: "Sehaj",
		id: "xxxxx"
	},
	{
		name: "Kartik",
		id: "xxxxx"
	}
]

class Balances extends Component{

    state = {
        balances: [], 
        users: []
	}
	
	async getBalances(res){
		let result = await getDB({ data: {
			groupid: res.result.groupid,
		}},
		"getBalancesByGroupID");

        list = result.result
		values = []
		for (var key in list) {
			values.push({
				id: key,
				amount: list[key]
			});
        }
        
        console.log("vales", values)
        this.setState({balances: values})

	}


    async componentDidMount(){

		this.setState({users: this.props.route.params.users,
			groupid: this.props.route.params.groupid,
			uid: this.props.route.params.uid})
	   
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
			this.setState({groupid: res.result.groupid})
			firebase.database().ref('/groups/'+res.result.groupid + '/balances/').on('value', (snapshot) => {
			    this.getBalances(res)
			})
			// firebase.database().ref('/groups/'+res.result.groupid + '/expenses/').on('value', (snapshot) => {
			// 	this.getBalances(res)
			// })
        }
        
        
    }

    async onSettleButtonPressed(uid1, uid2, amount) {
        //TODO: venmo deep link for uid2

        let venmoUsername = ''
        for(i=0;i<this.state.users.length;i++){
            if(this.state.users[i].uid == uid2){
				venmoUsername = this.state.users[i].venmoUsername
			}
		}

        let link = 'venmo://paycharge?txn=pay&recipients=' + venmoUsername + '&amount=' + amount + '&note=Homease';
        console.log(link)
        Linking.openURL(link);

        currDate = new Date()
        arr = [uid2]
        let result = await getDB({ data: {
			groupid: this.state.groupid,
			expense: {
				uid: uid1,
				title: 'Settlement',
				description: 'Expense for settling balances',
				amount: amount,
				timestamp: currDate.toString(),
				split: arr
			}
		}},
        "addExpense");
        console.log(result)
        this.props.navigation.goBack()
    }

    renderItem(balance) {
        //TODO: maybe only render item if uid1-uid2, uid1 matches current user

        var ids = balance.id.split("-")

        var uid1 = ids[0]
        var uid2 = ids[1]

        //TODO: get all the users before hand and use uid to get name

		for(i=0;i<this.state.users.length;i++){
			if(this.state.users[i].uid == uid1){
				name1 = this.state.users[i].name
			}else if(this.state.users[i].uid == uid2){
				name2 = this.state.users[i].name
			}
		}
        console.log("renderItem", balance)
        balance.amount = (Math.round(balance.amount * 100) / 100).toFixed(2);

        if (balance.amount > 0) {
            return(
                <View style={{margin: 10, justifyContent: 'flex-start', flexDirection: 'column'}}>
                    <Text 
                        style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: theme.buttonTextColor, 
                        }}
                    >
                            {name1} owes {name2}  ${balance.amount}
                    </Text>
                    <Button
                        color={theme.buttonColor}
                        style={{marginLeft: 'auto', marginTop: 20}}
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

    renderItems() {
		let balances = this.state.balances;
		if(balances){
            return balances.map((item, index)=>{
                //TODO: maybe only render item if uid1-uid2, uid1 matches current user

                var ids = item.id.split("-")

                var uid1 = ids[0]
                var uid2 = ids[1]

                //TODO: get all the users before hand and use uid to get name

                for(i=0;i<this.state.users.length;i++){
                    if(this.state.users[i].uid == uid1){
                        name1 = this.state.users[i].name
                    }else if(this.state.users[i].uid == uid2){
                        name2 = this.state.users[i].name
                    }
                }
                console.log("renderItem", item)
                item.amount = (Math.round(item.amount * 100) / 100).toFixed(2);

                if (item.amount > 0) {
                    return(
                        <View style={{margin: 10, justifyContent: 'flex-start', flexDirection: 'column'}} key={item.id}>
                            <Text 
                                style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    color: theme.buttonTextColor, 
                                }}
                            >
                                    {name1} owes {name2}  ${item.amount}
                            </Text>
                            <Button
                                color={theme.buttonColor}
                                style={{marginLeft: 'auto', marginTop: 20}}
                                mode="contained"
                                onPress={() => {this.onSettleButtonPressed(uid1, uid2, item.amount)}}
                            >
                                <Text style={componentStyles.smallButtonTextStyle}>
                                    Settle
                                </Text>
                            </Button>
                        </View>
                    )
                }
            })
        }
    }
    
    render() {
        return(
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <ScrollView style={{padding: 20}}>
                        {this.renderItems()}
                        {/* <FlatList
                            data={this.state.balances}
                            renderItem={({ item }) => {
                                return this.renderItem(item)
                            }}
                            extraData={this.state}
                            keyExtractor={item => item.id}
                        /> */}
                    </ScrollView>
                </PaperProvider>
            </View>
        )
    }
}

export default Balances;
