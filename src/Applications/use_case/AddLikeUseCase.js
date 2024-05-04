const NewLike = require('../../Domains/likes/entities/NewLike');

class AddLikeUseCase {
  constructor({ commentRepository, likeRepository }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCaseCredential, useCaseParam) {
    const newLike = new NewLike({
      commentId: useCaseParam.commentId,
      owner: useCaseCredential.id,
    });

    await this._commentRepository.verifyExistingComment(useCaseParam);

    if (await this._likeRepository.verifyExistingLike(newLike)) {
      await this._likeRepository.deletLikeByCommentIdAndOwner(newLike);
      return 0;
    }

    await this._likeRepository.addLike(newLike);
    return 0;
  }
}

module.exports = AddLikeUseCase;
