const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddLikeUseCase = require('../AddLikeUseCase');

describe('AddLikeUseCase', () => {
  it('should orchastrating the add like action correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'threadId-001',
      commentId: 'commentId-001',
    };

    const useCaseCredential = {
      id: 'user-123',
    };

    const useCaseVerifyExistingLike = {
      commentId: useCaseParam.commentId,
      owner: useCaseCredential.id,
    };

    /* creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /* mocking needed function */
    mockCommentRepository.verifyExistingComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyExistingLike = jest.fn(async () => false);
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    /* creating use case instance */
    const addLikeUseCase = new AddLikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await addLikeUseCase.execute(useCaseCredential, useCaseParam);

    // Assert
    expect(mockCommentRepository.verifyExistingComment).toBeCalledWith(useCaseParam);
    expect(mockLikeRepository.verifyExistingLike).toBeCalledWith(useCaseVerifyExistingLike);
    expect(mockLikeRepository.addLike).toBeCalledWith(
      new NewLike({
        commentId: useCaseParam.commentId,
        owner: useCaseCredential.id,
      }),
    );
  });

  it('should orchastrating the delete like action correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'threadId-001',
      commentId: 'commentId-001',
    };

    const useCaseCredential = {
      id: 'user-123',
    };

    /* creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /* mocking needed function */
    mockCommentRepository.verifyExistingComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyExistingLike = jest.fn(async () => true);
    mockLikeRepository.deletLikeByCommentIdAndOwner = jest.fn(() => Promise.resolve());

    /* creating use case instance */
    const addLikeUseCase = new AddLikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await addLikeUseCase.execute(useCaseCredential, useCaseParam);

    // Assert
    expect(mockCommentRepository.verifyExistingComment).toBeCalledWith(useCaseParam);
    expect(mockLikeRepository.verifyExistingLike).toBeCalledWith(
      new NewLike({
        commentId: useCaseParam.commentId,
        owner: useCaseCredential.id,
      }),
    );
    expect(mockLikeRepository.deletLikeByCommentIdAndOwner).toBeCalledWith(
      new NewLike({
        commentId: useCaseParam.commentId,
        owner: useCaseCredential.id,
      }),
    );
  });
});
