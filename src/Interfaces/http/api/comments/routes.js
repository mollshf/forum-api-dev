const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: (request, h) => handler.postCommentHandler(request, h),
    options: {
      auth: 'forum_api',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: (request, h) => handler.postCommentHandler(request, h),
    options: {
      auth: 'forum_api',
    },
  },
];

module.exports = routes;
