const { pool } = require('../config/db');

const ServiceModel = {
  async getAll({ activeOnly = false } = {}) {
    const sql = activeOnly
      ? 'SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC, id ASC'
      : 'SELECT * FROM services ORDER BY display_order ASC, id ASC';
    const [rows] = await pool.query(sql);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async getBySlug(slug) {
    const [rows] = await pool.query('SELECT * FROM services WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  async create(data) {
    const { title, slug, short_description, description, icon, duration_minutes, display_order } = data;
    const [result] = await pool.query(
      `INSERT INTO services (title, slug, short_description, description, icon, duration_minutes, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, short_description, description, icon || 'FaNotesMedical', duration_minutes || 45, display_order || 0]
    );
    return this.getById(result.insertId);
  },

  async update(id, data) {
    const { title, slug, short_description, description, icon, duration_minutes, display_order, is_active } = data;
    await pool.query(
      `UPDATE services SET title = ?, slug = ?, short_description = ?, description = ?, icon = ?,
       duration_minutes = ?, display_order = ?, is_active = ? WHERE id = ?`,
      [title, slug, short_description, description, icon, duration_minutes, display_order, is_active, id]
    );
    return this.getById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM services WHERE id = ?', [id]);
    return true;
  },
};

module.exports = ServiceModel;
