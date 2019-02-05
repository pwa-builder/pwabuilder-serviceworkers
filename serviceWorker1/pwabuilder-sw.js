// This is the "Offline page" service worker

const CACHE = "pwabuilder-precache";
const offlinePage = new Request("offline.html");

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");
  
  event.waitUntil(
    fetch(offlinePage).then(function (response) {
      return caches.open(CACHE).then(function (cache) {
        console.log("[PWA Builder] Cached offline page during install " + response.url);
        return cache.put(offlinePage, response);
      });
    })
  );
});

// If any fetch fails, it will show the offline page.
// Maybe this should be limited to HTML documents?
self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).catch(function (error) {
      console.error("[PWA Builder] Network request Failed. Serving offline page " + error);
      return caches.open(CACHE).then(function (cache) {
        return cache.match("offline.html");
      });
    })
  );
});

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", function (response) {
  return caches.open(CACHE).then(function (cache) {
    console.log("[PWA Builder] Offline page updated from refreshOffline event: " + response.url);
    return cache.put(offlinePage, response);
  });
});
