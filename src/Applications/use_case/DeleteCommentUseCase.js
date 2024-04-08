class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCaseCredential, useCaseParam) {
    const { threadId, commentId } = useCaseParam;

    await this._commentRepository.verifyExistingComment({ threadId, commentId });
    await this._commentRepository.verifyCommentOwner({ commentId, ownerId: useCaseCredential });
    await this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
