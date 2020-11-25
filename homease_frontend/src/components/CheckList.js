import React, {Component} from 'react';
import {Text, View, TextInput, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import theme from './common/theme';
import CheckBox from '@react-native-community/checkbox';
import componentStyles from './common/componentStyles';

var list_size = 2;

var mockList = [
    {
      name: 'Kevin',
      id:0,
      key: 'key1',
      checked:false
    },
    {
      name: 'John',
      id:1,
      key: 'key2',
      checked:false
    },
];

// Mock more data
// for (let index = 2; index < 20; index++) {
//     mockList.push({name: 'A' + index, id: index, key: 'key' + index, checked: false})
// }
// list_size = 20;

class CheckList extends Component {

    //TODO: follow list structure as mockList
    state = {
		list: mockList,
    };


	componentDidMount(){
        //TODO: attach hook to DB to look for changes
        //TODO: inside the get DB call Keyboard.dismiss() so that if user currently editing, changes are discarded


        //TODO: when rendering lists, use list_size for indexing as array and increment
    }

    checkThisBox = (itemID) => {
        let list=this.state.list
        list[itemID].checked = !list[itemID].checked

        //TODO: add code to update DB

        this.setState({list:list})
    }

    changeText = (itemID, text) => {
        let list=this.state.list
        list[itemID].name = text
        this.setState({list:list})
    }

    updateText = (itemID) => {
        console.log('update text for ' + itemID)

        //TODO: add code to update text for list[itemID].key
    }

    addItem() {
        console.log('add item')
        let list=this.state.list
        list.push({name: '', id: list_size, key: 'key' + list_size, checked: false})
        list_size += 1
        this.setState({list:list})
        //TODO: update the DB
        
    }

    renderItem = ({ item }) => (
        <View style={{margin: 10, justifyContent: 'flex-start', flexDirection: 'row'}}>
            <CheckBox
                value={this.state.list[item.id].checked}
                onChange={() => this.checkThisBox(item.id)}
            />
            <TextInput
                style={{flex: 1, marginLeft: 15, color: 'white', fontSize: 25, textDecorationLine: item.checked ? 'line-through': 'none'}}
                onChangeText={text => this.changeText(item.id, text)}
                value={item.name}
                onBlur={() => this.updateText(item.id)}
                editable={!item.checked}
            />
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
