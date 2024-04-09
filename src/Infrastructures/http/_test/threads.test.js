const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const ThreadsTableTestHelper = require('../../../../tests/ThreadRepositoryTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'madu',
        body: 'madu is honey',
      };

      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getResponseOfToken(server, {});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should return a 400 status code for incomplete or invalid request body data types', async () => {
      // Arrange
      const badCommentPayload = [{ title: 123, body: 'madu' }, { body: 'madu' }];
      const requestPayload1 =
        badCommentPayload[Math.floor(Math.random() * badCommentPayload.length)];

      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getResponseOfToken(server, {});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload1,
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

  describe('when GET /threads/{threadId}', () => {
    it('should respond with 200, thread details, including both deleted and active comments', async () => {
      // Arrange
      const server = await createServer(container);

      /* for creating thread */
      const threadId = 'thread-123';
      const threadUsername = 'tomoe'; //registration username for created thread
      await UsersTableTestHelper.addUser({ id: 'user-001', username: threadUsername });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-001' });

      /* for creating comments */
      await UsersTableTestHelper.addUser({ id: 'user-002', username: 'komoe' });
      await CommentTableTestHelper.addcomment({
        id: 'comment-123',
        threadId,
        owner: 'user-001', // first active comment
        date: '1',
      });
      await CommentTableTestHelper.addcomment({
        id: 'comment-124',
        threadId,
        owner: 'user-001', // second soft deleted comment
        date: '2',
        isDelete: true,
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: ` /threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBeDefined();
      expect(responseJson.data.thread.title).toBeDefined();
      expect(responseJson.data.thread.username).toEqual(threadUsername);
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].content).toBeDefined();
      expect(responseJson.data.thread.comments[1].content).toEqual('**komentar telah dihapus**');
    });

    it('should respond with 200 and thread details with empty comments', async () => {
      // Arrange

      const server = await createServer(container);

      /* for creating thread */
      const threadId = 'thread-123';
      const threadUsername = 'tomoe'; //registration username for created thread
      await UsersTableTestHelper.addUser({ id: 'user-001', username: threadUsername });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-001' });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: ` /threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBeDefined();
      expect(responseJson.data.thread.title).toBeDefined();
      expect(responseJson.data.thread.username).toEqual(threadUsername);
      expect(responseJson.data.thread.comments).toHaveLength(0);
    });

    it('should return 404 for non-existent threads', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-xxx';

      // Action
      const response = await server.inject({
        method: 'GET',
        url: ` /threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toBeDefined();
    });
  });
});
