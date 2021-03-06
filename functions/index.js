const functions = require('firebase-functions');
const firebase = require('firebase');
const api = require('./api.js');

firebase.initializeApp(api.data.firebaseConfig);

exports.helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", { structuredData: true });
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
		outOfHouse: data.outOfHouse
	}).then((data) => {
		return "success"
	}).catch((error) => {
		return "fail"
	})
});

exports.createUser = functions.https.onCall((data, context) => {

	if (data.uid == "" || data.uid == null) {
		return "fail"
	}

	var userRef = firebase.database().ref("users/" + data.uid + "/");

	return userRef.set({

		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		phoneNumber: data.phoneNumber,
		venmoUsername: data.venmoUsername,
		admin: false,
		outOfHouse: false

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

	if (data.uid == "" || data.uid == null || data.groupid == "" || data.groupid == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var ref = firebase.database().ref("groups/" + groupid + "/");

	return ref.once("value")
		.then(function (snapshot) {

			var usersInGroupRef = firebase.database().ref("groups/" + groupid + "/users/");

			if (snapshot.val() != null) {

				if (snapshot.val().groupCode != data.groupCode) {
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

	if (data.uid == "" || data.uid == null || data.groupid == "" || data.groupid == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var usersInGroupRef = firebase.database().ref("groups/" + groupid + "/users/");

	return usersInGroupRef.once("value")
		.then(function (snapshot) {


			if (snapshot.val() != null) {

				for (entry in snapshot.val()) {
					var userID = snapshot.val()[ entry ];

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
		return "success"
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
		lastDonePhoto: "",
		reminderActive: data.reminderActive,
		isChore: data.isChore,
		timestamp: data.timestamp
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

exports.deleteChore = functions.https.onCall((data, context) => {

	if (data.groupid == "" || data.groupid == null || data.choreid == "" || data.choreid == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var groupref = firebase.database().ref("groups/" + groupid + "/");

	return groupref.once("value")
		.then(function (snapshot) {

			var choreRef = firebase.database().ref("groups/" + groupid + "/chores/" + data.choreid);

			if (snapshot.val() != null) {

				return choreRef.remove().then(() => {

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

exports.makeAdmin = functions.https.onCall((data, context) => {

	if (data.uid == "" || data.uid == null) {
		return "fail"
	}

	var userRef = firebase.database().ref("users/" + data.uid + "/");

	return userRef.update({
		admin: true,
	}).then((data) => {
		return "success"
	}).catch((error) => {
		return "fail"
	})
});

exports.removeAdmin = functions.https.onCall((data, context) => {

	if (data.uid == "" || data.uid == null) {
		return "fail"
	}

	var userRef = firebase.database().ref("users/" + data.uid + "/");

	return userRef.update({
		admin: false,
	}).then((data) => {
		return "success"
	}).catch((error) => {
		return "fail"
	})
});

exports.addItemOnSharedList = functions.https.onCall((data, context) => {

	if (data.groupid == "" || data.groupid == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var groupref = firebase.database().ref("groups/" + groupid + "/sharedList/");

	var newGroupRef = groupref.push();
	var newID = newGroupRef.key

	var groupref1 = firebase.database().ref("groups/" + groupid + "/sharedList/" + newID +"/");

	return groupref1.set({...data.item, id: newID})
});

exports.editSharedList = functions.https.onCall((data, context) => {

	if (data.groupid == "" || data.groupid == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var groupref = firebase.database().ref("groups/" + groupid + "/sharedList/" + data.item.id +"/");
	
	if(data.item.delete){
		return groupref.set({})
	}
	else {
		return groupref.update(data.item)
	}
});

exports.getSharedList = functions.https.onCall((data, context) => {

	if (data.groupid == "" || data.groupid == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var groupref = firebase.database().ref("groups/" + groupid + "/");

	return groupref.once("value")
		.then(function (snapshot) {

			var listRef = firebase.database().ref("groups/" + groupid + "/sharedList/");

			return listRef.once("value")
				.then(function (snapshot) {

					return snapshot.val()

				}).catch((error) => {

					return "fail2"
				})

		}).catch((error) => {

			return "fail3"
		})
});

exports.addExpense = functions.https.onCall((data, context) => {

	if (data.groupid == "" || data.groupid == null 
		|| data.expense == "" || data.expense == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var groupref = firebase.database().ref("groups/" + groupid + "/");

	return groupref.once("value").then(function (snapshot) {

		// if(snapshot.val() == null) {
		// 	return "Group not found"
		// }

		var expensesRef = firebase.database().ref("groups/" + groupid + "/expenses/");

		return expensesRef.push(data.expense).then(() => {
			
			var balancesRef = firebase.database().ref("groups/" + groupid + "/balances/");

			splitCost = data.expense.amount/data.expense.split.length
			splitCost = parseFloat(splitCost.toFixed(2))

			return balancesRef.once("value").then(function (balances) {
			
				balances = balances.val()
				
				if(balances != null && balances.balances != null) {

					balances = balances.balances
				}

				data.expense.split.forEach((user) => {

					if (user != data.expense.uid) {

						user_owes_uid = user + "-" + data.expense.uid
						uid_owes_user = data.expense.uid + "-" + user

						if (balances != null) {
							balancesRef.update({
								
								[ user_owes_uid ]: (balances[ user_owes_uid ] ? 
									balances[ user_owes_uid ] : 0.0) + splitCost,
								
								[ uid_owes_user ]: (balances[ uid_owes_user ] ? 
									balances[ uid_owes_user ] : 0.0) - splitCost
							})
						}

						else {
							balancesRef.update({
								[ user_owes_uid ]: 0.0 + splitCost,

								[ uid_owes_user ]: 0.0 - splitCost
							})
						}
					}
				});

				return "success"
			})

		}).catch((error) => {
			return "fail2"
		})

	}).catch((error) => {
		return "fail3"
	})
});

exports.deleteExpense = functions.https.onCall((data, context) => {

	if (data.groupid == "" || data.groupid == null
		|| data.expenseid == "" || data.expenseid == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var groupref = firebase.database().ref("groups/" + groupid + "/");

	return groupref.once("value").then(function (snapshot) {

		if(snapshot.val() == null) {
			return "Group not found"
		}

		var expenseRef = firebase.database().ref("groups/" + groupid + "/expenses/" + data.expenseid);

		return expenseRef.once("value").then(function (snapshot) {

			if (snapshot.val() == null) {
				return "Expense not found"
			}

			var balancesRef = firebase.database().ref("groups/" + groupid + "/balances/");

			expense = snapshot.val()

			splitCost = expense.amount / expense.split.length
			splitCost = parseFloat(splitCost.toFixed(2))

			return balancesRef.once("value").then(function (balances) {

				balances = balances.val()

				if (balances != null && balances.balances != null) {

					balances = balances.balances
				}

				expense.split.forEach((user) => {

					if (user != expense.uid) {

						user_owes_uid = user + "-" + expense.uid
						uid_owes_user = expense.uid + "-" + user

						if (balances != null) {
							balancesRef.update({

								[ user_owes_uid ]: (balances[ user_owes_uid ] ?
									balances[ user_owes_uid ] : 0.0) - splitCost,

								[ uid_owes_user ]: (balances[ uid_owes_user ] ?
									balances[ uid_owes_user ] : 0.0) + splitCost
							})
						}

						else {
							balancesRef.update({
								[ user_owes_uid ]: 0.0 - splitCost,

								[ uid_owes_user ]: 0.0 + splitCost
							})
						}
					}
				});

				return expenseRef.remove().then(() => {

					return "success"

				}).catch((error) => {

					console.log(error)
					return "fail1"
				})
			})

		}).catch((error) => {

			console.log(error)
			return "fail2"
		})

	}).catch((error) => {

		console.lothtndfvdvfvdvvdvvg(error)
		return "fail3"
	})
});

exports.getExpensesByGroupID = functions.https.onCall((data, context) => {

	if (data.groupid == "" || data.groupid == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var groupref = firebase.database().ref("groups/" + groupid + "/");

	return groupref.once("value")
		.then(function (snapshot) {

			if (snapshot.val() == null) {
				return "Group not found"
			}

			var expensesRef = firebase.database().ref("groups/" + groupid + "/expenses/");

			return expensesRef.once("value")
				.then(function (snapshot) {

					return snapshot.val()

				}).catch((error) => {

					return "fail2"
				})

		}).catch((error) => {

			return "fail3"
		})
});

exports.getBalancesByGroupID = functions.https.onCall((data, context) => {

	if (data.groupid == "" || data.groupid == null) {
		return "fail"
	}

	var groupid = data.groupid.replace("#", "*");
	var groupref = firebase.database().ref("groups/" + groupid + "/");

	return groupref.once("value")
		.then(function (snapshot) {

			if (snapshot.val() == null) {
				return "Group not found"
			}

			var balancesRef = firebase.database().ref("groups/" + groupid + "/balances/");

			return balancesRef.once("value")
				.then(function (snapshot) {

					return snapshot.val()

				}).catch((error) => {

					return "fail2"
				})

		}).catch((error) => {

			return "fail3"
		})
});