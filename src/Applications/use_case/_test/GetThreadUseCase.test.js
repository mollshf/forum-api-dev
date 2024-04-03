const CommentRepository = require('../../../Domains/comments/CommentRepository');
const MainComment = require('../../../Domains/comments/entities/MainComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const MainThread = require('../../../Domains/threads/entities/MainThread');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  describe('GetThreadUseCase execute function', () => {
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
          content: 'hontou!!!',
          isDelete: false,
        }),
        new MainComment({
          id: 'comment-999',
          username: 'user-A',
          date: '2024',
          content: 'sugoii!!',
          isDelete: true,
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
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      /* filtering isDelete at comment */
      const { isDelete: isDeleteA, ...mockCommentA } = mockComment[0];
      const { isDelete: isDeleteB, ...mockCommentB } = mockComment[1];

      const expectedComment = [mockCommentA, mockCommentB];

      /* mocking needed function */
      getThreadUseCase._changeContentOfComments = jest
        .fn()
        .mockImplementation(() => [mockCommentA, mockCommentB]);

      // Action
      const getThread = await getThreadUseCase.execute(useCasePayload);

      // Assert
      expect(getThread).toEqual(
        new MainThread({
          ...expectedMainThread,
          comments: expectedComment,
        }),
      );
      expect(mockThreadRepository.getTheThreadById).toBeCalledWith(useCasePayload);
      expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCasePayload);
      expect(getThreadUseCase._changeContentOfComments).toBeCalledWith(mockComment);
      expect(getThreadUseCase._changeContentOfComments).toHaveBeenCalled();
    });
  });

  describe('GetThreadUseCase _changeContentOfComments function', () => {
    it('should change content of deleted comments', () => {
      // Arrange
      const useCase = new GetThreadUseCase({});

      const mockComment = [
        {
          id: 'comment-999',
          username: 'user-A',
          date: '2024',
          content: 'hontou!!!',
          isDelete: false,
        },
        {
          id: 'comment-999',
          username: 'user-A',
          date: '2024',
          content: 'sugoii!!',
          isDelete: true,
        },
      ];

      /* filtering mapping comment */
      const { isDelete: isDeleteA, content: contentA, ...mockCommentA } = mockComment[0];
      const { isDelete: isDeleteB, content: contentB, ...mockCommentB } = mockComment[1];

      const expectedResult = [
        { content: contentA, ...mockCommentA },
        { content: '**komentar telah dihapus**', ...mockCommentB },
      ];

      // Action & Assert
      expect(useCase._changeContentOfComments(mockComment)).toEqual(expectedResult);
    });

    it('should remove isDelete property after changing content', () => {
      // Arrange
      const useCase = new GetThreadUseCase({});
      const comments = [
        {
          id: 'comment-999',
          username: 'user-A',
          date: '2024',
          content: 'hontou!!!',
          isDelete: false,
        },
      ];

      const result = useCase._changeContentOfComments(comments);

      result.forEach((comment) => {
        expect(comment.isDelete).toBeUndefined();
      });
    });
  });
});
