const bcrypt = require('bcryptjs');
const pool = require("../db");

const User = {
  async getByEmailOrUsername(emailOrUsername){
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [emailOrUsername]
    );
    return user.rows[0];
  },

  async get(id){
    const user = await pool.query(
      'SELECT id, username, email, first_name, last_name, role, is_active, last_login, created_at FROM users WHERE id = $1',
      [id]
    );
    return user.rows[0];
  },

  async create(userData){
    const { username, email, password, firstName, lastName, role = 'user' } = userData;

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      'INSERT INTO users (username, email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, first_name, last_name, role, created_at',
      [username, email, hashedPassword, firstName, lastName, role]
    );

    return result.rows[0];
  },

  async verifyPassword(plainPassword, hashedPassword){
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async updateLastLogin(id){
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [id]);
  },

  async existsByEmail(email){
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    return result.rows.length > 0;
  },

  async existsByUsername(username){
    const result = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    return result.rows.length > 0;
  }
};

module.exports = User;
