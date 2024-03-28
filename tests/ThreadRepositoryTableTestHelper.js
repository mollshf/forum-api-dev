/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'user-123',
    title = 'absurd',
    body = 'sage is duelist not healer',
    owner = 'user-forsaken',
    date = '2024',
    comment = [],
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, title, body, date, owner, comment],
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
