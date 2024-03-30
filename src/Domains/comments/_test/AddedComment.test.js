const AddedComment = require('../entities/AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const addedCommentPayload = {
      id: 'comment-8839',
      owner: 'user-998',
    };

    // Action & Assert
    expect(() => new AddedComment(addedCommentPayload)).toThrow(
      'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const addedCommentPayload = {
      id: 'comment-8839',
      content: 123,
      owner: 'user-998',
    };

    // Action & Assert
    expect(() => new AddedComment(addedCommentPayload)).toThrow(
      'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create AddedComment object correctly', () => {
    // Arrange
    const newCommentPayload = {
      id: 'comment-2083',
      content: 'sangat menarik!!',
      owner: 'user-23908',
    };

    // Action
    const { idThread, content, owner } = new AddedComment(newCommentPayload);

    // Assert
    expect(idThread).toEqual(newCommentPayload.idThread);
    expect(content).toEqual(newCommentPayload.content);
    expect(owner).toEqual(newCommentPayload.owner);
  });
});
