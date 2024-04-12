class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getTheThreadById(threadId);
    const comment = await this._commentRepository.getCommentByThreadId(threadId);
    const reply = await this._replyRepository.getReplyByThreadId(threadId);

    thread.comments = this._changeContentOfComments(comment);
    thread.comments = this._changeContentOfRepliesComment(thread.comments, reply);

    return thread;
  }

  _changeContentOfComments(arr) {
    return arr.map((data) => {
      if (data.isDelete) {
        data.content = '**komentar telah dihapus**';
      }
      delete data.isDelete;
      return data;
    });
  }

  _changeContentOfRepliesComment(comments, replies) {
    let result = [];
    comments.forEach((comment) => {
      comment.replies = replies
        .filter((reply) => reply.commentId === comment.id)
        .map((reply) => ({
          id: reply.id,
          username: reply.username,
          date: reply.date,
          content: reply.isDelete ? '**balasan telah dihapus**' : reply.content,
        }));
      result.push(comment);
    });
    return result;
  }
}

module.exports = GetThreadUseCase;
