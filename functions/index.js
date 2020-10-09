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

	if (data.uid == "" || data.uid == null) {
		return "fail"
	}

	var userRef = firebase.database().ref("users/" + data.uid + "/");
	
	return userRef.update({
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

	var groupid = data.groupName + "*" + num

	var groupRef = firebase.database().ref("groups/" + groupid + "/");

	var key = groupRef.push().getKey();

	return groupRef.set({

		groupName: data.groupName,
		groupCode: data.groupCode,

	}).then(() => {

		console.log("1")

		var userRef = firebase.database().ref("users/" + data.uid + "/");

		var usersInGroupRef = firebase.database().ref("groups/" + groupid + "/users/");

		return usersInGroupRef.push(data.uid).then((data) => {

			return ref.update({

				groupid: groupid

			}).then((data) => {

				return "success"

			}).catch((error) => {

				return "fail1"
			})

		}).catch((error) => {

			return "fail0"
		});

	}).catch((error) => {

		return "fail2"
	})
});

exports.joinGroup = functions.https.onCall((data, context) => {

	if (data.uid == "" || data.uid == null || data.groupid == "" || data.groupid == null ) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var ref = firebase.database().ref("groups/" + groupid + "/");

	return ref.once("value")
		.then(function (snapshot) {
			
			if(snapshot.val() != null) {

				return ref.update({

					users: [data.uid]

				}).then(() => {

					var ref = firebase.database().ref("users/" + data.uid + "/");

					return ref.update({

						groupid: groupid

					}).then((data) => {
						
						return "success"

					}).catch((error) => {
						
						return "fail1"
					})

				}).catch((error) => {

					return "fail2"
				})
			}
			else {
				return "group not found"
			}
		})
});
