import React, {Component} from "react";
import {ScrollView, View, Text, Alert} from "react-native";
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';

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
        phoneNumber: '',
        venmoUsername: '',

    };

    createUserButtonPressed() {
        if (this.state.email === "" || this.state.firstName === "" || this.state.lastName === "" ||
            this.state.phoneNumber === "" || this.state.venmoUsername === "") {
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

    }

    render() {
        return (
            <PaperProvider>
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
                            style={styles.buttonContainedStyle}
                            mode="contained"
                            onPress={this.createUserButtonPressed.bind(this)}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>CREATE USER</Text>
                        </Button>
                    </View>
                </ScrollView>
            </PaperProvider>
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
        flex: 1
    },

    buttonContainedStyle: {
        height: 47,
        justifyContent: 'center',
        marginTop: 4
    }
};

export default CreateAccount;
