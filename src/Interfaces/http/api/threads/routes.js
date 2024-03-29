const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
      auth: 'forum_api',
    },
  },
];

module.exports = routes;
