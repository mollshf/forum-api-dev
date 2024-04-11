const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseCredential, useCaseParam, useCasePayload) {
    const newReply = new NewReply({
      ...useCasePayload,
      owner: useCaseCredential.id,
      commentId: useCaseParam.commentId,
    });

    await this._threadRepository.getTheThreadById(useCaseParam.threadId);
    await this._commentRepository.verifyExistingComment(useCaseParam);

    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
