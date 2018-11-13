'use strict';
const path = require('path');

function getAssetsFolders(ids) {
  const results = [];
  var serviceWorkerIDs = ids.split(',');

  for (var i = 0; i < serviceWorkerIDs.length; i++) {
    results.push(path.resolve(__dirname, 'serviceWorker' + serviceWorkerIDs[i]));
  }

  return results;
}

function getServiceWorkersDescription() {
  return path.resolve(__dirname, 'serviceworkers.json');
}

module.exports = {
  getAssetsFolders: getAssetsFolders,
  getServiceWorkersDescription: getServiceWorkersDescription
};
