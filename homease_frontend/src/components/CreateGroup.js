import React, {Component} from 'react';
import {Alert, Text, View} from 'react-native';
import paperTheme from './common/paperTheme';
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';
import theme from './common/theme';
import componentStyles from './common/componentStyles';
import {Card, CardSection} from "./common";
import getDB from './Cloud';
import { StackActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firebase from 'firebase';

class CreateGroup extends Component{
    constructor(props){
        super(props);
    }

    state = {
        groupName: '', 
        groupCode: '', 
        verifyGroupCode: '', 
        buttonEnabled: false, 
        uid: ''
    };

    componentDidMount() {
        var uid = null
        if (auth().currentUser) {
            uid = auth().currentUser.uid
            this.setState({uid: auth().currentUser.uid})
        } else {
            uid = firebase.auth().currentUser.uid
            this.setState({uid: firebase.auth().currentUser.uid})
        }
    }

    onNameChange(textString){
        if(textString === '' || this.state.groupCode !== this.state.verifyGroupCode || this.state.groupCode.length === 0){
            this.setState({groupName: textString, buttonEnabled: false})
        }
        else{
            this.setState({groupName: textString, buttonEnabled: true})
        }
    }

    onCodeChange(textString){
        if(textString !== this.state.verifyGroupCode || this.state.groupName.length === 0 || this.state.verifyGroupCode.length === 0){
            this.setState({groupCode: textString, buttonEnabled: false});
        }else{
            this.setState({groupCode: textString, buttonEnabled: true})
        }
    }

    onVerifyCodeChange(textString){
        if(textString !== this.state.groupCode || this.state.groupName.length === 0 || this.state.groupCode.length === 0){
            this.setState({verifyGroupCode: textString, buttonEnabled: false});
        }else{
            this.setState({verifyGroupCode: textString, buttonEnabled: true})
        }
    }

    themeButtonColor = theme.buttonColor;

    buttonColor(){
        if(this.state.buttonEnabled === true){
            return this.themeButtonColor;
        }else{
            return 'grey';
        }
    }

    async onCreatePressed() {
        if (this.state.groupCode !== this.state.verifyGroupCode || this.state.groupName === '') {
            console.log("Group code not verified correctly");
            Alert.alert(
                'Oops!',
                'Check the Group Name and verify the Group Code!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                        },
                        style: 'cancel',
                    },

                ],
                {cancelable: false},
            );
            return;
        } else {
            console.log("Create pressed");
            const {groupName, groupCode, uid} = this.state;

            let resp = await getDB({data: this.state}, 'createGroup')

            this.props.navigation.dispatch(
                StackActions.popToTop()
            );
            this.props.navigation.dispatch(
                StackActions.replace('Home', {screen: 'Account'})
            );
        }
    }

    render(){
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <PaperProvider theme={paperTheme}>
                    <Card>
                        <CardSection>
                            <TextInput
                                style={styles.textInputStyle}
                                label='Group Name'
                                mode='outlined'
                                value={this.state.groupName}
                                onChangeText={(textString) => {
                                    // this.setState({groupName: textString});
                                    this.onNameChange(textString);
                                }}
                            />
                        </CardSection>
                        <CardSection>
                            <TextInput
                                style={styles.textInputStyle}
                                label='Group Code'
                                mode='outlined'
                                value={this.state.groupCode}
                                onChangeText={
                                    (textString) => {
                                        // this.setState({groupCode: textString});
                                        this.onCodeChange(textString);
                                    }
                                }
                            />
                        </CardSection>
                        <CardSection>
                            <TextInput
                                style={styles.textInputStyle}
                                label='Verify Group Code'
                                mode='outlined'
                                value={this.state.verifyGroupCode}
                                onChangeText={
                                    (textString) => {
                                        // this.setState({verifyGroupCode: textString});
                                        this.onVerifyCodeChange(textString);
                                    }
                                }
                            />
                        </CardSection>
                        <CardSection>
                            <Button
                                color={this.buttonColor()}
                                style={{...styles.buttonContainedStyle, margin: 0}}
                                mode="contained"
                                onPress={() => {
                                    {this.onCreatePressed()}
                                }}
                            >
                                <Text style={componentStyles.bigButtonTextStyle}>
                                    Create Group
                                </Text>
                            </Button>
                        </CardSection>
                    </Card>
                </PaperProvider>
            </View>
        );
    }
}

const styles = {
    buttonContainedStyle: {
        height: 47,
        justifyContent: 'center',
        margin: 3,
        flex: 1,
    },
    textInputStyle: {
        flex: 1,
    }
}

export default CreateGroup;
