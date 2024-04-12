const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const MainReply = require('../../Domains/replies/entities/MainReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator, dateGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._dateGenerator = dateGenerator;
  }

  async addReply(payload) {
    const { commentId, content, owner } = payload;

    console.log({
      commentId,
      content,
      owner,
    });
    const id = `reply-${this._idGenerator(16)}`;
    const date = this._dateGenerator;
    const isDelete = false;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, commentId, owner, date, content, isDelete],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async getReplyByThreadId(threadId) {
    const query = {
      text: `SELECT replies.id, replies.comment_id, replies.is_delete, replies.content, replies.date, users.username 
        FROM replies 
        INNER JOIN comments ON replies.comment_id = comments.id
        INNER JOIN users ON replies.owner = users.id
        WHERE comments.thread_id = $1
        ORDER BY date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((data) => {
      return new MainReply({
        ...data,
        commentId: data.comment_id,
        isDelete: data.is_delete,
      });
    });
  }

  async verifyExistingReply(payload) {
    const { threadId, commentId, replyId } = payload;

    const query = {
      text: `SELECT 1 FROM replies
        INNER JOIN comments ON replies.comment_id = comments.id
        WHERE replies.id = $1
        AND replies.comment_id = $2
        AND comments.thread_id = $3
        AND replies.is_delete = false`,
      values: [replyId, commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak ditemukan.');
    }
  }

  async verifyReplyOwner(payload) {
    const { replyId, ownerId } = payload;

    const query = {
      text: `SELECT 1 FROM replies WHERE id = $1 AND owner = $2`,
      values: [replyId, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses reply ini.');
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: `UPDATE replies SET is_delete = true WHERE id = $1 RETURNING id`,
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus, reply tidak ditemukan.');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
