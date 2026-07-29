const { pool } = require('../config/db');

const TestimonialModel = {
  async getAll({ approvedOnly = false } = {}) {
    const sql = approvedOnly
      ? 'SELECT * FROM testimonials WHERE is_approved = 1 ORDER BY created_at DESC'
      : 'SELECT * FROM testimonials ORDER BY created_at DESC';
    const [rows] = await pool.query(sql);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const { patient_name, condition_treated, rating, message, photo } = data;
    const [result] = await pool.query(
      `INSERT INTO testimonials (patient_name, condition_treated, rating, message, photo)
       VALUES (?, ?, ?, ?, ?)`,
      [patient_name, condition_treated || null, rating || 5, message, photo || null]
    );
    return this.getById(result.insertId);
  },

  async update(id, data) {
    const { patient_name, condition_treated, rating, message, is_approved } = data;
    await pool.query(
      `UPDATE testimonials SET patient_name = ?, condition_treated = ?, rating = ?, message = ?, is_approved = ?
       WHERE id = ?`,
      [patient_name, condition_treated, rating, message, is_approved, id]
    );
    return this.getById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM testimonials WHERE id = ?', [id]);
    return true;
  },
};

module.exports = TestimonialModel;
