function testsRunner() {
    test('saveFrequencies', (t) => {
        let data = '{"Promotions/Seeed Studios":"day","People/Ariel Henry":"day","Promotions/GOG.com":"day","Factures":"day","Promotions/Free Games":"day","People/Lucie Boulanger":"day","Promotions/Banggood.com":"day","Bibliotheque":"day","Security": "day","Promotions/Humble Bundle":"day","Promotions":"day","Promotions/Instructables":"day","Promotions/Canadian Tire":"day","Promotions/Newark":"day","People":"day"}'
        let parsedData = JSON.parse(data);
        data = JSON.stringify(parsedData);
        PropertiesService.getUserProperties().deleteProperty("test");
        saveFrequencies(parsedData, "test");
        let results = PropertiesService.getUserProperties().getProperty("test");
        PropertiesService.getUserProperties().deleteProperty("test");
        t.equal(results, data, "Label-Frequencies stored correctly")
    })
  
    test('loadFrequencies', (t) => {
        let dataJSON = '{"Bibliotheque":"year","Promotions/Instructables":"year","Promotions":"year","Promotions/Newark":"year","Promotions/Canadian Tire":"year","Promotions/GOG.com":"year","People":"year","People/Ariel Henry":"year","Promotions/Free Games":"year","Factures":"year","Security":"year","People/Lucie Boulanger":"year","Promotions/Seeed Studios":"year","Promotions/Banggood.com":"year","Promotions/Humble Bundle":"year"}';
        let data = JSON.parse(dataJSON);
        PropertiesService.getUserProperties().setProperty("test", dataJSON);
        let results = loadFrequencies("test");
        t.deepEqual(results, data, "Label-Frequencies loaded correctly")
    })
  
    test.finish() 
}
