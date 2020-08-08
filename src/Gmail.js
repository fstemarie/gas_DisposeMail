//Event as defined in the Manifest
function onGmailHomepage() {
	return createHomepageCard();
}

//Event as defined in the Manifest
function onGmailMessage() {
	Logger.log("onGmailMessage");
}

//Event as defined in the Manifest
function onGmailCompose() {
	Logger.log("onGmailCompose");
}

function onChange(e) {
	saveFrequencies(e.formInput);
}

function onClickRun(e) {
	let lblFreqs = loadFrequencies();
	deleteMail();
	var actionResponse = CardService.newActionResponseBuilder()
		.setNotification(CardService.newNotification()
			.setText("Deleted old eMails"))
		.build();
	return actionResponse;
}

function createHomepageCard() {
	let lblFreqs = loadFrequencies();

	let section = CardService.newCardSection();
	for (let lf in lblFreqs) {
		section.addWidget(
			CardService.newSelectionInput()
				.setType(CardService.SelectionInputType.DROPDOWN)
				.setTitle(lf)
				.setFieldName(lf)
				.addItem("", "", lblFreqs[lf] == "")
				.addItem("1 day", "day", lblFreqs[lf] == "day")
				.addItem("1 week", "week", lblFreqs[lf] == "week")
				.addItem("2 weeks", "2weeks", lblFreqs[lf] == "2weeks")
				.addItem("1 month", "month", lblFreqs[lf] == "month")
				.addItem("3 months", "3months", lblFreqs[lf] == "3months")
				.addItem("6 months", "6months", lblFreqs[lf] == "6months")
				.addItem("1 year", "year", lblFreqs[lf] == "year")
				.setOnChangeAction(CardService.newAction().setFunctionName('onChange'))
		)
	}
	// Create a footer with a button to be shown at the bottom.
	let footer = CardService.newFixedFooter()
		.setPrimaryButton(
			CardService.newTextButton()
				.setText('Run')
				.setOnClickAction(CardService.newAction().setFunctionName('onClickRun'))
				.setDisabled(false)
		)
	let card = CardService.newCardBuilder().addSection(section) //.setFixedFooter(footer);
	return card.build();
}
