const NewComment = require('../entities/NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const newCommentPayload = {
      idThread: 'nice',
      content: 'okay',
    };

    // Action & Assert
    expect(() => new NewComment(newCommentPayload)).toThrow(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const newCommentPayload = {
      idThread: 123,
      content: {},
      owner: true,
    };

    // Action & Assert
    expect(() => new NewComment(newCommentPayload)).toThrow(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewComment object correctly', () => {
    // Arrange
    const newCommentPayload = {
      idThread: 'thread-992',
      content: 'Madu obat mujarab cuii',
      owner: 'user-23908e',
    };

    // Action
    const { idThread, content, owner } = new NewComment(newCommentPayload);

    // Assert
    expect(idThread).toEqual(newCommentPayload.idThread);
    expect(content).toEqual(newCommentPayload.content);
    expect(owner).toEqual(newCommentPayload.owner);
  });
});
