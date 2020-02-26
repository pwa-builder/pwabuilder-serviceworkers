// This is the service worker with the Cache-first network

const CACHE = "pwabuilder-precache";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

self.addEventListener("message", ({ data }) => {
  if (data === "forceUpdate") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.CacheFirst({
    cacheName: CACHE
  })
);