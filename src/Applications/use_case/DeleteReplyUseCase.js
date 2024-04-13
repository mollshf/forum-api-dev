class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCaseCredential, useCaseParam) {
    await this._replyRepository.verifyExistingReply(useCaseParam);
    await this._replyRepository.verifyReplyOwner({
      replyId: useCaseParam.replyId,
      ownerId: useCaseCredential.id,
    });

    await this._replyRepository.deleteReplyById(useCaseParam.replyId);
  }
}

module.exports = DeleteReplyUseCase;
