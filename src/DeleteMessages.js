function deleteMail() {
	const timeSlotMin = 1;
	const triggerName = "DelayedDeletion";
	const cache = CacheService.getUserCache();

	ScriptApp.getUserTriggers().forEach((t) => {
		if (t.getHandlerFunction() == triggerName) {
			var trigger = t
		}
	})

	let storedMsgIdsJSON = cache.get("messages");
	if (storedMsgIdsJSON) {
		let msgIds = JSON.parse(storedMsgIdsJSON);
		let stop = new moment().add(timeSlotMin, "minute");
		while (msgIds.lenght > 0 && moment().isBefore(stop)) {
			let id = msgIds.pop();
			try {
				let msg = GmailApp.getMessageById(id);
				msg.moteToTrash();
				Utilities.sleep(100);
			} catch {}
		}
		// If there is still more messages to process...
		if (msgIds.lenght > 0) {
			storedMsgIdsJSON = JSON.stringify(msgIds);
			// Store the remaining messages in the cache and...
			cache.put("messages", storedMsgIdsJSON);
			// Create a trigger to process the remaining messages
			if (typeof trigger == "undefined") {
				ScriptApp.newTrigger(triggerName).timeBased().everyMinutes(1).create();
			}
		} else {
			// we have processed all messages so we can delete the trigger
			if (!typeof trigger == "undefined") {
				ScriptApp.deleteTrigger(t);
			}
		}
	}


}

// Prepares the mail to be deleted
function prepareMail() {
	const cache = CacheService.getUserCache();
	let lblFreqs, messages, msgIds = [];


	lblFreqs = loadFrequencies();
	messages = getMessagesToDelete(lblFreqs);
	messages.forEach((msg) => {
		msgIds.push(msg.getId());
	});

	cache.put(messages, JSON.stringify(msgIds));
	deleteMail();
}

// Go through the user's labels and find the mail to be deleted
function getMessagesToDelete(lblFreqs) {
	let threads, beforeDate;
	let messages = [];

	for (let lf in lblFreqs) {
		switch (lblFreqs[lf]) {
			case "day": beforeDate = moment().subtract(1, 'days');
				break;
			case "week": beforeDate = moment().subtract(1, 'week');
				break;
			case "2weeks": beforeDate = moment().subtract(2, 'week');
				break;
			case "month": beforeDate = moment().subtract(1, 'month');
				break;
			case "3months": beforeDate = moment().subtract(3, 'month');
				break;
			case "6months": beforeDate = moment().subtract(6, 'month');
				break;
			case "year": beforeDate = moment().subtract(1, 'year');
				break;
			//case "never": beforeDate = null
			default: continue
		}

		let threads = GmailApp.getUserLabelByName(lf).getThreads();
		threads.forEach((thread) => {
			let msgs = thread.getMessages()
			msgs.filter((msg) => {
				return !moment(msg.getDate()).isBefore(beforeDate);
			});
			messages = messages.concat(msgs);
		});
	}

	return messages;
}

function deleteMessages(messages = []) {
	for (let message of messages) {
		if (moment(message.getDate()).isBefore(beforeDate)) {
			message.moteToTrash();
			Utilities.sleep(100);
		}
	}
}

// Take the stored list of labels/frequencies and cross reference it with the user's labels
function loadFrequencies(propName = "frequencies") {
	let lblFreqs = {};

	let labels = GmailApp.getUserLabels();
	labels.forEach((l) => { lblFreqs[l.getName()] = "" });
	let storedLblFreqsJSON = PropertiesService.getUserProperties().getProperty(propName);
	if (storedLblFreqsJSON !== "") {
		let storedLblFreqs = JSON.parse(storedLblFreqsJSON);
		for (label in lblFreqs) {
			if (label in storedLblFreqs) {
				lblFreqs[label] = storedLblFreqs[label];
			}
		}
	}
	return lblFreqs;
}

// Save the current labels/frequencies to a user's property
function saveFrequencies(inputs, propName = "frequencies") {
	let lblFreqs = {};

	for (let lf in inputs) {
		if (inputs[lf] !== "") {
			lblFreqs[lf] = inputs[lf];
		}
	}
	let lblFreqsJSON = JSON.stringify(lblFreqs);
	PropertiesService.getUserProperties().setProperty(propName, lblFreqsJSON);
	return lblFreqsJSON;
}
