exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    is_delete: {
      type: 'BOOLEAN',
      default: false,
    },
  });

  // pgm.addConstraint(
  //   'comments',
  //   'fk_comments.owner_users.id',
  //   'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  // );
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
