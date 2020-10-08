import React, {Component} from 'react';
import {Text, View} from 'react-native';
import paperTheme from './common/paperTheme';
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';
import theme from './common/theme';
import componentStyles from './common/componentStyles';
import {Card, CardSection} from "./common";

class CreateGroup extends Component{
    constructor(props){
        super(props);
    }

    state={groupName: '', groupCode: '', verifyGroupCode: '', buttonEnabled: 'false'};

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

    onCreatePressed(){
        if(this.state.groupCode !== this.state.verifyGroupCode){
            console.log("Group code not verified correctly");
        }else if(this.state.groupName === ''){
            console.log("Group name is empty");
        }else{
            console.log("Create pressed");
        }
    }

    render(){
        return (
            <View style={{flexDirection: 'column' ,flex: 1, backgroundColor: theme.backgroundColor, justifyContent: 'center'}}>
                <PaperProvider theme={paperTheme}>
                    <View style={{flex: 0.25}}>
                    </View>
                    <View style={{flex: 0.33}}>
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

export default CreateGroup;
