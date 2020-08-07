if ((typeof moment) === 'undefined') {
	let cs = CacheService.getScriptCache().get('momentjs');
	if (!cs) {
		cs = UrlFetchApp.fetch('https://momentjs.com/downloads/moment.min.js').getContentText();
		CacheService.getScriptCache().put('momentjs', cs, 21600);
	}
	eval(cs);
}
moment.defaultFormat = 'YYYY-MM-DD';
