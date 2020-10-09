import React, {Component} from 'react';
import {Alert, Text, View} from 'react-native';
import paperTheme from './common/paperTheme';
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';
import theme from './common/theme';
import componentStyles from './common/componentStyles';
import {Card, CardSection} from "./common";
import getDB from './Cloud';
import { StackActions } from '@react-navigation/native';

class JoinGroup extends Component{
    constructor(props){
        super(props);
    }

    state = {groupid: '', groupCode: '', buttonEnabled: false, uid: 'z5uYYzYSLCUOEiaN9t1nEYLMgTA2'};

    onIdChange(textString){
        if(textString === '' || this.state.groupCode.length === 0){
            this.setState({groupid: textString, buttonEnabled: false})
        }
        else{
            this.setState({groupid: textString, buttonEnabled: true})
        }
    }

    onCodeChange(textString){
        if(textString === '' || this.state.groupid.length === 0){
            this.setState({groupCode: textString, buttonEnabled: false});
        }else{
            this.setState({groupCode: textString, buttonEnabled: true})
        }
    }

    async onJoinPressed() {
        if (this.state.groupCode === '' || this.state.groupid === '') {
            // console.log("Group code empty");
            Alert.alert(
                'Oops!',
                'Check the Group Code and the Group ID!',
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
            // console.log("Join pressed");
            const {groupid, uid} = this.state;

            let resp = await getDB({data: this.state}, 'joinGroup');

            this.props.navigation.dispatch(
                StackActions.popToTop()
            );
            this.props.navigation.dispatch(
                StackActions.replace('Home', {screen: 'Account'})
            );
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

    render(){
        return (
            <View style={{flexDirection: 'column' ,flex: 1, backgroundColor: theme.backgroundColor, justifyContent: 'center'}}>
                <PaperProvider theme={paperTheme}>
                    <Card>
                        <CardSection>
                            <TextInput
                                style={styles.textInputStyle}
                                label='Group ID'
                                mode='outlined'
                                value={this.state.groupid}
                                onChangeText={(textString) => {
                                    // this.setState({groupId: textString})
                                    this.onIdChange(textString);
                                }}
                            />
                        </CardSection>
                        <CardSection>
                            <TextInput
                                style={styles.textInputStyle}
                                label='Group Code'
                                mode='outlined'
                                value={this.state.groupCode}
                                onChangeText={(textString) => {
                                    // this.setState({groupCode: textString})
                                    this.onCodeChange(textString);
                                }}
                            />
                        </CardSection>
                        <CardSection>
                            <Button
                                color={this.buttonColor()}
                                style={{...styles.buttonContainedStyle, margin: 0}}
                                mode="contained"
                                onPress={() => {
                                    {this.onJoinPressed()}
                                }}
                            >
                                <Text style={componentStyles.bigButtonTextStyle}>
                                    Join Group
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

export default JoinGroup;
