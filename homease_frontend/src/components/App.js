/**
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import LoginPage from './LoginPage';
import CreateAccount from './CreateAccount';
import Account from './Account';
import Chores from './Chores';
import CreateOrJoin from './CreateOrJoinGroup';
import CreateGroup from './CreateGroup';
import JoinGroup from './JoinGroup';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import theme from './common/theme';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Home() {
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
		<Tab.Screen name="Chores" component={Chores} />
		<Tab.Screen name="Account" component={Account} />
	  </Tab.Navigator>
	);
  }

const App: () => React$Node = () => {
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
			initalRouteName = "Login">
				<Stack.Screen name="Homease" component={LoginPage} />
				<Stack.Screen
					name="SignUp"
					component={CreateAccount}
					options={{ title: 'Sign up' }}
				/>
				<Stack.Screen
					name="Home"
					component={Home}
					options={{ title: 'Homease' }}
				/>
				<Stack.Screen
					name="CreateOrJoin"
					component={CreateOrJoin}
					option={{title: 'Create or Join a Group'}}
				/>
				<Stack.Screen
					name="CreateGroup"
					component={CreateGroup}
					option={{title: 'Create a Group'}}
				/>
				<Stack.Screen
					name="JoinGroup"
					component={JoinGroup}
					option={{title: 'Join a Group'}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};


export default App;
