import React, {Component} from 'react';
import {Text, View, ScrollView, Image} from 'react-native';
import {Card, CardSection} from "./common";
import theme from './common/theme';
import {Button, Provider as PaperProvider, TextInput, Avatar, List, IconButton} from 'react-native-paper';
import paperTheme from './common/paperTheme';


class Account extends Component {

    state = {
        name: 'Temp',
        edit: 'False',
        phoneNumber: '',
        venmoUsername: '',
        members: [
            {name: 'User1'},
            {name: 'User2'}
        ]
    };

    onAdminPressed (){
        console.log("Pressed admin button");
    }

    onRemovePressed (){
        console.log("Pressed remove button");
    }

    onLeaveGroupPressed (){
        console.log("Pressed leave group button")
    }

    onSharePressed (){
        console.log("Pressed share button");
    }

    renderListofMembers (){
        let members = this.state.members;
        return members.map((item)=>{
            return(
                <List.Item
                    title={item.name}
                    titleStyle={styles.cardHeaderTextStyle}
                    right={props =>
                        <View>
                            <CardSection>
                                <Button onPress={() => {this.onAdminPressed()}}><Text>Admin</Text></Button>
                                <Button onPress={() => {this.onRemovePressed()}}><Text>Remove</Text></Button>
                            </CardSection>
                        </View>
                    }
                />
            )
        })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <ScrollView>
                        <Card>
                            <Text style = {styles.groupHeadingStyle}>GROUP NAME</Text>
                            {/*<CardSection style = {styles.cardSectionStyle}>*/}
                                {/*<Avatar.Image style = {styles.groupPictureStyle} source = {require('../img/logo.png')}/>*/}
                            {/*</CardSection>*/}
                            <View style={styles.groupPictureStyle}>
                            <Image
                                style={styles.profilePicStyle}
                                source={require('../img/logo.png')}
                                resizeMode='contain'
                            />
                            </View>
                            <Text style={styles.cardHeaderTextStyle}>PROFILE SETTINGS</Text>
                            <Button onPress={() => {this.setState({edit: !this.state.edit})}}>
                                <Text>Edit</Text>
                            </Button>
                            <TextInput
                                style={styles.textInputStyle}
                                label='Name'
                                mode='outlined'
                                value={this.state.name}
                                disabled='true'
                            />
                            <TextInput
                                style={styles.textInputStyle}
                                label='Phone Number'
                                mode='outlined'
                                disabled={this.state.edit}
                                value={this.state.phoneNumber}
                                keyboardType='numeric'
                                onChangeText={textString => this.setState({phoneNumber: textString.replace(/[^0-9]/g, '')})}
                            />
                            <TextInput
                                style={styles.textInputStyle}
                                label='Venmo Username'
                                mode='outlined'
                                disabled={this.state.edit}
                                value={this.state.venmoUsername}
                                onChangeText={textString => this.setState({venmoUsername: textString})}
                            />
                            <Text style={styles.cardHeaderTextStyle}>GROUP SETTINGS</Text>
                            {/*<List.Section title = "Members">*/}
                                <List.Accordion
                                    title="List of members in group"
                                >
                                    {this.renderListofMembers()}
                                </List.Accordion>
                            {/*</List.Section>*/}
                            <CardSection>
                                <Button style={styles.leaveAndShareButtonStyle} onPress={() => {this.onLeaveGroupPressed()}}>
                                    <Text>Leave group</Text>
                                </Button>
                                <Button style={styles.leaveAndShareButtonStyle} icon={require('../icons/share-variant.png')} onPress={() => {this.onSharePressed()}}>Invite someone</Button>
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
    },
    leaveAndShareButtonStyle: {
        flex: 0.5,
        alignItems: 'center'
    },
    textInputStyle: {
        flex: 1,
    },
};

export default Account;
