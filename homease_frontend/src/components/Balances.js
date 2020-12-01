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
    // {
    //     id: "a-b",
    //     amount: 10
    // }, 
    // {
    //     id: "b-a",
    //     amount: -10
    // }, 
]

const mockUsers = [
	// {
	// 	name: "Sehaj",
	// 	id: "xxxxx"
	// },
	// {
	// 	name: "Kartik",
	// 	id: "xxxxx"
	// }
]

class Balances extends Component{

    state = {
        balances: mockBalances, 
        users: mockUsers
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

			firebase.database().ref('/groups/'+res.result.groupid + '/expenses/').on('value', (snapshot) => {
				this.getBalances(res)
			})
		}
        
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

		for(i=0;i<this.state.users.length;i++){
			if(this.state.users[i].uid == uid1){
				name1 = this.state.users[i].name
			}else if(this.state.users[i].uid == uid2){
				name2 = this.state.users[i].name
			}
		}

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
