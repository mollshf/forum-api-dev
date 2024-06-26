const MainComment = require('../MainComment');

describe('MainComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const mainCommentPayload = {
      id: 'comment-112',
      content: 'kerennn!!',
      username: 'user-omoshiroi12',
      date: '2024',
    };

    // Action & Assert
    expect(() => new MainComment(mainCommentPayload)).toThrow(
      'MAIN_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const mainCommentPayload = {
      id: 'comment-112',
      username: 'user-omoshiroi12',
      date: '2024',
      content: 'kerennn!!',
      replies: 123,
      isDelete: 'false',
      likeCount: '1',
    };

    // Action & Assert
    expect(() => new MainComment(mainCommentPayload)).toThrow(
      'MAIN_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create MainComment object correctly', () => {
    // Arrange
    const mainCommentPayload = {
      id: 'comment-112',
      username: 'user-omoshiroi12',
      date: '2024',
      content: 'kerennn!!',
      replies: [],
      isDelete: false,
      likeCount: 1,
    };

    // Action
    const { id, username, date, content, replies, isDelete, likeCount } = new MainComment(
      mainCommentPayload,
    );

    // Assert
    expect(id).toEqual(mainCommentPayload.id);
    expect(username).toEqual(mainCommentPayload.username);
    expect(date).toEqual(mainCommentPayload.date);
    expect(content).toEqual(mainCommentPayload.content);
    expect(replies).toEqual(mainCommentPayload.replies);
    expect(isDelete).toEqual(mainCommentPayload.isDelete);
    expect(likeCount).toEqual(mainCommentPayload.likeCount);
  });
});
