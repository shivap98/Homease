/**
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, Text } from 'react-native'
import LoginPage from './LoginPage';
import CreateAccount from './CreateAccount';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initalRouteName = "Home">
				<Stack.Screen name="Homease" component={LoginPage} />
				<Stack.Screen name="SignUp" component={CreateAccount} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};


export default App;
