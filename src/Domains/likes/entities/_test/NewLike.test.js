const NewLike = require('../NewLike');

describe('NewLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const newLikePayload = {
      commentId: 'nice',
    };

    // Action & Assert
    expect(() => new NewLike(newLikePayload)).toThrow('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const newLikePayload = {
      commentId: 123,
      owner: true,
    };

    // Action & Assert
    expect(() => new NewLike(newLikePayload)).toThrow('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewLike object correctly', () => {
    // Arrange
    const newLikePayload = {
      commentId: 'comment-001',
      owner: 'user-001',
    };

    // Action
    const { commentId, owner } = new NewLike(newLikePayload);

    // Assert
    expect(commentId).toEqual(newLikePayload.commentId);
    expect(owner).toEqual(newLikePayload.owner);
  });
});
