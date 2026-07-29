const { pool } = require('../config/db');

const AppointmentModel = {
  async getAll({ status } = {}) {
    let sql = `
      SELECT a.*, s.title AS service_title, d.name AS doctor_name
      FROM appointments a
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN doctors d ON a.doctor_id = d.id`;
    const params = [];
    if (status) {
      sql += ' WHERE a.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY a.created_at DESC';
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM appointments WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const { full_name, email, phone, service_id, doctor_id, preferred_date, preferred_time, message } = data;
    const [result] = await pool.query(
      `INSERT INTO appointments (full_name, email, phone, service_id, doctor_id, preferred_date, preferred_time, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, phone, service_id || null, doctor_id || null, preferred_date, preferred_time, message || null]
    );
    return this.getById(result.insertId);
  },

  async updateStatus(id, status) {
    await pool.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    return this.getById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM appointments WHERE id = ?', [id]);
    return true;
  },

  async countByStatus() {
    const [rows] = await pool.query(
      `SELECT status, COUNT(*) AS count FROM appointments GROUP BY status`
    );
    return rows;
  },
};

module.exports = AppointmentModel;
