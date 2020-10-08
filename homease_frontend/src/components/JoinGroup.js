import React, {Component} from 'react';
import {Text, View} from 'react-native';
import paperTheme from './common/paperTheme';
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';
import theme from './common/theme';
import componentStyles from './common/componentStyles';
import {Card, CardSection} from "./common";

class JoinGroup extends Component{
    constructor(props){
        super(props);
    }

    state = {groupId: '', groupCode: '', buttonEnabled: 'false'};

    onIdChange(textString){
        if(textString === '' || this.state.groupCode.length === 0){
            this.setState({groupId: textString, buttonEnabled: false})
        }
        else{
            this.setState({groupId: textString, buttonEnabled: true})
        }
    }

    onCodeChange(textString){
        if(textString === '' || this.state.groupId.length === 0){
            this.setState({groupCode: textString, buttonEnabled: false});
        }else{
            this.setState({groupCode: textString, buttonEnabled: true})
        }
    }

    onJoinPressed(){
        if(this.state.groupCode === ''){
            console.log("Group code empty");
        }else if(this.state.groupId === ''){
            console.log("Group ID empty");
        }else{
            console.log("Join pressed");
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
                    <View style={{flex: 0.33}}>
                    </View>
                    <View style={{flex: 0.33}}>
                        <Card>
                            <CardSection>
                                <TextInput
                                    style={styles.textInputStyle}
                                    label='Group ID'
                                    mode='outlined'
                                    value={this.state.groupId}
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
                    </View>
                    <View style={{flex: 0.33}}>
                    </View>
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
