const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseCredential, useCaseParam, useCasePayload) {
    const newComment = new NewComment({
      ...useCasePayload,
      owner: useCaseCredential.id,
      threadId: useCaseParam.threadId,
    });

    await this._threadRepository.getTheThreadById(useCaseParam.threadId);

    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
