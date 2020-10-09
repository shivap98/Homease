import React, {Component} from "react";
import {ScrollView, View, Text, Alert} from "react-native";
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';
import paperTheme from './common/paperTheme';
import theme from './common/theme';
import api from './common/api';
import {CardSection} from "./common";
import firebase from 'firebase';
import componentStyles from './common/componentStyles';
import { StackActions } from '@react-navigation/native';
import getDB from './Cloud';


class CreateAccount extends Component{
    static navigationOptions = () => {
        return {
            title: 'Create Account'
        };
    };

    state = {
        firstName: '',
        lastName: '',
		email: '',
		password: '',
        phoneNumber: '',
        venmoUsername: '',
		uid: '',
		firstNameDisabled: false,
		lastNameDisabled: false,
		emailDisabled: false,
		phoneNumberDisabled: false,
		passwordDisabled: false
	};
	
	constructor(props) {
		super(props);
	}

	componentDidMount(){
		if(this.props.route.params && (this.props.route.params.facebook || this.props.route.params.google)) {
			var data = (this.props.route.params.facebook)?this.props.route.params.facebook:this.props.route.params.google
			var name = data.displayName.split(" ")
			this.setState({firstName: name[0], firstNameDisabled: (name[0])?true:false, lastName: name[1], lastNameDisabled: (name[1])?true:false,
				 email: data.email, emailDisabled: (data.email)?true:false, phoneNumber: data.metadata.phoneNumber,
				passwordDisabled: true, phoneNumberDisabled: (data.metadata.phoneNumber)?true:false, uid: data.uid})
		}
	}


	onSignUpButtonPressed = async () => {

        if (this.state.email === "" || this.state.firstName === "" || this.state.lastName === "" ||
			this.state.phoneNumber === "" || this.state.venmoUsername === "" || (this.state.password === ""  
			&& this.state.passwordDisabled==false)) {
            Alert.alert(
                'Oops!',
                'Check the first name, last name, phone number and venmo username',
                [
                    {
                        text: 'OK',
                        onPress: () => {},
                        style: 'cancel',
                    },

                ],
                {cancelable: false},
            );
            return;
        }

		const {email, password, phoneNumber, firstName, lastName, venmoUsername} = this.state;
		
		if(this.props.route.params && (this.props.route.params.facebook || this.props.route.params.google)) {
			getDB({ data: this.state }, "createUser");
		} else {
			try {
                await firebase.auth().createUserWithEmailAndPassword(email, password)
                this.setState({uid: firebase.auth().currentUser.uid})
			    getDB({ data: this.state }, "createUser");
			} catch (err) {
                // TODO: show pop and not proceed
				console.log(err)
			}
			
		}

        
		this.props.navigation.dispatch(
			StackActions.popToTop()
		);
		this.props.navigation.dispatch(
			StackActions.replace('Home', { screen: 'Account' })
		);
        
	}
	


    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <ScrollView>
                        <View style={styles.viewStyle}>
                            <TextInput
                                style={styles.textInputStyle}
                                label='First Name'
								mode='outlined'
								disabled={this.state.firstNameDisabled}
                                value={this.state.firstName}
                                onChangeText={textString => this.setState({firstName: textString})}
                            />
                            <TextInput
                                style={styles.textInputStyle}
                                label='Last Name'
								mode='outlined'
								disabled={this.state.lastNameDisabled}
                                value={this.state.lastName}
                                onChangeText={textString => this.setState({lastName: textString})}
                            />
                            <TextInput
                                style={styles.textInputStyle}
                                label='Email'
								mode='outlined'
								disabled={this.state.emailDisabled}
                                value={this.state.email}
                                onChangeText={textString => this.setState({email: textString})}

                            />
							<TextInput
                                style={styles.textInputStyle}
                                label='Password'
								mode='outlined'
								disabled={this.state.passwordDisabled}
								value={this.state.password}
								secureTextEntry
                                onChangeText={textString => this.setState({password: textString})}

                            />
                            <TextInput
                                style={styles.textInputStyle}
                                label='Phone Number'
								mode='outlined'
								disabled={this.state.phoneNumberDisabled}
                                value={this.state.phoneNumber}
                                keyboardType='numeric'
                                onChangeText={textString => this.setState({phoneNumber: textString.replace(/[^0-9]/g, '')})}

                            />
                            <TextInput
                                style={styles.textInputStyle}
                                label='Venmo Username'
                                mode='outlined'
                                value={this.state.venmoUsername}
                                onChangeText={textString => this.setState({venmoUsername: textString})}
                            />
                            <Button
                                    color={theme.buttonColor}
                                    style={{...styles.buttonContainedStyle}}
                                    mode="contained"
                                    onPress={this.onSignUpButtonPressed}
                                >
                                <Text style={componentStyles.bigButtonTextStyle}>
                                    CREATE USER
                                </Text>
                            </Button>
                        </View>
                    </ScrollView>
                </PaperProvider>
            </View>
        )
    }
}

const styles = {

    viewStyle: {
        margin: 10,
        padding: 12,
        flex: 1,
    },

    textInputStyle: {
        flex: 1,
        marginTop: 20
    },

    buttonContainedStyle: {
        height: 47,
        justifyContent: 'center',
        flex: 1,
        marginTop: 25
    }
};

export default CreateAccount;
