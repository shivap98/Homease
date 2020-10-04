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
import Account from './Account'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import theme from './common/theme';


const Stack = createStackNavigator();


// const App: () => React$Node = () => {
	
// 	return (
// 		<NavigationContainer>
// 			<Stack.Navigator
// 			screenOptions={{
// 				headerStyle: {
// 				  backgroundColor: theme.lightColor,
// 				},
// 				headerTintColor: '#fff',
// 				headerTitleStyle: {
// 				  fontWeight: 'bold',
// 				  fontSize: 20
// 				},
// 			  }}
// 			initalRouteName = "Home">
// 				<Stack.Screen name="Homease" component={LoginPage} />
// 				<Stack.Screen
// 					name="SignUp"
// 					component={CreateAccount}
// 					options={{ title: 'Sign up' }}
// 				/>
// 				<Stack.Screen
// 					name="Account"
// 					component={Account}
// 					options={{ title: 'Account' }}
// 				/>
// 			</Stack.Navigator>
// 		</NavigationContainer>
// 	);
// };

class App extends Component<Props> {


    componentWillMount(): void {
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
		)
	}
}


export default App;
