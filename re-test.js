var request = require('./index.js');
var fs = require('fs');

new request()
	.get('http://ajax.googleapis.com/ajax/services/search/web')
	.expects(request.CONTENT_TYPE.JSON)
	.data({
		v: '1.0',
		q: 'test'
	})
	.send(function(data) {
		data.responseData.results.forEach(function(result) {
			console.log(result);
		});
	});
