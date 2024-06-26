const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const MainComment = require('../../Domains/comments/entities/MainComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator, dateGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._dateGenerator = dateGenerator;
  }

  async addComment(payload) {
    const { threadId, content, owner } = payload;
    const id = `comment-${this._idGenerator(16)}`;
    const date = new this._dateGenerator().toISOString();
    const is_delete = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, owner, date, content, is_delete],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, users.username AS username, comments.content, comments.date, comments.is_delete
      FROM comments
      JOIN users ON comments.owner = users.id
      WHERE thread_id = $1
      ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((data) => {
      return new MainComment({
        ...data,
        isDelete: data.is_delete,
        replies: [],
        likeCount: 0,
      });
    });
  }

  async verifyExistingComment(payload) {
    const { threadId, commentId } = payload;

    const query = {
      text: `SELECT comments.is_delete FROM comments WHERE thread_id = $1 AND id = $2`,
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan.');
    }

    if (result.rows[0]?.is_delete) {
      throw new NotFoundError('Comment tidak ditemukan.');
    }
  }

  async verifyCommentOwner(payload) {
    const { commentId, ownerId } = payload;

    const query = {
      text: `SELECT comments.is_delete FROM comments WHERE id = $1 AND owner = $2`,
      values: [commentId, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses comment ini.');
    }
  }

  async deleteCommentById(commentId) {
    const query = {
      text: `UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus, comment tidak ditemukan.');
    }
  }
}

module.exports = CommentRepositoryPostgres;
