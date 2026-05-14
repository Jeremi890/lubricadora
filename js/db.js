// CONFIGURACIÓN DE BASE DE DATOS SQL SERVER
require('dotenv').config();
const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'LubricadorasDiana',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || 'Admin123@'
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
      console.log('✅ Conectado a SQL Server');
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
      
      // Agregar parámetros
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

  async execute(procName, params = {}) {
    try {
      if (!this.pool) await this.connect();
      const request = this.pool.request();
      
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
      }
      
      const result = await request.execute(procName);
      return result.recordset;
    } catch (err) {
      console.error('Error en execute:', err);
      throw err;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.close();
    }
  }
}

module.exports = new Database();
