const CommentRepository = require('../../../Domains/comments/CommentRepository');
const MainComment = require('../../../Domains/comments/entities/MainComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const MainThread = require('../../../Domains/threads/entities/MainThread');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchastrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedMainThread = new MainThread({
      id: 'thread-subarashi12',
      title: 'valorant vct',
      body: 'APAC is on fire',
      date: `2024`,
      username: 'user-omoshiroi12',
      comments: [],
    });

    const mockComment = [
      new MainComment({
        id: 'comment-999',
        username: 'user-A',
        date: '2024',
        content: 'comment A',
        isDelete: false,
      }),
      new MainComment({
        id: 'comment-999',
        username: 'user-A',
        date: '2024',
        content: 'comment A',
        isDelete: false,
      }),
    ];

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /* mocking needed function */
    mockThreadRepository.getTheThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedMainThread));

    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    /* creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepositoy: mockThreadRepository,
      commentRepositoy: mockCommentRepository,
    });
  });
});
