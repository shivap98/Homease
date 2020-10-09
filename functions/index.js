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
	return data
});

exports.editUser = functions.https.onCall((data, context) => {

	var userRef = firebase.database().ref("users/" + data.userref + "/");
	
	return userRef.set({
		phoneNumber: data.phoneNumber,
		venmoUsername: data.venmoUsername,
	}).then((data) => {
		return "succes"
	}).catch((error) => {
		return "fail"
	})
});

exports.createUser = functions.https.onCall((data, context) => {

	if(data.uid == "" || data.uid == null) {
		return "fail"
	}

	var userRef = firebase.database().ref("users/" + data.uid + "/");

	return userRef.set({

		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		phoneNumber: data.phoneNumber,
		venmoUsername: data.phoneNumber,

	}).then((data) => {
		return "success"
	}).catch((error) => {
		return "fail"
	})
});

exports.getUser = functions.https.onCall((data, context) => {

	var ref = firebase.database().ref("users/" + data.uid);

	return ref.once("value")
		.then(function (snapshot) {
			return snapshot.val()
		})
});

exports.createGroup = functions.https.onCall((data, context) => {

	var num = Math.floor(Math.random() * 9000) + 1000;

	var groupRef = firebase.database().ref("groups/" + data.groupName + "*	" + num + "/");

	return groupRef.set({

		groupName: data.groupName,
		groupCode: data.groupCode,
		users: [data.uid]

	}).then((data) => {
		return "success"
	}).catch((error) => {
		return "fail"
	})
});