import React, {Component} from 'react';
import {Text, View, TextInput, ListItem, FlatList} from 'react-native';
import {FAB} from 'react-native-paper';
import {Card, CardSection} from "./common";
import theme from './common/theme';
import CheckBox from '@react-native-community/checkbox';
import paperTheme from './common/paperTheme';
import componentStyles from './common/componentStyles';


const list = [
    {
      name: 'Kevin',
      id:0,
      checked:false
    },
    {
      name: 'John',
      id:1,
      checked:false
    },
];

class CheckList extends Component {

    
    state = {
		list: list,
    };


	componentDidMount(){

    }

    checkThisBox = (itemID) => {
        let list=this.state.list
        list[itemID].checked = !list[itemID].checked
        this.setState({list:list})
    }

    changeText = (itemID, text) => {
        let list=this.state.list
        list[itemID].name = text
        this.setState({list:list})
    }

    renderItem = ({ item }) => (
        <View style={{margin: 10, justifyContent: 'flex-start', flexDirection: 'row',}}>
            <CheckBox
                value={this.state.list[item.id].checked}
                onChange={() => this.checkThisBox(item.id)}
            />
            <TextInput
                style={{marginLeft: 15, color: 'white', fontSize: 25, textDecorationLine: item.checked ? 'line-through': 'none'}}
                onChangeText={text => this.changeText(item.id, text)}
                value={item.name}
            />
        </View>
    )

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <View style={componentStyles.cardSectionWithBorderStyle}>
                    <FlatList
                        data={this.state.list}
                        renderItem={this.renderItem}
                        extraData={this.state}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            </View>
        );
    }
}

const styles = {

};

export default CheckList;
