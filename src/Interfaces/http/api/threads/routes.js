const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forum_api',
    },
  },
];

module.exports = routes;
