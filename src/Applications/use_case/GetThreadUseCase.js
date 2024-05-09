const MainThread = require('../../Domains/threads/entities/MainThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getTheThreadById(threadId);
    const comment = await this._commentRepository.getCommentByThreadId(threadId);
    const reply = await this._replyRepository.getReplyByThreadId(threadId);

    thread.comments = this._changeContentOfComments(comment);
    thread.comments = this._changeContentOfRepliesComment(thread.comments, reply);
    thread.comments = await this._getLikeCountOfComment(thread.comments);

    return new MainThread(thread);
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

  async _getLikeCountOfComment(comments) {
    for (let i = 0; i < comments.length; i++) {
      const commentId = comments[i].id;

      comments[i].likeCount = await this._likeRepository.getLikeCountByCommentId(commentId);
    }

    return comments;
  }
}

module.exports = GetThreadUseCase;
