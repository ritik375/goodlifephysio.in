const { pool } = require('../config/db');

const DoctorModel = {
  async getAll({ activeOnly = false } = {}) {
    const sql = activeOnly
      ? 'SELECT * FROM doctors WHERE is_active = 1 ORDER BY display_order ASC, id ASC'
      : 'SELECT * FROM doctors ORDER BY display_order ASC, id ASC';
    const [rows] = await pool.query(sql);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM doctors WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const { name, designation, specialization, experience_years, bio, photo, email, phone, display_order } = data;
    const [result] = await pool.query(
      `INSERT INTO doctors (name, designation, specialization, experience_years, bio, photo, email, phone, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, designation, specialization, experience_years || 0, bio || null, photo || null, email || null, phone || null, display_order || 0]
    );
    return this.getById(result.insertId);
  },

  async update(id, data) {
    const { name, designation, specialization, experience_years, bio, photo, email, phone, display_order, is_active } = data;
    await pool.query(
      `UPDATE doctors SET name = ?, designation = ?, specialization = ?, experience_years = ?, bio = ?,
       photo = COALESCE(?, photo), email = ?, phone = ?, display_order = ?, is_active = ? WHERE id = ?`,
      [name, designation, specialization, experience_years, bio, photo, email, phone, display_order, is_active, id]
    );
    return this.getById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM doctors WHERE id = ?', [id]);
    return true;
  },
};

module.exports = DoctorModel;
