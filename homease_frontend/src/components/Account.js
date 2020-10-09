import React, {Component} from 'react';
import {Text, View, ScrollView, Image, LayoutAnimation, UIManager, Share} from 'react-native';
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

    state = {
        uid: ''
    }

    constructor(props) {
        super(props);

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
		}
	}
	
	async componentDidMount(){
        var uid = null
        if (auth().currentUser) {
            uid = auth().currentUser.uid
            this.setState({uid: auth().currentUser.uid})
        } else {
            uid = firebase.auth().currentUser.uid
            this.setState({uid: firebase.auth().currentUser.uid})
        }
        console.log("uid", uid);
		res = await getDB({data: {uid: uid} }, "getUser")

		if(res.result){
			this.setState({
                name: res.result.firstName + " " + res.result.lastName, 
                phoneNumber: res.result.phoneNumber, 
                venmoUsername: res.result.venmoUsername,
                admin: res.result.admin
            })
		}

		if(res.result.groupid){
			res = await getDB({data: {groupid: res.result.groupid} }, "getGroupFromGroupID")
			mems = res.result.users
			values = []
			for (var key in mems) {
				var user = await getDB({data: {uid: mems[key]} }, "getUser")
				values.push({name: user.result.firstName + " " + user.result.lastName, admin: user.result.admin, uid: mems[key]});
			}
			this.setState({members: values, group: res.result, groupName: res.result.groupName})
		}
		
	}

    state = {
		group: {},
        name: '',
        edit: false,
        phoneNumber: '',
        venmoUsername: '',
        members: [],
        groupName: 'TempName',
		admin: false,
    };

    onSharePressed = async () => {
        try {
          const result = await Share.share({
            message:
              'Sample share message',
          });
        } catch (error) {
          alert(error.message);
        }
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

    renderListofMembers (){
		let members = this.state.members;
		if(this.state.admin){
			return members.map((item)=>{
				return(
					<List.Item
						title={(item.admin)?"* "+item.name:item.name}
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
		}else{
			return members.map((item)=>{
				return(
					<List.Item
						title={(item.admin)?"* "+item.name:item.name}
						titleStyle={styles.cardHeaderTextStyle}
						key={item.name}
					/>
				)
			})
		}
        
    }

	async signOut() {
		console.log(firebase.auth())
        firebase.auth().signOut().then(async function () {
			console.log("Signed out fire")
        });
        auth().signOut().then(async function () {
			console.log("Signed out auth")
        });
        // this.props.navigation.dispatch(
		// 	StackActions.popToTop()
		// );
		this.props.navigation.dispatch(
			StackActions.replace('Homease')
		);
    };

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <ScrollView>
                        <Card>
                            <Text style = {styles.groupHeadingStyle}>{this.state.groupName}</Text>
                            <View style={styles.groupPictureStyle}>
                                <Image
                                    style={styles.profilePicStyle}
                                    source={require('../img/logo.png')}
                                    resizeMode='contain'
                                />
                            </View>
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
                                    onValueChange={() => {this.setState({edit: !this.state.edit})}}
                                />
                            </CardSection>
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
												uid: this.state.uid,
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
                                <TextInput
                                    style={styles.textInputStyle}
                                    label='Group Name'
                                    mode='outlined'
                                    value={this.state.groupName}
                                    theme={{
                                        colors: {
                                            placeholder: this.state.edit ? 'white' : theme.lightColor,
                                            text: this.state.edit ? 'white' : theme.lightColor,
                                            primary: this.state.edit ? 'white' : theme.lightColor,
                                        }
                                    }}
                                    keyboardAppearance='dark'
                                    editable={this.state.edit}
                                    onChangeText={textString => this.setState({groupName: textString})}
                                />
                                <CardSection>
                                    <Button style={styles.leaveAndShareButtonStyle} onPress={() => {this.onLeaveGroupPressed()}}>
                                        Leave Group
                                    </Button>
                                    <Button style={styles.leaveAndShareButtonStyle} icon={require('../icons/share-variant.png')} onPress={this.onSharePressed}>
                                        Invite someone
                                    </Button>
                                </CardSection>

                            </View>
                            <Button 
                                style={styles.buttonContainedStyle} color={theme.buttonColor} 
                                mode='contained'
                                onPress={() => {this.signOut()}}
                            >
                                <Text style={componentStyles.smallButtonTextStyle}>
                                        SIGN OUT
                                </Text>
                            </Button>
                            <Button
                                    color={theme.buttonColor}
                                    style={styles.buttonContainedStyle}
                                    mode="contained"
                                    onPress={() => {
                                        this.props.navigation.navigate('CreateOrJoin')
                                    }}
                                >
                                    Group options
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
