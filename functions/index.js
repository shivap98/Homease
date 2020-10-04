const functions = require('firebase-functions');
const firebase = require('firebase');
const api = require('./api.js');

firebase.initializeApp(api.data.firebaseConfig);
var db = firebase.database();

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
			data: "success"
		}
	})
});