const { pool } = require('../config/db');

const ClinicInfoModel = {
  async get() {
    const [rows] = await pool.query('SELECT * FROM clinic_info WHERE id = 1');
    return rows[0] || null;
  },

  async update(data) {
    const {
      clinic_name, tagline, about, address, phone, whatsapp, email,
      map_embed_url, facebook_url, instagram_url, linkedin_url, opening_hours,
    } = data;
    await pool.query(
      `UPDATE clinic_info SET clinic_name = ?, tagline = ?, about = ?, address = ?, phone = ?,
       whatsapp = ?, email = ?, map_embed_url = ?, facebook_url = ?, instagram_url = ?,
       linkedin_url = ?, opening_hours = ? WHERE id = 1`,
      [clinic_name, tagline, about, address, phone, whatsapp, email, map_embed_url,
        facebook_url, instagram_url, linkedin_url, opening_hours]
    );
    return this.get();
  },
};

module.exports = ClinicInfoModel;
