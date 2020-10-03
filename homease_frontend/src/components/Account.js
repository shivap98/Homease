import React, {Component} from 'react';
import {Text, View, ScrollView, Image} from 'react-native';
import {Card, CardSection} from "./common";
import theme from './common/theme';
import {Button, Provider as PaperProvider, TextInput, Avatar} from 'react-native-paper';
import paperTheme from './common/paperTheme';


class Account extends Component {

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <ScrollView>
                        <Card>
                            <Text style = {styles.groupHeadingStyle}>GROUP NAME</Text>
                            <CardSection style = {styles.cardSectionStyle}>
                                <Avatar.Image style = {styles.groupPictureStyle} source = {require('../img/logo.png')}/>
                            </CardSection>
                            <Image
                                style={styles.profilePicStyle}
                                source={require('../img/logo.png')}
                                resizeMode='contain'
                            />
                            <CardSection>
                                <Text style={styles.cardHeaderTextStyle}>PROFILE</Text>
                            </CardSection>
                            <CardSection>
                                <Text style={styles.cardHeaderTextStyle}>GROUP</Text>
                            </CardSection>
                            <Button style={styles.buttonContainedStyle} color={theme.buttonColor} mode='contained'>
                                <Text>SIGN OUT</Text>
                            </Button>
                        </Card>
                    </ScrollView>
                </PaperProvider>
            </View>
        );
    }
}

const styles = {

    groupHeadingStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        color: theme.buttonColor
    },
    groupPictureStyle: {
        alignItems: 'center'
    },
    cardSectionStyle: {
        alignItems: 'center',
        flex: 1
    },
    profilePicStyle: {
        height: 100,
        width: 100,
        alignItems: 'center',
        flex: 1,
    },
    cardHeaderTextStyle: {
        fontWeight: 'bold',
        flex: 1,
        color: theme.buttonTextColor
    },
    buttonContainedStyle: {
        height: 47,
        justifyContent: 'center',
        margin: 3,
        flex: 1,
    }
};

export default Account;
