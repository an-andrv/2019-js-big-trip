const CACHE_NAME = `DEMO_APP`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `/`,
          `/index.html`,
          `/img/star.svg`,
          `/css/main.css`,
          `/css/normalize.css`,
        ])
      })
  );
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        if (response) {
          return response;
        } else {
          return fetch(evt.request)
            .then((response) => {
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(evt.request, response.clone()));
              return response.clone();
            })
        }
      })
  );

});
