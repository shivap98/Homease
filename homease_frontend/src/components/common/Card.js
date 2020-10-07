import React from 'react';

import {View} from 'react-native';

const Card = (props) => {
    // const {containerStyle} = styles;
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle:{
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
    }
};

export { Card };
