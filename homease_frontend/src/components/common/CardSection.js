import React from 'react';
import  {View} from 'react-native';
import theme from './theme';


const CardSection = (props) => {
    return (
        <View style = {styles.containerStyle}>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        borderBottomWidth: 0,
        padding: 10,
        backgroundColor: theme.backgroundColor,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
        position: 'relative'
    }
};

export { CardSection };