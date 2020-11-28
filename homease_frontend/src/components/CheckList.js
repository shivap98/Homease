import React, {Component} from 'react';
import {Text, View, TextInput, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import theme from './common/theme';
import getDB from './Cloud';
import auth from '@react-native-firebase/auth';
import firebase from 'firebase';
import CheckBox from '@react-native-community/checkbox';
import componentStyles from './common/componentStyles';


var mockList = [
    // {
    //   name: 'Kevin',
    //   id:'asdas',
    //   checked:false
    // },
    // {
    //   name: 'John',
    //   id:'asdfas',
    //   checked:false
    // },
];

// Mock more data
// for (let index = 2; index < 20; index++) {
//     mockList.push({name: 'A' + index, id: 'B' + index, checked: false})
// }

class CheckList extends Component {

    //TODO: follow list structure as mockList
    state = {
		list: mockList,
    };

    mockIDGenerator(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
	 }
	 
	 async getSharedList(res){
		let result = await getDB({ data: {
			groupid: res.result.groupid,
		}},
		"getSharedList");

		list = result.result
		values = []
		for (var key in list) {
			values.push(list[key]);
		}
		console.log(values)
		this.setState({list: values})

		console.log(result)
	 }


	 async componentDidMount(){
        //TODO: attach hook to DB to look for changes
        //TODO: inside the get DB call Keyboard.dismiss() so that if user currently editing, changes are discarded

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
            this.groupid = res.result.groupid
			this.setState({groupid: this.groupid})

			firebase.database().ref('/groups/'+res.result.groupid + '/sharedList/').on('value', (snapshot) => {
				this.getSharedList(res)
			})
		}
        
    }

    checkThisBox = async (itemID) => {
        let list=this.state.list
        console.log('checkbox for ' + itemID)
        let item_index = list.findIndex(item => item.id === itemID)

        list[item_index].checked = !list[item_index].checked

        //TODO: add code to update DB

		this.setState({list:list})

		let res = await getDB({ data: {
			groupid: this.state.groupid,
			item: list[item_index]
		}},
		"addItemOnSharedList");
		
    }

    changeText = async (itemID, text) => {
        let list=this.state.list
        let item_index = list.findIndex(item => item.id === itemID)
        list[item_index].name = text
		this.setState({list:list})
		
		
    }

    updateText = async(itemID) => {
        let list=this.state.list
        console.log('update text for ' + itemID)
        let item_index = list.findIndex(item => item.id === itemID)
		//TODO: add code to update text for itemID
		let res = await getDB({ data: {
			groupid: this.state.groupid,
			item: list[item_index]
		}},
		"addItemOnSharedList");

		console.log(res)
    }

    async addItem() {
        
        let list=this.state.list
        //TODO: get id from firebase - random UID to save to database
        let id = this.mockIDGenerator(5)

		console.log('add item id ' + id)
		toAdd = {name: "", checked: false, id}
        list.push(toAdd)
		this.setState({list:list})

		//TODO: update the DB
		
		let res = await getDB({ data: {
			groupid: this.state.groupid,
			item: toAdd
		}},
		"addItemOnSharedList");

		console.log(res)
        
    }

    async deleteItem(itemID) {
        console.log('delete item ' + itemID)
        //TODO: delete item
        const list = this.state.list.filter(item => item.id !== itemID);
        this.setState({list:list})
		//TODO: update DB
		
		let res = await getDB({ data: {
			groupid: this.state.groupid,
			item: {id: itemID}
		}},
		"addItemOnSharedList");

		console.log(res)
    }

    deleteItemButtonVisibility(item) {
        if (item.checked) {
            return (
                <View
                    style={{
                        alignItems:'center',
                        justifyContent:'center',
                        
                    }}
                >
                    <TouchableOpacity
                        onPress={() => this.deleteItem(item.id)}
                    >
                        <Text
                            style={{
                                fontWeight: 'bold',
                                color: 'white',
                                fontSize: 20,
                            }}
                        >
                            X
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    renderItem = ({ item }) => (
        <View style={{margin: 10, justifyContent: 'flex-start', flexDirection: 'row'}}>
            <CheckBox
                value={item.checked}
                onChange={() => this.checkThisBox(item.id)}
            />
            <TextInput
                style={{flex: 1, marginLeft: 15, color: 'white', fontSize: 25, textDecorationLine: item.checked ? 'line-through': 'none'}}
                onChangeText={text => this.changeText(item.id, text)}
                value={item.name}
                onBlur={() => this.updateText(item.id)}
                editable={!item.checked}
            />
            {this.deleteItemButtonVisibility(item)}
        </View>
    )

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <ScrollView style={{padding: 20}}>
                    <FlatList
                        data={this.state.list}
                        renderItem={this.renderItem}
                        extraData={this.state}
                        keyExtractor={item => item.id.toString()}
                    />
                    <TouchableOpacity
                        style={{
                            borderWidth:2,
                            alignItems:'center',
                            justifyContent:'center',
                            width:33,
                            height:34,
                            backgroundColor: theme.backgroundColor,
                            borderColor: '#ababab',
                            borderRadius:50,
                            margin: 10,
                            marginBottom: 35
                        }}
                        onPress={() => this.addItem()}
                        >
                        <Text style={componentStyles.smallButtonTextStyle}>
                            +
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

const styles = {

};

export default CheckList;
