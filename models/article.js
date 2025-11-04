const pool = require("../db");

const UNMODIFIABLE_COLUMNS = ['id', 'created_at', 'updated_at'];

let columns;

async function getColumns(){
  if (!columns){
    const result = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'articles'");
    columns = result.rows.map(row => row.column_name);
  }

  return columns;
}

const Article = {
  async getAll(){
    const articles = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
    return articles.rows;
  },

  async get(id){
    const article = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
    return article.rows[0];
  },

  async getBySection(section){
    const articles = await pool.query('SELECT * FROM articles WHERE section ILIKE $1 ORDER BY created_at DESC', [section]);
    return articles.rows;
  },

  async getByTag(tag){
    const articles = await pool.query('SELECT * FROM articles WHERE tag ILIKE $1 ORDER BY created_at DESC', [tag]);
    return articles.rows;
  },

  async create(article){
    const col = columns || await getColumns();

    let query = `INSERT INTO articles (`;
    let values = [];

    for (const key in article){
      if (col.includes(key) && !UNMODIFIABLE_COLUMNS.includes(key)){
        query += `${key}, `;
        values.push(article[key]);
      }
    }

    query = query.slice(0, -2);
    query += `) VALUES (${values.map((_, i) => `$${i + 1}`)}) RETURNING *`;

    const result = await pool.query(query, values);

    return result.rows[0];
  },

  async update(article){
    const col = columns || await getColumns();

    let query = `UPDATE articles SET `;
    let values = [];

    for (const key in article){
      if (col.includes(key) && !UNMODIFIABLE_COLUMNS.includes(key)){
        query += `${key} = $${values.length + 1}, `;
        values.push(article[key]);
      }
    }

    query = query.slice(0, -2);
    query += ` WHERE id = $${values.length + 1} RETURNING *`;
    values.push(article.id);

    const result = await pool.query(query, values);

    return result.rows[0];
  },

  async delete(id){
    const result = await pool.query('DELETE FROM articles WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Article;
