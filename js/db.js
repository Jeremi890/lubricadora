// CONFIGURACIÓN DE BASE DE DATOS LOCALDB
const sql = require('mssql'); // Cambiamos de msnodesqlv8 a mssql normal

const config = {
  server: 'LubricadoraUG.mssql.somee.com',
  database: 'LubricadoraUG',
  port: 1433,
  authentication: {
    type: 'default',
    options: {
      userName: 'xtrangern_SQLLogin_1',
      password: 'dsq7oak44g'
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectionTimeout: 15000,
    requestTimeout: 15000
  }
};

class Database {
  constructor() {
    this.pool = null;
  }

  async connect() {
    try {
      this.pool = new sql.ConnectionPool(config);
      await this.pool.connect();
      console.log('✅ Conectado a SQL Server (LocalDB)');
      return this.pool;
    } catch (err) {
      console.error('❌ Error de conexión:', err);
      throw err;
    }
  }

  async query(queryString, params = {}) {
    try {
      if (!this.pool) await this.connect();
      const request = this.pool.request();
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
      }
      
      const result = await request.query(queryString);
      return result.recordset;
    } catch (err) {
      console.error('Error en query:', err);
      throw err;
    }
  }

  async close() {
    if (this.pool) await this.pool.close();
  }
}

module.exports = new Database();