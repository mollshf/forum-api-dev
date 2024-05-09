const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadRepositoryTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await LikeTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when user likes the comment', async () => {
      // Arrange

      /* server connection */
      const server = await createServer(container);

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      /* crete needed data to run like endpoint */
      const { accessToken, userId } = await ServerTestHelper.getResponseOfToken(server, {});
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentTableTestHelper.addcomment({ id: commentId, owner: userId, threadId });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const expectedLike = await LikeTableTestHelper.findLikeByCommentIdAndOwner({
        commentId,
        owner: userId,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(expectedLike).toBeDefined();
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 when user cancels like the comment', async () => {
      // Arrange

      /* server connection */
      const server = await createServer(container);

      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const likeId = 'like-123';

      /* crete needed data to run like endpoint */
      const { accessToken, userId } = await ServerTestHelper.getResponseOfToken(server, {});
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentTableTestHelper.addcomment({ id: commentId, owner: userId, threadId });
      await LikeTableTestHelper.addLike({ id: likeId, commentId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const expectedLike = await LikeTableTestHelper.findLikeByCommentIdAndOwner({
        commentId,
        owner: userId,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(expectedLike).toBeUndefined();
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
