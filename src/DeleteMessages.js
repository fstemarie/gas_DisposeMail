// Prepare the mail to be deleted
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

function deleteMail() {
	const cache = CacheService.getUserCache();
	let storedMsgIdsJSON = cache.get("messages");
	let stop = new moment().add(1, "minute");

	if (storedMsgIdsJSON) {
		let msgIds = JSON.parse(storedMsgIdsJSON);
		while (msgIds.lenght > 0 && moment().isBefore(stop)) {
			let id = msgIds.pop();
			try {
				let msg = GmailApp.getMessageById(id);
			} catch {
				continue;
			}
			msg.moteToTrash();
			Utilities.sleep(100);
		}
		storedMsgIdsJSON = JSON.stringify(msgIds);
		cache.put("messages", storedMsgIdsJSON);
	}


}

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
