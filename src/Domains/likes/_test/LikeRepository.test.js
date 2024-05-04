const LikeRepository = require('../LikeRepository');

describe('LikeRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Assert & Action
    await expect(likeRepository.addLike({})).rejects.toThrow(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(likeRepository.getLikeCountByCommentId()).rejects.toThrow(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(likeRepository.deletLikeByCommentIdAndOwner({})).rejects.toThrow(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(likeRepository.verifyExistingLike({})).rejects.toThrow(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
