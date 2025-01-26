define([
	"../files"
],function(files){

	var cache = {}

	function get(name) {
		return cache[name];
	}

	function add(name,provider) {
		cache[name] = provider;
	}
	

	return files.providers.registry = {
		get,
		add
	};
});