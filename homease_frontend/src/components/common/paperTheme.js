import {DefaultTheme} from 'react-native-paper';
import theme from './theme';

export default {
	...DefaultTheme,
	roundness: 4,
	colors: {
			primary: '#1eaaf1',
			accent: '#005cf1',
			background: theme.backgroundColor,
			surface: theme.backgroundColor,
			error: '#B00020',
			text: '#000000',
			disabled: '#000000',
			placeholder: '#1eaaf1',
			backdrop: '#d20022',
			notification: '#e46eef',
	},
}