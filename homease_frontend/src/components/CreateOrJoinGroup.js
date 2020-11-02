import React, {Component} from 'react';
import {Text, View} from 'react-native';
import paperTheme from './common/paperTheme';
import {Button, Provider as PaperProvider} from 'react-native-paper';
import theme from './common/theme';
import componentStyles from './common/componentStyles';
import {Card, CardSection} from "./common";


class CreateOrJoinGroup extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.props.navigation.setOptions({title: 'Join or Create Group'})
    }

    render(){
        return(
            <View style={{flexDirection: 'column' ,flex: 1, backgroundColor: theme.backgroundColor, justifyContent: 'center'}}>
                <PaperProvider theme={paperTheme}>
                    <View style={{flex: 0.33}}>
                    </View>
                    <View style={{flex: 0.33}}>
                        <Card>
                            <CardSection>
                                <Button
                                    color={theme.buttonColor}
                                    style={{...styles.buttonContainedStyle, margin: 0}}
                                    mode="contained"
                                    onPress={() => {
                                        this.props.navigation.navigate('CreateGroup')
                                    }}
                                >
                                    <Text style={componentStyles.bigButtonTextStyle}>
                                        Create a Group
                                    </Text>
                                </Button>
                            </CardSection>
                            <CardSection>
                                <Button
                                    color={theme.buttonColor}
                                    style={{...styles.buttonContainedStyle, margin: 0}}
                                    mode="contained"
                                    onPress={() => {
                                        this.props.navigation.navigate('JoinGroup')
                                    }}
                                >
                                    <Text style={componentStyles.bigButtonTextStyle}>
                                        Join a Group
                                    </Text>
                                </Button>
                            </CardSection>
                        </Card>
                    </View>
                    <View style={{flex: 0.33}}>
                    </View>
                </PaperProvider>
            </View>
        )
    }
}

const styles = {
    buttonContainedStyle: {
        height: 47,
        justifyContent: 'center',
        margin: 3,
        flex: 1,
    }
}

export default CreateOrJoinGroup;
