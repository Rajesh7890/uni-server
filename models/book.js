const pool = require("../db");

const UNMODIFIABLE_COLUMNS = ['id', 'created_at', 'updated_at'];

let columns;

async function getColumns(){
  if (!columns){
    const result = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'books'");
    columns = result.rows.map(row => row.column_name);
  }

  return columns;
}

const Book = {
  async getAll(){
    const books = await pool.query('SELECT * FROM books');
    return books.rows;
  },

  async get(id){
    const book = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    return book.rows[0];
  },

  async create(book){
    const col = columns || await getColumns();

    let query = `INSERT INTO books (`;
    let values = [];

    for (const key in book){
      if (col.includes(key) && !UNMODIFIABLE_COLUMNS.includes(key)){
        query += `${key}, `;
        values.push(book[key]);
      }
    }

    query = query.slice(0, -2);
    query += `) VALUES (${values.map((_, i) => `$${i + 1}`)}) RETURNING *`;

    const result = await pool.query(query, values);

    return result.rows[0];
  },

  async update(book){
    const col = columns || await getColumns();

    let query = `UPDATE books SET `;
    let values = [];

    for (const key in book){
      if (col.includes(key) && !UNMODIFIABLE_COLUMNS.includes(key)){
        query += `${key} = $${values.length + 1}, `;
        values.push(book[key]);
      }
    }

    query = query.slice(0, -2);
    query += ` WHERE id = '${book.id}' RETURNING *`;

    const result = await pool.query(query, values);

    return result.rows[0];
  },

  async delete(id){
    const result = await pool.query('DELETE FROM books WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
};

module.exports = Book;
