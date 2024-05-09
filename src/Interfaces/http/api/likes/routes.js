const routes = (handler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: (request, h) => handler.postLikeHandler(request, h),
    options: {
      auth: 'forum_api',
    },
  },
];

module.exports = routes;
