const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadRepositoryTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });
  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'ini adalah content',
      };
      const threadId = 'thread-123';

      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getResponseOfToken(server, {});

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should return a 400 status code for incomplete or invalid request body data types', async () => {
      // Arrange
      const badCommentPayload = [{ content: 123 }, {}];
      const requestPayload =
        badCommentPayload[Math.floor(Math.random() * badCommentPayload.length)];

      const threadId = 'thread-123';
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getResponseOfToken(server, {});

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should respond with a 200 status code and indicate successful deletion', async () => {
      // Arrange
      const server = await createServer(container);

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const { accessToken, userId } = await ServerTestHelper.getResponseOfToken(server, {});

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentTableTestHelper.addcomment({ id: commentId, threadId: threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond 403 for deleting a non-owned comment', async () => {
      // Arrange
      const server = await createServer(container);

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const { accessToken, userId } = await ServerTestHelper.getResponseOfToken(server, {});

      /* other user comment */
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await UsersTableTestHelper.addUser({ id: 'user-xxx' });
      await CommentTableTestHelper.addcomment({
        id: commentId,
        threadId: threadId,
        owner: 'user-xxx',
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
