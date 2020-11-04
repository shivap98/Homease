import React, {Component} from 'react';
import {Text, View, TouchableOpacity, TouchableHighlight} from 'react-native';
import theme from './common/theme';
import componentStyles from './common/componentStyles';
import { SwipeListView } from 'react-native-swipe-list-view';
import {FAB} from 'react-native-paper';
import getDB from './Cloud';
import auth from '@react-native-firebase/auth';
import { ThemeProvider } from '@react-navigation/native';

class ChoresTab extends Component {

    mockData = [
        {key: '1', name: 'Dishes', status: 'incomplete'},
        {key: '2', name: 'Cleaning', status: 'in progress'},
    ]

    state = {
        myChoresList: this.mockData,
        allChoresList: this.mockData
    }

    constructor(props) {
        super(props);
	}
	
	async componentDidMount(){
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
			chores = await getDB({data: {groupid: res.result.groupid}}, 'getChoresByGroupID')

			var allChoresList = []
			var i = 1
			for(key in chores.result){
				var obj = chores.result[key]
				var name = ''
				var status = 'incomplete'
				for (var prop in obj) {
					if (!obj.hasOwnProperty(prop)) continue;
					if(prop == "choreName"){
						name = obj[prop]
					}else if(prop == "status"){
						status = obj[prop]
					}
				}

				allChoresList.push({key: i, name, status})
				i++
			}

			this.setState({allChoresList, myChoresList: allChoresList})
		}
	}

     onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    onPressChore(data) {
        console.log("Edit Chore options");
        console.log(data);
        this.props.navigation.navigate('EditChore', {key: data.item.key});
    }

    renderItem = data => (
        <TouchableHighlight
            onPress={() => this.onPressChore(data)}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <View>
                <Text>Name: {data.item.name}</Text>
                <Text>Status: {data.item.status}</Text>
            </View>
        </TouchableHighlight>
    );

    renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <Text>Left</Text>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => console.log('Clicked in progress for', data.item.key)}
            >
                <Text style={styles.backTextWhite}>In Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => console.log('Clicked Done for', data.item.key)}
            >
                <Text style={styles.backTextWhite}>Done</Text>
            </TouchableOpacity>
        </View>
    );

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <View style={componentStyles.cardSectionWithBorderStyle}>
                    <Text style={styles.cardHeaderTextStyle}>My Chores</Text>
                    <SwipeListView
                        data={this.state.myChoresList}
                        renderItem={this.renderItem}
                        renderHiddenItem={this.renderHiddenItem}
                        leftOpenValue={75}
                        stopLeftSwipe={100}
                        rightOpenValue={-150}
                        stopRightSwipe={-250}
                        previewRowKey={'0'}
                        previewOpenValue={-40}
                        previewOpenDelay={3000}
                        onRowDidOpen={this.onRowDidOpen}
                    />
                </View>

                <View style={componentStyles.cardSectionWithBorderStyle}>
                    <Text style={styles.cardHeaderTextStyle}>All Chores</Text>
					<SwipeListView
                        data={this.state.allChoresList}
                        renderItem={this.renderItem}
                        renderHiddenItem={this.renderHiddenItem}
                        leftOpenValue={75}
                        stopLeftSwipe={100}
                        rightOpenValue={-150}
                        stopRightSwipe={-250}
                        previewRowKey={'0'}
                        previewOpenValue={-40}
                        previewOpenDelay={3000}
                        onRowDidOpen={this.onRowDidOpen}
                    />
                </View>
                <FAB
                    style={styles.fab}
                    small
                    color={theme.darkColor}
                    icon="plus"
                    onPress={() => {
                        console.log("Pressed fab");
                        this.props.navigation.navigate('CreateChore');
                    }}
                />
            </View>
        );
    }
}

const styles = {



    cardHeaderTextStyle: {
        fontWeight: 'bold',
        color: theme.buttonTextColor,
        textAlign: 'center',
        marginBottom: 20
    },

    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        paddingLeft: 20,
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme.lightColor
    },
};


export default ChoresTab;
