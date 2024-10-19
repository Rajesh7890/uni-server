const pool = require("../db");

const UNMODIFIABLE_COLUMNS = ['id', 'created_at', 'updated_at'];

let columns;

async function getColumns(){
  if (!columns){
    const result = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'expenses'");
    columns = result.rows.map(row => row.column_name);
  }

  return columns;
}

const Expense = {
  async getAll(){
    const expenses = await pool.query('SELECT * FROM expenses');
    return expenses.rows;
  },

  async get(id){
    const expense = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
    return expense.rows[0];
  },

  async create(expense){
    const col = columns || await getColumns();

    let query = `INSERT INTO expenses (`;
    let values = [];

    for (const key in expense){
      if (col.includes(key) && !UNMODIFIABLE_COLUMNS.includes(key)){
        query += `${key}, `;
        values.push(expense[key]);
      }
    }

    query = query.slice(0, -2);
    query += `) VALUES (${values.map((_, i) => `$${i + 1}`)}) RETURNING *`;

    const result = await pool.query(query, values);

    return result.rows[0];
  },

  async update(expense){
    const col = columns || await getColumns();

    let query = `UPDATE expenses SET `;
    let values = [];

    for (const key in expense){
      if (col.includes(key) && !UNMODIFIABLE_COLUMNS.includes(key)){
        query += `${key} = $${values.length + 1}, `;
        values.push(expense[key]);
      }
    }

    query = query.slice(0, -2);
    query += ` WHERE id = '${expense.id}' RETURNING *`;

    const result = await pool.query(query, values);

    return result.rows[0];
  },

  async delete(id){
    const result = await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Expense
