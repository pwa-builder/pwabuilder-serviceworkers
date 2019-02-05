//This is the service worker with the Advance pre-cache

const CACHE = 'pwabuilder-adv-cache';
const precacheFiles = [
  /* Add an array of files to precache for your app */
];
const offlineFallbackPage = "offline.html";

const networkFirstPaths = [
  /* Add an array of regex of paths that should go network first */
];

function pathComparer(requestUrl, pathRegEx) {
  return requestUrl.match(new RegExp(pathRegEx));
}

function compareNetworkFirstPaths(requestUrl) {
  if (requestUrl) {
    for (let index = 0; index < networkFirstPaths.length; index++) {
      const pathRegEx = networkFirstPaths[index];
      if (pathComparer(requestUrl, pathRegEx)) {
        return true;
      }
    }
  }

  return false;
}

self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  console.log("[PWA Builder] Skip waiting on install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Caching pages during install");
      return cache.add(offlineFallbackPage)
        .then(function () { 
          return cache.addAll(precacheFiles);
        });
    })
  );
});

// Allow sw to control of current page
self.addEventListener("activate", function (event) {
  console.log("[PWA Builder] Claiming clients for current page");
  event.waitUntil(self.clients.claim());
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
  if (compareNetworkFirstPaths(event.request)) {
    networkFirstFetch(event);
  } else {
    cacheFirstFetch(event);
  }
});

function cacheFirstFetch(event) {
  fromCache(event.request).then(function (response) {
    // The response was found in the cache so we responde with it and update the entry
    event.respondWith(response);
    // This is where we call the server to get the newest version of the
    // file to use the next time we show view
    event.waitUntil(fetch(event.request).then(function (response) {
      updateCache(event.request, response);
    }));
  }, function () {
    // The response was not found in the cache so we look for it on the server
    fetch(event.request)
      .then(function (response) {
        event.respondWith(response.clone());
        // If request was success, add or update it in the cache
        event.waitUntil(function (response) {
          updateCache(event.request, response);
        });
      })
      .catch(function (error) {
        console.log("[PWA Builder] Network request failed and no cache." + error);
        // Use the precached offline page as fallback
        return caches.open(CACHE).then(function (cache) {
          cache.match(offlinePage);
        });
      });
  });
}

function networkFirstFetch(event) {
  event.respondWith(fetch(event.request)
    .then(function (response) {
      console.log("[PWA Builder] add page to offline cache: " + response.url);
      // If request was success, add or update it in the cache
      event.waitUntil(updateCache(event.request, response.clone()));
      return response;
    })
    .catch(function (error) {
      console.log("[PWA Builder] Network request Failed. Serving content from cache: " + error);
      return fromCache(event.request);
    }));
}

function fromCache(request) {
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return error page
  return caches.open(CACHE).then(function (cache) {
    cache.match(request).then(function (matching) {
      return !matching || matching.status == 404
        ? Promise.reject("no-match")
        : matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}
