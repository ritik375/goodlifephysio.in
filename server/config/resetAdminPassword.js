const bcrypt = require('bcryptjs');
const { pool } = require('./db');

const resetAdminPassword = async () => {
  try {
    const email = 'admin@motionwell.com';
    const newPassword = process.env.NEW_ADMIN_PASSWORD;

    if (!newPassword) {
      throw new Error(
        'NEW_ADMIN_PASSWORD Railway variable is missing'
      );
    }

    if (newPassword.length < 8) {
      throw new Error(
        'Password must contain at least 8 characters'
      );
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    const [result] = await pool.execute(
      `
        UPDATE admins
        SET password = ?, updated_at = CURRENT_TIMESTAMP
        WHERE email = ?
      `,
      [newHash, email]
    );

    if (result.affectedRows === 0) {
      throw new Error(`Admin not found: ${email}`);
    }

    const [admins] = await pool.execute(
      `
        SELECT id, email, password
        FROM admins
        WHERE email = ?
        LIMIT 1
      `,
      [email]
    );

    const isMatch = await bcrypt.compare(
      newPassword,
      admins[0].password
    );

    console.log('✅ Admin password updated');
    console.log('Admin ID:', admins[0].id);
    console.log('Email:', admins[0].email);
    console.log('Password verification:', isMatch);
  } catch (error) {
    console.error('❌ Password reset failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

resetAdminPassword();
