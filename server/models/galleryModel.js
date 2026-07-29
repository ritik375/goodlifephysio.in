const { pool } = require('../config/db');

const GalleryModel = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM gallery ORDER BY display_order ASC, id DESC');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM gallery WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const { title, category, image, display_order } = data;
    const [result] = await pool.query(
      'INSERT INTO gallery (title, category, image, display_order) VALUES (?, ?, ?, ?)',
      [title, category || 'Facility', image, display_order || 0]
    );
    return this.getById(result.insertId);
  },

  async update(id, data) {
    const { title, category, display_order } = data;
    await pool.query(
      'UPDATE gallery SET title = ?, category = ?, display_order = ? WHERE id = ?',
      [title, category, display_order, id]
    );
    return this.getById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM gallery WHERE id = ?', [id]);
    return true;
  },
};

module.exports = GalleryModel;
