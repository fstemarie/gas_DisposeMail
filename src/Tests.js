function testsRunner() {
	test('saveFrequencies', (t) => {
		let data = `
			{
				"Bibliotheque": "year",
				"Factures": "year",
				"Promotions": "year",
				"Promotions/Banggood.com": "year",
				"Promotions/Canadian Tire": "year",
				"Promotions/Free Games": "year",
				"Promotions/GOG.com": "year",
				"Promotions/Humble Bundle": "year",
				"Promotions/Instructables": "year",
				"Promotions/Newark": "year",
				"Promotions/Seeed Studios": "year",
				"Security": "year"
			}`
		let parsedData = JSON.parse(data);
		data = JSON.stringify(parsedData);
		PropertiesService.getUserProperties().deleteProperty("test");
		saveFrequencies(parsedData, "test");
		let results = PropertiesService.getUserProperties().getProperty("test");
		PropertiesService.getUserProperties().deleteProperty("test");
		t.equal(results, data, "Label-Frequencies stored correctly")
	})

	test('loadFrequencies', (t) => {
		let dataJSON = `
		{
			"Bibliotheque": "year",
			"Factures": "year",
			"Promotions": "year",
			"Promotions/Banggood.com": "year",
			"Promotions/Canadian Tire": "year",
			"Promotions/Free Games": "year",
			"Promotions/GOG.com": "year",
			"Promotions/Humble Bundle": "year",
			"Promotions/Instructables": "year",
			"Promotions/Newark": "year",
			"Promotions/Seeed Studios": "year",
			"Security": "year"
		}`
		let data = JSON.parse(dataJSON);
		PropertiesService.getUserProperties().setProperty("test", dataJSON);
		let results = loadFrequencies("test");
		t.deepEqual(results, data, "Label-Frequencies loaded correctly")
	})

	test.finish()
}
