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
		group: {},
		user: {},
        edit: false,
		members: [],
		name: '',
		groupName: '',
		phoneNumber: '',
        venmoUsername: '',
        groupid: '',
        groupCode: '',
        outOfHouse: false
    };

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
		res = await getDB({data: {uid: uid} }, "getUser")

		if(res.result){
			this.setState({
				user: res.result,
				venmoUsername: res.result.venmoUsername,
				phoneNumber: res.result.phoneNumber,
                name: res.result.firstName + " " + res.result.lastName,
                groupid: res.result.groupid
            })
		}

		if(res.result.groupid){
			grp = await getDB({data: {groupid: res.result.groupid} }, "getGroupFromGroupID")
			mems = grp.result.users
			values = []
			for (var key in mems) {
				var user = await getDB({data: {uid: mems[key]} }, "getUser")
				values.push({name: user.result.firstName + " " + user.result.lastName, admin: user.result.admin, uid: mems[key]});
			}
			this.setState({
                    members: values, 
                    group: grp.result, 
                    groupName: grp.result.groupName,
                    groupCode: grp.result.groupCode
                })
		}
		
	}


    onSharePressed = async () => {

        const str = "Group ID: " + this.state.groupid.replace("*", "#") + "\nGroup Code: " + this.state.groupCode;
        try {
          const result = await Share.share({
            message:
              str
          });
        } catch (error) {
          alert(error.message);
        }
      };

    onAdminPressed (){
        console.log("Pressed admin button");
    }

    onRemovePressed (uid){
        if (uid == this.state.uid) {
            this.onLeaveGroupPressed(null);
        } else {
            this.onLeaveGroupPressed(uid);
        }
    }

    async onLeaveGroupPressed (uid){
        console.log("Pressed leave group button")

        if(this.state.user.groupid !== '') {
            
            var res = await getDB({
                data: {
                    uid: uid || this.state.uid,
                    groupid: this.state.user.groupid
                }
            }, "leaveGroup");

            //TODO fix admin when leaving group

            if(res.result == 'success' && !uid) {
                this.setState({
                    group: {},
                    members: [],
                    groupName: 'No Group',
                    admin: false,
                    groupid: ''
                });
            } else if (res.result == 'success' && uid) {
                newMembers = []
                this.state.members.map((member)=> {
                    if (member.uid != uid) {
                        newMembers.push(member)
                    }
                })
                this.setState({members: newMembers})
            }
        }
    }


    renderListofMembers (){
        let members = this.state.members;
		if(this.state.user.admin){
			return members.map((item)=>{
				return(
					<List.Item
						title={(item.admin)?"* "+item.name:item.name}
						titleStyle={styles.cardHeaderTextStyle}
						key={item.uid}
						right={props =>
							<CardSection>
								<Button onPress={() => {this.onAdminPressed()}}><Text>Admin</Text></Button>
								<Button onPress={() => {this.onRemovePressed(item.uid)}}><Text>Remove</Text></Button>
							</CardSection>
						}
					/>
				)
			})
		} else {
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
        firebase.auth().signOut().then(async function () {
			console.log("Signed out fire")
        });
        auth().signOut().then(async function () {
			console.log("Signed out auth")
        });
		this.props.navigation.dispatch(
			StackActions.replace('Homease')
		);
    };

    groupSectionVisibility() {
        if (this.state.groupid == '' || !this.state.groupid) {
            return (
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
            )
        } else {
            return (
                <View style={componentStyles.cardSectionWithBorderStyle}>
                    <Text style={styles.cardHeaderTextStyle}>GROUP SETTINGS</Text>
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
                        onChangeText={(textString) => {this.setState({groupName: textString})}}
                    />
                    <List.Accordion
                        title="List of members in group"
                        onPress={() => {LayoutAnimation.easeInEaseOut()}}
                    >
                        {this.renderListofMembers()}
                    </List.Accordion>
                    <CardSection>
                        <Button style={styles.leaveAndShareButtonStyle} onPress={() => {this.onLeaveGroupPressed(null)}}>
                            Leave Group
                        </Button>
                        <Button style={styles.leaveAndShareButtonStyle} icon={require('../icons/share-variant.png')} onPress={this.onSharePressed}>
                            Invite someone
                        </Button>
                    </CardSection>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <ScrollView>
                        <Card>
                            <Text style = {styles.groupHeadingStyle}>
                                {this.state.groupName}
                            </Text>
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
                                    onValueChange={async = () => {
                                        getDB({ data: {
                                            uid: this.state.uid,
                                            phoneNumber: this.state.phoneNumber,
                                            venmoUsername: this.state.venmoUsername
                                        }}, "editUser");
                                        if (this.state.groupid && this.state.groupid != '') {
                                            getDB({ data: {
                                                groupid: this.state.groupid,
                                                groupName: this.state.groupName,
                                            }}, "editGroup");
                                        }
                                        this.setState({edit: !this.state.edit})

                                    }}
                                />
                            </CardSection>
                            <View style={componentStyles.cardSectionWithBorderStyle}>
                                <Text style={styles.cardHeaderTextStyle}>PROFILE SETTINGS</Text>
                                <TextInput
                                    style={styles.textInputStyle}
                                    label='Name'
                                    mode='outlined'
                                    value={this.state.name}
                                    keyboardAppearance='dark'
                                    editable={false}
                                    onChangeText={textString => {}}
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
                                <CardSection>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        flex: 1,
                                        margin: 15,
                                        fontSize: 20,
                                        color: 'white',
                                        textAlign: 'left'
                                    }}>
                                        Out of house
                                    </Text>
                                    <Switch
                                        value={this.state.outOfHouse}
                                        style={{margin: 15}}
                                        onValueChange={() => {
                                            this.setState({outOfHouse: !this.state.outOfHouse})
                                        }}
                                    />
                                </CardSection>
                            </View>
                            {this.groupSectionVisibility()}
                            <Button 
                                style={styles.buttonContainedStyle} color={theme.buttonColor} 
                                mode='contained'
                                onPress={() => {this.signOut()}}
                            >
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
