import api from './common/api';

export default getDB = async (tosend, fnname) => {

	try {
		let response = await fetch(api.backurl + fnname + '/', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(tosend)
		});
		let json = await response.json();
		
		return json;
	} catch (error) {
		console.error(error);
	}


}