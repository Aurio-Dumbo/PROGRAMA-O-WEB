// Modelo de Atendimento - Define estrutura e operações para registros de atendimento
const pool = require('../config/database');

class Atendimento {
  // busco todos os atendimentos de um cliente
  static async buscarPorCliente(clienteId) {
    try {
      const connection = await pool.getConnection();
      const [atendimentos] = await connection.query(
        'SELECT * FROM atendimentos WHERE cliente_id = ? ORDER BY data_atendimento DESC',
        [clienteId]
      );
      connection.release();
      return atendimentos;
    } catch (error) {
      throw new Error(`Erro ao buscar atendimentos: ${error.message}`);
    }
  }

  //  busco todos os atendimentos com paginação
  static async buscarTodos(pagina = 1, limite = 10) {
    try {
      const connection = await pool.getConnection();
      const offset = (pagina - 1) * limite;
      
      // Busco os atendimentos
      const [atendimentos] = await connection.query(
        `SELECT a.*, c.nome as nome_cliente FROM atendimentos a
         JOIN clientes c ON a.cliente_id = c.id
         ORDER BY a.data_atendimento DESC
         LIMIT ? OFFSET ?`,
        [limite, offset]
      );
      
      // Busco o total de atendimentos
      const [resultado] = await connection.query(
        'SELECT COUNT(*) as total FROM atendimentos'
      );
      
      connection.release();
      
      return {
        atendimentos,
        total: resultado[0].total,
        pagina,
        limite,
        totalPaginas: Math.ceil(resultado[0].total / limite)
      };
    } catch (error) {
      throw new Error(`Erro ao buscar atendimentos: ${error.message}`);
    }
  }

  // crio um novo atendimento para um cliente
  static async criar(dados) {
    try {
      const connection = await pool.getConnection();
      const { cliente_id, descricao, status } = dados;
      
      const [resultado] = await connection.query(
        'INSERT INTO atendimentos (cliente_id, descricao, status) VALUES (?, ?, ?)',
        [cliente_id, descricao, status || 'aberto']
      );
      
      connection.release();
      return resultado.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar atendimento: ${error.message}`);
    }
  }

  // Atualiza dados de um atendimento existente
  static async atualizar(id, dados) {
    try {
      const connection = await pool.getConnection();
      const { descricao, status } = dados;
      
      await connection.query(
        'UPDATE atendimentos SET descricao = ?, status = ? WHERE id = ?',
        [descricao, status, id]
      );
      
      connection.release();
      return true;
    } catch (error) {
      throw new Error(`Erro ao atualizar atendimento: ${error.message}`);
    }
  }

  // Deleta um atendimento
  static async deletar(id) {
    try {
      const connection = await pool.getConnection();
      await connection.query('DELETE FROM atendimentos WHERE id = ?', [id]);
      connection.release();
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar atendimento: ${error.message}`);
    }
  }
}

module.exports = Atendimento;
