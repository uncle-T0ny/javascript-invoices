var fs = require('fs');
var babelrc = fs.readFileSync('./.babelrc');

var config;

try {
	config = JSON.parse(babelrc);
} catch (err) {
	console.error('==>     ERROR: Can\'t parse tou .babelrc.');
	console.error(err);
}

require('babel-core/register')(config);
require('../app');