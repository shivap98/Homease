import React, {Component} from 'react';
import {Text, View, TouchableOpacity, TouchableHighlight, ScrollView} from 'react-native';
import theme from './common/theme';
import componentStyles from './common/componentStyles';
import { SwipeListView } from 'react-native-swipe-list-view';
import {FAB} from 'react-native-paper';
import getDB from './Cloud';
import auth from '@react-native-firebase/auth';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class ChoresTab extends Component {

    mockData = [
        {key: '1', name: 'Dishes', status: 'incomplete'},
        {key: '2', name: 'Cleaning', status: 'in progress'},
        {key: '3', name: 'Cleaning', status: 'in progress'},
        {key: '4', name: 'Cleaning', status: 'in progress'},
        {key: '5', name: 'Cleaning', status: 'in progress'},
        {key: '6', name: 'Cleaning', status: 'in progress'},

    ]
    
    state = {
        myChoresList: [],
        allChoresList: []
    }

    groupid = ''

    constructor(props) {
        super(props);
	}

	async getDbInfo(uid, res) {
		chores = await getDB({data: {groupid: res.result.groupid}}, 'getChoresByGroupID')

		var allChoresList = []
		var myChoresList = []
		for(key in chores.result){
			var obj = chores.result[key]
			var name = ''
			var status = 'Incomplete'
			var selectedUsers = []
			for (var prop in obj) {
				if (!obj.hasOwnProperty(prop)) continue;
				if(prop == "choreName"){
					name = obj[prop]
				} else if(prop == "status"){
					status = obj[prop]
				} else if(prop == "selectedUsers"){
					selectedUsers = obj[prop]
				}
			}
            if (selectedUsers.includes(uid)) {
                myChoresList.push({key, name, status, selectedUsers})
            } else {
                allChoresList.push({key, name, status, selectedUsers})
            }
		}

		this.setState({allChoresList, myChoresList})
	}
	
	async componentWillMount(){
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
			
			firebase.database().ref('/groups/'+res.result.groupid + '/chores/').on('value', (snapshot) => {
				this.getDbInfo(uid, res)
			})
		}
	}

     onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    onPressChore(data) {
        console.log("View chore");
        this.props.navigation.navigate('Chore', {key: data.item.key, groupid: this.groupid});
    }

    renderMyChores = data => (
        <TouchableHighlight
            onPress={() => this.onPressChore(data)}
            style={styles.rowFront}
            underlayColor={theme.lightColor}
        >
            <View>
                <Text 
                    style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}
                >
                    {data.item.name}
                </Text>
                <Text 
                    style={{ color: 'white', fontSize: 18 }}
                >
                    Status: {data.item.status}
                </Text>
            </View>
        </TouchableHighlight>
    );

    renderAllChores = data => (
        <TouchableHighlight
            onPress={() => this.onPressChore(data)}
            style={styles.rowFront}
            underlayColor={theme.lightColor}
        >
            <View>
                <Text 
                    style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}
                >
                    {data.item.name}
                </Text>
                <Text 
                    style={{ color: 'white', fontSize: 18 }}
                >
                    Status: {data.item.status}
                </Text>
            </View>
        </TouchableHighlight>
    );

    rendeSwipeOptions = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.inProgressButtonStyle]}
                onPress={() => console.log('Clicked in progress for', data.item.key)}
            >
                <Icon name='progress-check' size={30}/>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.doneButtonStyle]}
                onPress={() => console.log('Clicked Done for', data.item.key)}
            >
                <Icon name='check' size={30}/>
            </TouchableOpacity>
        </View>
    );

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <ScrollView>
                    <View style={componentStyles.cardSectionWithBorderStyle}>
                        <Text style={styles.cardHeaderTextStyle}>My Chores</Text>
                        <SwipeListView
                            data={this.state.myChoresList}
                            renderItem={this.renderMyChores}
                            renderHiddenItem={this.rendeSwipeOptions}
                            rightOpenValue={-150}
                            disableRightSwipe={true}                        
                            previewRowKey={'0'}
                            previewOpenValue={-40}
                            previewOpenDelay={5000}
                            onRowDidOpen={this.onRowDidOpen}
                        />
                    </View>

                    <View style={componentStyles.cardSectionWithBorderStyle}>
                        <Text style={styles.cardHeaderTextStyle}>All Chores</Text>
                        <SwipeListView
                            data={this.state.allChoresList}
                            renderItem={this.renderAllChores}
                            disableRightSwipe={true}
                            disableLeftSwipe={true}
                            onRowDidOpen={this.onRowDidOpen}
                        />
                    </View>
                </ScrollView>
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
    rowFront: {
        backgroundColor: theme.lightColor,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        flex: 1,
        paddingLeft: 20,
        padding: 10,
        margin: 7
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    inProgressButtonStyle: {
        backgroundColor: 'yellow',
        right: 75,
    },
    doneButtonStyle: {
        backgroundColor: '#09af00',
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
