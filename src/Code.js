if ((typeof moment)==='undefined') {
  let cs = CacheService.getScriptCache().get('momentjs');
  if(!cs){
    cs = UrlFetchApp.fetch('https://momentjs.com/downloads/moment.min.js').getContentText();
    CacheService.getScriptCache().put('momentjs', cs, 21600);
  }
  eval(cs);
}
moment.defaultFormat = 'YYYY-MM-DD';
Logger = BetterLog.useSpreadsheet('122yFYMbCo4Y9gb9AMqOfjRgDcfBNgueh4JHNAM6mUkM'); 
if (ScriptApp.getProjectTriggers().Length == 0) install();

function install() {
  ScriptApp.newTrigger('deleteMail').timeBased().everyDays(1).create();
}

function unInstall() {
  ScriptApp.getProjectTriggers().forEach( (trigger) => {
    ScriptApp.deleteTrigger(trigger);
  });
}
