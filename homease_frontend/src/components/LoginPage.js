import React, {Component} from 'react';
import {Image, ScrollView, Text, View, Platform} from 'react-native';
import {Card, CardSection} from "./common";
import paperTheme from './common/paperTheme';
import auth from '@react-native-firebase/auth';
import theme from './common/theme';
import {GoogleSignin, GoogleSigninButton} from '@react-native-community/google-signin';
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import componentStyles from './common/componentStyles';
import { StackActions } from '@react-navigation/native';
import firebase from 'firebase';
import getDB from './Cloud';
import Icon from 'react-native-vector-icons/FontAwesome';

class LoginPage extends Component {
    static navigationOptions = {
        title: 'Homease',
        headerBackTitle: 'Login'
	};

	
	componentDidMount(){
		GoogleSignin.configure({
			webClientId: '1089297007765-rmef63cdjmb0npbrii82eo0osgtpebh6.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
			offlineAccess: true,
			hostedDomain: '',
			forceConsentPrompt: true
        });
	}

    constructor(props) {
        super(props);
        this._isMounted = true;
	}

	state = {email: '', password: '', loggedIn: null};

	onLoginButtonPressed = async() => {
		const {email, password} = this.state;
		try{
			await firebase.auth().signInWithEmailAndPassword(email, password)
			const user = firebase.auth().currentUser;
			if (user != null) {
				user.providerData.forEach(function (profile) {
					console.log("  Email: " + profile.email);
				});
                this.props.navigation.dispatch(
                    StackActions.replace('Home', { screen: 'Chores' })
                );
			}
		} catch (err) {
            console.log(err)
		}
	}

	signIn = async () => {
		try {
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();
            var credential = auth.GoogleAuthProvider.credential(userInfo.idToken);
            await auth().signInWithCredential(credential)
		} catch (error) {
			console.log("error in google sign in", error)
        }

		res = await getDB({data: {uid: auth().currentUser.uid} }, "getUser")

		if(!res.result){
			this.props.navigation.navigate('SignUp', params = {google: auth().currentUser})
		}else{
			this.props.navigation.dispatch(
				StackActions.replace('Home', { screen: 'Chores' })
            );
		}
        
	};

	fbSignIn = async () => {
	
		const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

		if (result.isCancelled) {
			throw 'User cancelled the login process';
		}

		// Once signed in, get the users AccesToken
		const data = await AccessToken.getCurrentAccessToken();

		if (!data) {
			throw 'Something went wrong obtaining access token';
		}

		// Create a Firebase credential with the AccessToken
		const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
		// Sign-in the user with the credential
		val = await auth().signInWithCredential(facebookCredential);

		res = await getDB({data: {uid: auth().currentUser.uid} }, "getUser")

		if(!res.result){
			this.props.navigation.navigate('SignUp', params = {facebook: auth().currentUser})
		}else{
			this.props.navigation.dispatch(
				StackActions.replace('Home', { screen: 'Chores' })
            );
		}
		
        return val;
	};
    render() {

        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <ScrollView>
                        <View style={styles.containerStyle}>
                            <Card>
                                <CardSection>
                                    <Image
                                        style={styles.logoStyle}
                                        source={require('../img/logo.png')}
                                        resizeMode='contain'
                                    />
                                </CardSection>

                                <CardSection>
                                    <TextInput
                                        testID="emailID"
                                        style={styles.textInputStyle}
                                        label='Email'
                                        mode='outlined'
                                        value={this.state.email}
                                        onChangeText={textString => this.setState({email: textString})}

                                    />
                                </CardSection>

                                <CardSection>
                                    <TextInput
                                        testID="password"
                                        style={styles.textInputStyle}
                                        label='Password'
                                        mode='outlined'
                                        secureTextEntry
                                        value={this.state.password}
                                        onChangeText={textString => this.setState({password: textString})}
                                    />
                                </CardSection>

                                <CardSection style={{flex: 1}}>
                                    <Button
                                        color={theme.buttonColor}
                                        testID="loginButton"
                                        style={styles.buttonContainedStyle}
                                        mode="contained"
                                        onPress={this.onLoginButtonPressed}
                                    >
                                        <Text style={componentStyles.bigButtonTextStyle}>
                                            LOG IN
                                        </Text>
                                    </Button>
                                </CardSection>
                                <CardSection style={{justifyContent: 'space-around'}}>
                                    <Button
                                        color={theme.buttonColor}
                                        style={styles.buttonContainedStyle}
                                        mode="contained"
                                        onPress={() => {
                                            this.props.navigation.navigate('SignUp')
                                        }}
                                    >
                                        <Text style={componentStyles.bigButtonTextStyle}>
                                            CREATE ACCOUNT
                                        </Text>
                                    </Button>
                                </CardSection>

								<CardSection style={{justifyContent: 'space-around'}}>
									<GoogleSigninButton
										style={{height: 48, justifyContent: 'center', flex: 1}}
										size={GoogleSigninButton.Size.Wide}
										color={GoogleSigninButton.Color.Dark}
										onPress={this.signIn}
										disabled={false}
									/>
                                    <Icon.Button
                                        name="facebook" 
                                        backgroundColor="#3b5998" 
                                        onPress={this.fbSignIn}
                                        size={40}
                                        style={{...styles.buttonContainedStyle}}
                                    >
                                        <Text style={{ fontSize: 15, color: 'white'}}>
                                            Sign in with Facebook
                                        </Text>
                                    </Icon.Button>
                            	</CardSection>
                            </Card>
                        </View>
                    </ScrollView>
                </PaperProvider>
            </View>
        );
	}
}


const styles = {
    containerStyle: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: theme.backgroundColor
    },
    textInputStyle: {
        flex: 1,
    },
    logoStyle: {
        height: 160,
        width: 150,
        alignItems: 'center',
        flex: 1
    },
    buttonContainedStyle: {
        height: 47,
        justifyContent: 'center',
        flex: 1,
    },
}

export default LoginPage;
