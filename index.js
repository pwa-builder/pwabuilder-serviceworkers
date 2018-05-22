'use strict';
var path = require('path');

function getAssetsFolders(ids) {
  var results = [];
  var serviceWorkerIDs = ids.split(',');

  for (var i = 0; i < serviceWorkerIDs.length; i++) {
    results.push(path.resolve(__dirname, 'serviceWorker' + serviceWorkerIDs[i]));
  }

  return results;
}

module.exports = {
  getAssetsFolders: getAssetsFolders
};