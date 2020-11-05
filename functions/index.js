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
		venmoUsername: data.venmoUsername,
		admin: false

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

	return groupRef.set({

		groupName: data.groupName,
		groupCode: data.groupCode,

	}).then(() => {

		var userRef = firebase.database().ref("users/" + data.uid + "/");

		var usersInGroupRef = firebase.database().ref("groups/" + groupid + "/users/");

		return usersInGroupRef.push(data.uid).then((data) => {

			return userRef.update({

				groupid: groupid,
				admin: true

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
			
			var usersInGroupRef = firebase.database().ref("groups/" + groupid + "/users/");

			if(snapshot.val() != null) {

				if(snapshot.val().groupCode != data.groupCode) {
					return "wrong group code";
				}

				return usersInGroupRef.push(data.uid).then(() => {

					var ref = firebase.database().ref("users/" + data.uid + "/");

					return ref.update({

						groupid: groupid,
						admin: false

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

exports.leaveGroup = functions.https.onCall((data, context) => {

	if (data.uid == "" || data.uid == null || data.groupid == "" || data.groupid == null ) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var usersInGroupRef = firebase.database().ref("groups/" + groupid + "/users/");

	return usersInGroupRef.once("value")
		.then(function (snapshot) {
			

			if(snapshot.val() != null) {

				for (entry in snapshot.val()) {
					var userID = snapshot.val()[entry];

					if (userID == data.uid) {
						usersInGroupRef.child(entry).remove();

						var ref = firebase.database().ref("users/" + data.uid + "/");

						return ref.update({

							groupid: {}

						}).then((data) => {
							
							return "success"

						}).catch((error) => {
							
							return "fail1"
						})
					}
				}

				return "user was not in the group"
			}
			else {
				return "group not found"
			}
		})
});

exports.getGroupFromGroupID = functions.https.onCall((data, context) => {

	if (data.groupid == "") {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var ref = firebase.database().ref("groups/" + groupid);

	return ref.once("value")
		.then(function (snapshot) {
			return snapshot.val()
		})
});

exports.editGroup = functions.https.onCall((data, context) => {

	if (data.groupid == "") {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var ref = firebase.database().ref("groups/" + groupid);

	return ref.update({
		groupName: data.groupName,
	}).then((data) => {
		return "succes"
	}).catch((error) => {
		return "fail"
	})
});

exports.createChore = functions.https.onCall((data, context) => {

	if (data.groupid == "" || data.groupid == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var groupref = firebase.database().ref("groups/" + groupid + "/");

	var currChore = {
		choreName: data.choreName,
		selectedUsers: data.selectedUsers,
		recursiveChore: data.recursiveChore,
		description: data.description,
		currentUser: data.currentUser,
		status: data.status,
		lastDoneDate: "",
		lastDoneBy: "",
		lastDonePhoto: ""
	}

	return groupref.once("value")
		.then(function (snapshot) {

			var choresRef = firebase.database().ref("groups/" + groupid + "/chores/");

			if (snapshot.val() != null) {

				return choresRef.push(currChore).then(() => {

					return "success"

				}).catch((error) => {

					return "fail2"
				})
				
			}
			else {
				return "group not found"
			}
		}).catch((error) => {

			return "fail3"
		})
});

exports.getChoresByGroupID = functions.https.onCall((data, context) => {

	if (data.groupid == "" || data.groupid == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var groupref = firebase.database().ref("groups/" + groupid + "/");

	return groupref.once("value")
		.then(function (snapshot) {

			var choresRef = firebase.database().ref("groups/" + groupid + "/chores/");

			return choresRef.once("value")
				.then(function (snapshot) {

					return snapshot.val()

				}).catch((error) => {

					return "fail2"
				})

		}).catch((error) => {

			return "fail3"
		})
});

exports.editChore = functions.https.onCall((data, context) => {

	if (data.groupid == "" || data.groupid == null || data.choreid == "" || data.choreid == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var groupref = firebase.database().ref("groups/" + groupid + "/");

	var currChore = data.chore

	return groupref.once("value")
		.then(function (snapshot) {

			var choreRef = firebase.database().ref("groups/" + groupid + "/chores/" + data.choreid);

			if (snapshot.val() != null) {

				return choreRef.set(data.chore).then(() => {

					return "success"

				}).catch((error) => {

					return "fail2"
				})

			}
			else {
				return "group not found"
			}
		}).catch((error) => {

			return "fail3"
		})
});

exports.getChoreByID = functions.https.onCall((data, context) => {

	if (data.groupid == "" || data.groupid == null || data.choreid == "" || data.choreid == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var groupref = firebase.database().ref("groups/" + groupid + "/");

	return groupref.once("value")
		.then(function (snapshot) {

			var choreRef = firebase.database().ref("groups/" + groupid + "/chores/" + data.choreid);

			return choreRef.once("value")
				.then(function (snapshot) {

					return snapshot.val()

				}).catch((error) => {

					return "fail2"
				})

		}).catch((error) => {

			return "fail3"
		})
});