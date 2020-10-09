import React, {Component} from 'react';
import {Text, View, ScrollView, Image, LayoutAnimation, UIManager} from 'react-native';
import {Card, CardSection} from "./common";
import theme from './common/theme';
import {Button, Provider as PaperProvider, TextInput, List, Switch} from 'react-native-paper';
import firebase from 'firebase';
import paperTheme from './common/paperTheme';
import componentStyles from './common/componentStyles';
import { StackActions } from '@react-navigation/native';
import getDB from './Cloud';
import auth from '@react-native-firebase/auth';



class Account extends Component {

    constructor(props) {
        super(props);

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
		}
	}
	
	async componentDidMount(){
		res = await getDB({data: {uid: auth().currentUser.uid} }, "getUser")

		if(res.result){
			this.setState({name: res.result.firstName + " " + res.result.lastName, phoneNumber: res.result.phoneNumber, 
			venmoUsername: res.result.venmoUsername})
		}
	}

    state = {
        name: 'Temp',
        edit: false,
        phoneNumber: '1234567890',
        venmoUsername: 'temp',
        members: [
            {name: 'User1', admin: true},
            {name: 'User2', admin: false}
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
                    key={item.name}
                    right={props =>
                        <CardSection>
                            <Button onPress={() => {this.onAdminPressed()}}><Text>Admin</Text></Button>
                            <Button onPress={() => {this.onRemovePressed()}}><Text>Remove</Text></Button>
                        </CardSection>
                    }
                />
            )
        })
    }

	async signOut() {
		console.log(firebase.auth())
        firebase.auth().signOut().then(async function () {
            // if (provider === "password") {
				
            // } else {
            //     try {
            //         await GoogleSignin.revokeAccess();
            //         await GoogleSignin.signOut();

            //     } catch (error) {
            //         console.error(error);
            //     }
			// }


			
			console.log("Signed out!")
			

        });
    };

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <ScrollView>
                        <Card>
                            <Text style = {styles.groupHeadingStyle}>GROUP NAME</Text>
                            <View style={styles.groupPictureStyle}>
                                <Image
                                    style={styles.profilePicStyle}
                                    source={require('../img/logo.png')}
                                    resizeMode='contain'
                                />
                            </View>
                            <View style={styles.cardSectionStyle}>
                                <Text style={styles.cardHeaderTextStyle}>PROFILE SETTINGS</Text>
                                <CardSection>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        flex: 1,
                                        marginTop: 7,
                                        marginRight: 15,
                                        color: 'white',
                                        textAlign: 'right'
                                    }}>
                                        EDIT
                                    </Text>
                                    <Switch
                                        value={this.state.edit}
                                        onValueChange={async = () => {
											getDB({ data: {
												uid: auth().currentUser.uid,
												phoneNumber: this.state.phoneNumber,
												venmoUsername: this.state.venmoUsername
											}}, "editUser");
											this.setState({edit: !this.state.edit})

										}}
                                    />
                                </CardSection>
                                
                                <TextInput
                                    style={styles.textInputStyle}
                                    label='Name'
                                    mode='outlined'
                                    value={this.state.name}
                                    keyboardAppearance='dark'
                                    editable={false}
                                    onChangeText={textString => this.setState({name: textString})}
                                />
                                <TextInput
                                    style={styles.textInputStyle}
                                    label='Phone Number'
                                    mode='outlined'
                                    editable={this.state.edit}
                                    value={this.state.phoneNumber}
                                    theme={{
                                        colors: { 
                                            placeholder: this.state.edit ? 'white' : theme.lightColor,
                                            text: this.state.edit ? 'white' : theme.lightColor,
                                            primary: this.state.edit ? 'white' : theme.lightColor,
                                        }
                                    }}
                                    keyboardType='numeric'
                                    keyboardAppearance='dark'
                                    onChangeText={textString => this.setState({phoneNumber: textString.replace(/[^0-9]/g, '')})}
                                />
                                <TextInput
                                    style={styles.textInputStyle}
                                    label='Venmo Username'
                                    mode='outlined'
                                    editable={this.state.edit}
                                    value={this.state.venmoUsername}
                                    theme={{
                                        colors: { 
                                            placeholder: this.state.edit ? 'white' : theme.lightColor,
                                            text: this.state.edit ? 'white' : theme.lightColor,
                                            primary: this.state.edit ? 'white' : theme.lightColor,
                                        }
                                    }}
                                    keyboardAppearance='dark'
                                    onChangeText={textString => this.setState({venmoUsername: textString})}
                                />
                            </View>
                            <View style={styles.cardSectionStyle}>
                                <Text style={styles.cardHeaderTextStyle}>GROUP SETTINGS</Text>
                                    <List.Accordion
                                        title="List of members in group"
                                        onPress={() => {LayoutAnimation.easeInEaseOut()}}
                                    >
                                        {this.renderListofMembers()}
                                    </List.Accordion>
                                <CardSection>
                                    <Button style={styles.leaveAndShareButtonStyle} onPress={() => {this.onLeaveGroupPressed()}}>
                                        Leave Group
                                    </Button>
                                    <Button style={styles.leaveAndShareButtonStyle} icon={require('../icons/share-variant.png')} onPress={() => {this.onSharePressed()}}>
                                        Invite someone
                                    </Button>
                                </CardSection>
                                
                            </View>
                            <Button style={styles.buttonContainedStyle} color={theme.buttonColor} mode='contained'>
                                    <Text style={componentStyles.smallButtonTextStyle}>
                                            SIGN OUT
                                    </Text>
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
        margin: 5,
        marginBottom: 20,
        borderWidth: 2,
        padding: 20,
        borderColor: '#696969',
        borderRadius: 20
    },
    profilePicStyle: {
        height: 100,
        width: 100,
        alignItems: 'center',
        flex: 1,
    },
    cardHeaderTextStyle: {
        fontWeight: 'bold',
        marginTop: 10,
        flex: 1,
        color: theme.buttonTextColor,
        textAlign: 'center'
    },
    buttonContainedStyle: {
        height: 47,
        justifyContent: 'center',
        margin: 15,
        flex: 1,
    },
    leaveAndShareButtonStyle: {
        flex: 0.5,
        alignItems: 'center'
    },
    textInputStyle: {
        flex: 1,
        marginTop: 10
    },
};

export default Account;
