/* istanbul ignore file */
const { nanoid } = require('nanoid');
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread(payload) {
    const { title, body, owner } = payload;
    const id = `thread-${nanoid(16)}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, title, body, date, owner],
    };

    await pool.query(query);
  },

  async getAllThreads() {
    const result = await pool.query('SELECT * FROM threads');
    return result.rows;
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
