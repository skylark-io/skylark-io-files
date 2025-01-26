define([
	"./files",
	"./action-type",
	"./base-file",
	"./error-codes",
	"./error-strings",
	"./file-error",
	"./file-flag",
	"./file-system",
	"./no-sync-file",
	"./preload-file",
	"./stats",
	"./configure",
	"./providers/dropbox/dropbox-provider",
	"./providers/html5/html5-lfs-provider",
	"./providers/http/http-provider",
	"./providers/indexeddb/indexed-db-provider",
	"./providers/inmemory/in-memory-provider",
	"./providers/localstorage/local-storage-provider",
	"./providers/overlay/overlay-provider"

],function(files){
	return files;
});