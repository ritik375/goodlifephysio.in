const bcrypt = require("bcrypt");
const { pool } = require("../src/config/db");

const resetAdminPassword = async () => {
  try {
    const email = "admin@motionwell.com";
    const newPassword = '$2b$10$f9DIQgRZvzK3tvfIJnoTQ.mJVMC8Hvx.0.tyC3MbFjAuX1P7Y9Ar.';

    if (!newPassword) {
      throw new Error(
        "NEW_ADMIN_PASSWORD environment variable is not configured"
      );
    }

    if (newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters long");
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
      throw new Error(`Admin not found with email: ${email}`);
    }

    const [rows] = await pool.execute(
      `
        SELECT id, email, password
        FROM admins
        WHERE email = ?
        LIMIT 1
      `,
      [email]
    );

    const passwordMatches = await bcrypt.compare(
      newPassword,
      rows[0].password
    );

    console.log("✅ Admin password updated successfully");
    console.log("Admin ID:", rows[0].id);
    console.log("Admin email:", rows[0].email);
    console.log("Password verification:", passwordMatches);
  } catch (error) {
    console.error("❌ Password reset failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

resetAdminPassword();
