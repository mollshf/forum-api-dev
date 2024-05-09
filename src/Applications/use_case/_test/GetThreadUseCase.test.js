const CommentRepository = require('../../../Domains/comments/CommentRepository');
const MainComment = require('../../../Domains/comments/entities/MainComment');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const MainReply = require('../../../Domains/replies/entities/MainReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const MainThread = require('../../../Domains/threads/entities/MainThread');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  describe('GetThreadUseCase execute function', () => {
    it('should orchastrating the get thread action correctly', async () => {
      // Arrange
      const threadId = 'thread-123';

      const mockGetTheThreadById = {
        id: 'thread-subarashi12',
        title: 'valorant vct',
        body: 'APAC is on fire',
        date: `2024`,
        username: 'userABC',
      };

      const mockComment = [
        new MainComment({
          id: 'comment-123',
          username: 'user-A',
          date: '2024',
          content: 'hontou!!!',
          replies: [],
          isDelete: false,
          likeCount: 0,
        }),
        new MainComment({
          id: 'comment-124',
          username: 'user-A',
          date: '2024',
          content: 'sugoii!!',
          replies: [],
          isDelete: true,
          likeCount: 0,
        }),
      ];

      const mockReplies = [
        new MainReply({
          id: 'reply-123',
          commentId: 'comment-123',
          username: 'user-B',
          date: '2024',
          content: 'this is reply content A',
          isDelete: false,
        }),
        new MainReply({
          id: 'reply-124',
          commentId: 'comment-124',
          username: 'user-B',
          date: '2024',
          content: 'this is reply content A',
          isDelete: false,
        }),
      ];

      /* creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /* mocking needed function */
      mockThreadRepository.getTheThreadById = jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockGetTheThreadById));

      mockCommentRepository.getCommentByThreadId = jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockComment));

      mockReplyRepository.getReplyByThreadId = jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockReplies));

      // mockReplyRepository.

      /* creating use case instance */
      const getThreadUseCase = new GetThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
        likeRepository: {},
      });

      /* filtering isDelete at comment */
      const { isDelete: isDeleteA, ...mockCommentA } = mockComment[0];
      const { isDelete: isDeleteB, ...mockCommentB } = mockComment[1];

      /* filtering commentId and isDelete at reply */
      const {
        commentId: isCommentIdA,
        isDelete: isDeleteReplyA,
        ...filterReplyDetailA
      } = mockReplies[0];

      const {
        commentId: isCommentIdB,
        isDelete: isDeleteReplyB,
        ...filterReplyDetailB
      } = mockReplies[1];

      const expectedComment = [
        { ...mockCommentA, replies: [filterReplyDetailA] },
        { ...mockCommentB, replies: [filterReplyDetailB] },
      ];

      const mockExpectedComment = [
        { ...mockCommentA, replies: [filterReplyDetailA] },
        { ...mockCommentB, replies: [filterReplyDetailB] },
      ];

      /* mocking needed function */
      getThreadUseCase._changeContentOfComments = jest
        .fn()
        .mockImplementation(() => [mockCommentA, mockCommentB]);

      getThreadUseCase._getLikeCountOfComment = jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockExpectedComment));

      // Action
      const getThread = await getThreadUseCase.execute(threadId);

      // Assert
      expect(getThread).toEqual(
        new MainThread({
          id: 'thread-subarashi12',
          title: 'valorant vct',
          body: 'APAC is on fire',
          date: `2024`,
          username: 'userABC',
          comments: expectedComment,
        }),
      );
      expect(mockThreadRepository.getTheThreadById).toBeCalledWith(threadId);
      expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
      expect(getThreadUseCase._changeContentOfComments).toBeCalledWith(mockComment);
      expect(getThreadUseCase._changeContentOfComments).toHaveBeenCalled();
      expect(getThreadUseCase._getLikeCountOfComment).toHaveBeenCalled();
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
          replies: [],
          isDelete: false,
        },
        {
          id: 'comment-999',
          username: 'user-A',
          date: '2024',
          content: 'sugoii!!',
          replies: [],
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
        new MainComment({
          id: 'comment-999',
          username: 'user-A',
          content: 'hontou!!!',
          date: '2024',
          replies: [],
          isDelete: false,
          likeCount: 0,
        }),
      ];

      const result = useCase._changeContentOfComments(comments);

      result.forEach((comment) => {
        expect(comment.isDelete).toBeUndefined();
      });
    });
  });

  describe('GetThreadUseCase _changeContentOfRepliesComment function', () => {
    it('should operate the function properly', () => {
      // Arrange
      const getThreadUseCase = new GetThreadUseCase({});

      const filteredComments = [
        {
          id: 'comment-123',
          username: 'user-A',
          date: '01042024',
          content: '**komentar telah dihapus**',
          replies: [],
          likeCount: 0,
        },
        {
          id: 'comment-124',
          username: 'user-B',
          date: '08042024',
          content: 'sugoii!!',
          replies: [],
          likeCount: 0,
        },
      ];

      const mockReplies = [
        new MainReply({
          id: 'reply-123',
          commentId: 'comment-123',
          username: 'user-c',
          content: 'reply content c',
          date: '12042024',
          isDelete: false,
        }),
        new MainReply({
          id: 'reply-321',
          commentId: 'comment-124',
          username: 'user-d',
          content: 'reply content d',
          date: '13042024',
          isDelete: true,
        }),
      ];

      const {
        isDelete: isDeleteReplyA,
        commentId: commentIdA,
        ...filteredReplyDetailA
      } = mockReplies[0];

      const {
        isDelete: isDeleteReplyB,
        commentId: commentIdB,
        ...filteredReplyDetailB
      } = mockReplies[1];

      const expectedResult = [
        {
          ...filteredComments[0],
          replies: [filteredReplyDetailA],
        },
        {
          ...filteredComments[1],
          replies: [{ ...filteredReplyDetailB, content: '**balasan telah dihapus**' }],
        },
      ];

      const SpychangeContentOfRepliesComment = jest.spyOn(
        getThreadUseCase,
        '_changeContentOfRepliesComment',
      );

      // Action
      getThreadUseCase._changeContentOfRepliesComment(filteredComments, mockReplies);

      // assert
      expect(SpychangeContentOfRepliesComment).toReturnWith(expectedResult);
    });
  });

  describe('GetThreadUseCase _getLikeCountOfComment function', () => {
    it('should operate the function properly', async () => {
      // Arrange
      const commentsParam = [
        {
          id: 'comment-123',
          username: 'user-A',
          date: '01042024',
          content: '**komentar telah dihapus**',
          replies: [],
          likeCount: 0,
        },
        {
          id: 'comment-124',
          username: 'user-B',
          date: '08042024',
          content: 'sugoii!!',
          replies: [],
          likeCount: 0,
        },
      ];

      const expectedComments = [
        {
          ...commentsParam[0],
          likeCount: 0,
        },
        {
          ...commentsParam[1],
          likeCount: 90,
        },
      ];

      /* creating dependency of getThreadById */
      const mockLikeRepository = new LikeRepository();

      /* mocking needed function */
      mockLikeRepository.getLikeCountByCommentId = jest
        .fn()
        .mockImplementation((commentId) => Promise.resolve(commentId === 'comment-124' ? 90 : 0));

      /* creating getThreadById Instance */
      const getThreadDetailUseCase = new GetThreadUseCase({
        threadRepository: {},
        commentRepository: {},
        likeRepository: mockLikeRepository,
      });

      const SpyGetLikeCountOfComment = jest.spyOn(getThreadDetailUseCase, '_getLikeCountOfComment');

      // action
      const result = await getThreadDetailUseCase._getLikeCountOfComment(commentsParam);

      // assert
      expect(result).toEqual(expectedComments);
      expect(mockLikeRepository.getLikeCountByCommentId).toBeCalledTimes(2);

      SpyGetLikeCountOfComment.mockClear();
    });
  });
});
