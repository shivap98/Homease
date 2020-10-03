/**
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import LoginPage from './LoginPage';
import CreateAccount from './CreateAccount';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import theme from './common/theme';


const Stack = createStackNavigator();
const lighColor = theme.lightColor;


const App: () => React$Node = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
			screenOptions={{
				headerStyle: {
				  backgroundColor: lighColor,
				},
				headerTintColor: '#fff',
				headerTitleStyle: {
				  fontWeight: 'bold',
				  fontSize: 20
				},
			  }}
			initalRouteName = "Home">
				<Stack.Screen name="Homease" component={LoginPage} />
				<Stack.Screen name="SignUp" component={CreateAccount} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};


export default App;
