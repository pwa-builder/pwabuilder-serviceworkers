//This is the service worker with the Cache-first network

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function(event) {
  event.waitUntil(preLoad());
});

var preLoad = function(){
  console.log('[Manifoldjs] Install Event processing');
  return caches.open('manifoldjs-offline').then(function(cache) {
    console.log('[Manifoldjs] Cached index and offline page during Install');
    return cache.addAll(['/offline.html', '/index.html']);
  });
}

self.addEventListener('fetch', function(event) {
  console.log('The service worker is serving the asset.');
  event.respondWith(checkResponse(event.request).catch(function() {
    return returnFromCache(event.request)}
  ));
  event.waitUntil(addToCache(event.request));
});

var checkResponse = function(request){
  return new Promise(function(fulfill, reject) {
    fetch(request).then(function(response){
      if(response.status !== 404) {
        fulfill(response)
      } else {
        reject()
      }
    }, reject)
  });
};

var addToCache = function(request){
  return caches.open('manifoldjs-offline').then(function (cache) {
    return fetch(request).then(function (response) {
      console.log('[manifoldjs] add page to offline'+response.url)
      return cache.put(request, response);
    });
  });
};

var returnFromCache = function(request){
  return caches.open('manifoldjs-offline').then(function (cache) {
    return cache.match(request).then(function (matching) {
     if(!matching || matching.status == 404) {
       return cache.match('offline.html')
     } else {
       return matching
     }
    });
  });
};