import React, {Component} from "react";
import {ScrollView, View, Text, Alert} from "react-native";
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';
import paperTheme from './common/paperTheme';
import theme from './common/theme';
import {CardSection} from "./common";
import firebase from 'firebase';
import componentStyles from './common/componentStyles';
import { StackActions } from '@react-navigation/native';


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
    };

 

	async onSignUpButtonPressed() {

        if (this.state.email === "" || this.state.firstName === "" || this.state.lastName === "" ||
            this.state.phoneNumber === "" || this.state.venmoUsername === "" || this.state.password === "") {
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
        try {
			console.log("waiting to create")
			await firebase.auth().createUserWithEmailAndPassword(email, password)
			console.log(created)
        } catch (err) {
            Alert.alert(
                'Oops!',
                err.message,
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },

                ],
                {cancelable: false},
            );
            console.log(err)
		}

		this.props.navigation.dispatch(
			StackActions.popToTop()
		);
		this.props.navigation.dispatch(
			StackActions.replace('Account')
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
                                value={this.state.firstName}
                                onChangeText={textString => this.setState({firstName: textString})}
                            />
                            <TextInput
                                style={styles.textInputStyle}
                                label='Last Name'
                                mode='outlined'
                                value={this.state.lastName}
                                onChangeText={textString => this.setState({lastName: textString})}
                            />
                            <TextInput
                                style={styles.textInputStyle}
                                label='Email'
                                mode='outlined'
                                value={this.state.email}
                                onChangeText={textString => this.setState({email: textString})}

                            />
							<TextInput
                                style={styles.textInputStyle}
                                label='Password'
                                mode='outlined'
								value={this.state.password}
								secureTextEntry
                                onChangeText={textString => this.setState({password: textString})}

                            />
                            <TextInput
                                style={styles.textInputStyle}
                                label='Phone Number'
                                mode='outlined'
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
                                    onPress={this.onSignUpButtonPressed.bind(this)}
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
