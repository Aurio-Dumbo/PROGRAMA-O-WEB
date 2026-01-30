// Modelo de Cliente - Define estrutura e operações do banco de dados
const pool = require('../config/database');

class Cliente {
  // Busca todos os clientes ordenados por data de criação
  static async buscarTodos() {
    try {
      const connection = await pool.getConnection();
      const [clientes] = await connection.query(
        'SELECT * FROM clientes ORDER BY data_criacao DESC'
      );
      connection.release();
      return clientes;
    } catch (error) {
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }
  }

  // Busca um cliente específico pelo ID
  static async buscarPorId(id) {
    try {
      const connection = await pool.getConnection();
      const [cliente] = await connection.query(
        'SELECT * FROM clientes WHERE id = ?',
        [id]
      );
      connection.release();
      return cliente[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar cliente: ${error.message}`);
    }
  }

  // Cria um novo cliente com os dados fornecidos
  static async criar(dados) {
    try {
      const connection = await pool.getConnection();
      const { nome, email, telefone, endereco } = dados;
      
      const [resultado] = await connection.query(
        'INSERT INTO clientes (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)',
        [nome, email, telefone, endereco]
      );
      
      connection.release();
      return resultado.insertId;
    } catch (error) {
      console.error('Erro no modelo Cliente.criar:', error);
      throw new Error(`Erro ao criar cliente: ${error.message}`);
    }
  }

  // Atualiza dados de um cliente existente
  static async atualizar(id, dados) {
    try {
      const connection = await pool.getConnection();
      const { nome, email, telefone, endereco } = dados;
      
      await connection.query(
        'UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE id = ?',
        [nome, email, telefone, endereco, id]
      );
      
      connection.release();
      return true;
    } catch (error) {
      throw new Error(`Erro ao atualizar cliente: ${error.message}`);
    }
  }

  // Deleta um cliente do banco de dados
  static async deletar(id) {
    try {
      const connection = await pool.getConnection();
      
      // Primeiro deleta os atendimentos relacionados
      await connection.query('DELETE FROM atendimentos WHERE cliente_id = ?', [id]);
      
      // Depois deleta o cliente
      await connection.query('DELETE FROM clientes WHERE id = ?', [id]);
      
      connection.release();
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar cliente: ${error.message}`);
    }
  }
}

module.exports = Cliente;
