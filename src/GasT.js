// Loads the GasT testing framework
// https://github.com/huan/gast

if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
	let cs = CacheService.getScriptCache().get('gast');
	if (!cs) {
		cs = UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText();
		CacheService.getScriptCache().put('gast', cs, 21600);
	}
	eval(cs);
} // Class GasTap is ready for use now!

var test = new GasTap();