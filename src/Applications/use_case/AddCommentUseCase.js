const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseCredential, useCaseParam, useCasePayload) {
    await this._threadRepository.getTheThreadById(useCaseParam.threadId);

    const newComment = this._commentRepository.addComment(
      new NewComment({
        ...useCasePayload,
        owner: useCaseCredential.id,
        threadId: useCaseParam.threadId,
      }),
    );

    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
