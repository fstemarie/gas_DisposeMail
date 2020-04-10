//Event as defined in the Manifest
function onGmailHomepage() {
    return createHomepageCard();
}

//Event as defined in the Manifest
function onGmailMessage() {
    alert("onGmailMessage");
}

//Event as defined in the Manifest
function onGmailCompose() {
    alert("onGmailCompose");
}

function onChange(e) {
    saveFrequencies(e.formInput);
}

function onClickRun(e) {
    let lblFreqs = loadFrequencies();
    deleteMail(e);
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
                .addItem("Never", "never", lblFreqs[lf] == "never")
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
    // Create a footer to be shown at the bottom.
    let footer = CardService.newFixedFooter()
        .setPrimaryButton(
            CardService.newTextButton()
                .setText('Run')
                .setOnClickAction(CardService.newAction().setFunctionName('onClickRun'))
                .setDisabled(false)
        )
    let card = CardService.newCardBuilder().addSection(section).setFixedFooter(footer);
    return card.build();
}

function loadFrequencies(propName="frequencies") {
    let lblFreqs = {};

    let labels = GmailApp.getUserLabels();
    labels.forEach((l) => {lblFreqs[l.getName()] = null});
    let lblFreqsJSON = PropertiesService.getUserProperties().getProperty(propName);
    if (lblFreqsJSON != null) {
        let lfcnf = JSON.parse(lblFreqsJSON);
        for (let lf in lblFreqs) {
            lblFreqs[lf] = lfcnf[lf] || "never";
        }
    }
    return lblFreqs;
}

function saveFrequencies(inputs, propName="frequencies") {
    let lblFreqs = {};

    for (let lf in inputs) {
        lblFreqs[lf] = inputs[lf];
    }
    let lblFreqsJSON = JSON.stringify(lblFreqs);
    PropertiesService.getUserProperties().setProperty(propName, lblFreqsJSON);
    return lblFreqsJSON;
}
