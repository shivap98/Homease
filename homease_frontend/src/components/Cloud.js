import api from './common/api';

export default sendUserToDB = async (tosend) => {

	try {
		let response = await fetch(api.backurl + 'createUser/', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(tosend)
		});
		let json = await response.json();
		console.log(json);
	} catch (error) {
		console.error(error);
	}
}