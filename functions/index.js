const functions = require('firebase-functions');
const firebase = require('firebase');
const api = require('./api.js');

firebase.initializeApp(api.data.firebaseConfig);

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send({
	  result: "Hello from Firebase!"
  });
});

exports.yoyo = functions.https.onCall((data, context) => {
	return {
		data: data
	}
});

exports.dbtest = functions.https.onCall((data, context) => {

	var ref = firebase.database().ref("/");

	return ref.set({
		test: "heyo from the cloud",
	}).then((data) => {
		return {
			data: "success"
		}
	}).catch((error) => {
		return {
			data: "fail"
		}
	})
});

exports.editUser = functions.https.onCall((data, context) => {

	var userRef = firebase.database().ref("users/" + data.userref + "/");
	
	return userRef.set({
		phoneNumber: data.phoneNumber,
		venmoUsername: data.venmoUsername,
	}).then((data) => {
		return {
			data: "success"
		}
	}).catch((error) => {
		return {
			data: "fail"
		}
	})
});

exports.createUser = functions.https.onCall((data, context) => {

	var userRef = firebase.database().ref("users/" + data.uid + "/");

	return userRef.set({

		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		phoneNumber: data.phoneNumber,
		venmoUsername: data.phoneNumber,

	}).then((data) => {
		return {
			data: "success"
		}
	}).catch((error) => {
		return {
			data: "fail"
		}
	})
});

exports.getUser = functions.https.onCall((data, context) => {

	var ref = firebase.database().ref("users/" + data.uid);

	return ref.once("value")
		.then(function (snapshot) {
			return {
				data: snapshot.val()
			}
		})
});