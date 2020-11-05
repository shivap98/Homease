import {DefaultTheme} from 'react-native-paper';
import theme from './theme';

export default {
	...DefaultTheme,
	roundness: 4,
	colors: {
			primary: theme.lightColor,
			accent: '#005cf1',
			background: theme.backgroundColor,
			surface: theme.backgroundColor,
			error: '#B00020',
			text: theme.lightColor,
			disabled: '#000000',
			placeholder: theme.lightColor,
			backdrop: '#ffffff00',//'#d20022',
			notification: '#e46eef',
	},
}
