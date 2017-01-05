//This is the "Offline page" service worker

//add this below content to your HTML page, or add the js file to yoru page at the very top to register sercie worker
if (navigator.serviceWorker.controller) {
  console.log('[Manifoldjs] active service worker found, no need to register')
} else {
  //Register the ServiceWorker
  navigator.serviceWorker.register('manifoldjs-sw.js', {
    scope: './'
  }).then(function(reg) {
    console.log('Service worker has been registered for scope:'+ reg.scope);
  });
}

