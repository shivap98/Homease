/**
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, {Component} from 'react';
import firebase from 'firebase';
import LoginPage from './LoginPage';
import CreateAccount from './CreateAccount';
import Account from './Account';
import Chore from './Chore';
import ChoresTab from './ChoresTab';
import CreateChore from './CreateChore';
import CreateOrJoin from './CreateOrJoinGroup';
import CreateGroup from './CreateGroup';
import ExpensesTab from './ExpensesTab';
import JoinGroup from './JoinGroup';
import CheckList from './CheckList';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import theme from './common/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

class App extends Component<Props> {

	componentDidMount() {
		if (firebase.apps.length === 0) {
			firebase.initializeApp({
				apiKey: "AIzaSyDifrMqo7F-1AqDzwzWxwKdH_5Ge_TboRc",
				authDomain: "homease-9de86.firebaseapp.com",
				databaseURL: "https://homease-9de86.firebaseio.com",
				projectId: "homease-9de86",
				storageBucket: "homease-9de86.appspot.com",
				messagingSenderId: "1089297007765",
				appId: "1:1089297007765:web:b9ebd88fb7f4f30a46c79c",
				measurementId: "G-6WEMEMJBH4"
			  }
			);
		}
	}

	Home = () => {
		return (
			<Tab.Navigator
				tabBarOptions={{
					activeTintColor: 'white',
					inactiveTintColor: theme.darkColor,
					style: {
						backgroundColor: theme.lightColor,
					},
					labelStyle: {
						fontSize: 18,
					},
				}}
			>
				<Tab.Screen name="Chores" component={ChoresTab} />
				<Tab.Screen name="Lists" component={CheckList} />
				<Tab.Screen name="Expenses" component={ExpensesTab} />
				<Tab.Screen name="Account" component={Account} />
			</Tab.Navigator>
		);
	}

    render() {
		return (
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerStyle: {
							backgroundColor: theme.lightColor,
						},
						headerTintColor: '#fff',
						headerTitleStyle: {
							fontWeight: 'bold',
							fontSize: 20
						},
					}}
					initalRouteName="Login">
					<Stack.Screen name="Homease" component={LoginPage} />
					<Stack.Screen
						name="SignUp"
						component={CreateAccount}
						options={{ title: 'Sign up' }}
					/>
					<Stack.Screen
						name="Home"
						component={this.Home}
						options={{ title: 'Homease' }}
					/>
					<Stack.Screen
						name="CreateOrJoin"
						component={CreateOrJoin}
					/>
					<Stack.Screen
						name="CreateGroup"
						component={CreateGroup}
					/>
					<Stack.Screen
						name="JoinGroup"
						component={JoinGroup}
					/>
					<Stack.Screen
						name="CreateChore"
						component={CreateChore}
					/>
					<Stack.Screen
						name="Chore"
						component={Chore}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}

export default App;
