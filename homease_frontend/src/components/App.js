/**
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import LoginPage from './LoginPage';
import CreateAccount from './CreateAccount';
import Account from './Account'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import theme from './common/theme';


const Stack = createStackNavigator();


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
			initalRouteName = "Home">
				<Stack.Screen name="Homease" component={LoginPage} />
				<Stack.Screen
					name="SignUp"
					component={CreateAccount}
					options={{ title: 'Sign up' }}
				/>
				<Stack.Screen
					name="Account"
					component={Account}
					options={{ title: 'Account' }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};


export default App;
