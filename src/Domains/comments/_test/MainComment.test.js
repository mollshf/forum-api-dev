const MainComment = require('../entities/MainComment');

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
      isDelete: 'false',
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
      isDelete: false,
    };

    // Action
    const { id, username, date, content, isDelete } = new MainComment(mainCommentPayload);

    // Assert
    expect(id).toEqual(mainCommentPayload.id);
    expect(username).toEqual(mainCommentPayload.username);
    expect(date).toEqual(mainCommentPayload.date);
    expect(content).toEqual(mainCommentPayload.content);
    expect(isDelete).toEqual(mainCommentPayload.isDelete);
  });
});
