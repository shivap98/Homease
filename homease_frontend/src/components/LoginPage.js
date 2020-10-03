import React, {Component} from 'react';
import {Alert, Image, ScrollView, Text, View} from 'react-native';
import {Card, CardSection} from "./common";
import paperTheme from './common/paperTheme';
import theme from './common/theme';
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';
import componentStyles from './common/componentStyles'


class LoginPage extends Component {
    static navigationOptions = {
        title: 'Homease',
        headerBackTitle: 'Login'
    };

    constructor(props) {
        super(props);

        this._isMounted = true;
    }


    state = {email: '', password: '', loggedIn: null};

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
                                        style={{...styles.buttonContainedStyle, margin: 0}}
                                        mode="contained"
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
                                        <Text style={componentStyles.smallButtonTextStyle}>
                                            CREATE ACCOUNT
                                        </Text>
                                    </Button>
                                    <Button
                                        color={theme.buttonColor}
                                        style={styles.buttonContainedStyle}
                                        mode="contained"
                                    >
                                        <Text style={componentStyles.smallButtonTextStyle}>
                                            FORGOT PASSWORD
                                        </Text>
                                    </Button>

                                </CardSection>
                            </Card>
                        </View>
                    </ScrollView>
                </PaperProvider>
            </View>
        );
    }
}

const backgroundColor = theme.backgroundColor;

const styles = {
    containerStyle: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: {backgroundColor}
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
        margin: 3,
        flex: 1,
    },
}

export default LoginPage;
