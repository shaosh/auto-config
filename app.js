var jsonfile = require('jsonfile')
	, fs = require('fs');

if(process.argv.length < 6 || process.argv.length > 8){
	console.error('Autoconfig Error: Wrong argv number');
	return;
}

var auth_service = process.argv[2] || 'ptc'
	, username = process.argv[3] || ''
	, password = process.argv[4] || ''	
	, gmapkey = process.argv[5] || ''
	, location = process.argv[6] || 'New York, Times Square'
	, walk = process.argv[7] || 2;

var config1 = '../PokemonGo-Bot/configs/config.json'
	, config2 = '../PokemonGo-Bot/config.json';

var obj = null;
var item_filter = {
	"1": { "keep" : 100 },
	"101": { "keep" : 10 },
	"102": { "keep" : 30 },
	"103": { "keep" : 30 },
	"201": { "keep" : 30 },
	"701": { "keep" : 100 }
};

var main = function(){
	if(fileExists(config1)){
		jsonfile.readFile(config1, function(err, config){
			callback(err, config, config1);
		});
	}
	else if(fileExists(config2)){
		jsonfile.readFile(config2, function(err, config){
			callback(err, config, config2);
		});
	}
	else{
		console.error('Autoconfig Error: Config file does not exist');
		return;
	}
};

var callback = function(err, config, file){
	if(err){
		console.error('Autoconfig Error: Readjson error', err);
		return;
	}
	
	if(!config){
		console.error('Autoconfig Error: Empty config');
		return;
	}
	else if(typeof config !== 'object'){
		console.error('Autoconfig Error: Non-json config', typeof config);
		return;
	}
	else{
		if(config.hasOwnProperty('auth_service') && auth_service){
			config.auth_service = auth_service;
		}
		else if(auth_service){
			console.error('Autoconfig Error: auth_service field does not exist');
			return;
		}

		if(config.hasOwnProperty('username')){
			config.username = username;
		}
		else{
			console.error('Autoconfig Error: username field does not exist');
			return;
		}

		if(config.hasOwnProperty('password')){
			config.password = password;
		}
		else{
			console.error('Autoconfig Error: password field does not exist');
			return;
		}

		if(config.hasOwnProperty('gmapkey')){
			config.gmapkey = gmapkey;
		}
		else{
			console.error('Autoconfig Error: gmapkey field does not exist');
			return;
		}

		if(config.hasOwnProperty('location') && location){
			config.location = location;
		}

		if(config.hasOwnProperty('walk') && walk){
			config.walk = walk;
		}

		if(config.hasOwnProperty('item_filter')){
			config.item_filter = item_filter;
		}

		if(config.hasOwnProperty('release') && config.release.any){
			config.release.any.release_below_cp = 400;
			config.release.any.release_below_iv = 0.9;
			config.release.any.logic = 'and';
		}
	}

	jsonfile.writeFile(file, config, {spaces: 2}, function(err){
		if(err){
			console.error('Autoconfig Error: Writejson error', err);
			return;
		}
		console.info('Autoconfig: config completed');
	})
};

var fileExists = function(path){
	try {
		fs.accessSync(path);
		return true;
	} 
	catch (err) {
		return false;
	}
};

main();