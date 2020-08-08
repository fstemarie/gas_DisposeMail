//Logger = BetterLog.useSpreadsheet('122yFYMbCo4Y9gb9AMqOfjRgDcfBNgueh4JHNAM6mUkM'); 
if (ScriptApp.getProjectTriggers().Length == 0) install();

function install() {
	ScriptApp.newTrigger('deleteMail').timeBased().everyDays(1).create();
}

function unInstall() {
	ScriptApp.getProjectTriggers().forEach((trigger) => {
		ScriptApp.deleteTrigger(trigger);
	});
}

function deleteMail_tt() {
	deleteMail();
}