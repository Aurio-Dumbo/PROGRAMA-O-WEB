// Controller de Cliente - Lógica de negócio para operações com clientes
const Cliente = require('../models/Cliente');

class ClienteController {
  // Busca todos os clientes
  static async buscarTodos(req, res) {
    try {
      const clientes = await Cliente.buscarTodos();
      res.json({ sucesso: true, dados: clientes });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  }

  // Busca um cliente específico por ID
  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.buscarPorId(id);
      
      if (!cliente) {
        return res.status(404).json({ sucesso: false, erro: 'Cliente não encontrado' });
      }
      
      res.json({ sucesso: true, dados: cliente });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  }

  // Cria um novo cliente
  static async criar(req, res) {
    try {
      const { nome, email, telefone, endereco } = req.body;

      // Valida dados obrigatórios
      if (!nome || !email || !telefone) {
        return res.status(400).json({ 
          sucesso: false, 
          erro: 'Nome, email e telefone são obrigatórios' 
        });
      }

      const id = await Cliente.criar({ nome, email, telefone, endereco });
      res.status(201).json({ sucesso: true, id, mensagem: 'Cliente criado com sucesso' });
    } catch (error) {
      // Eu loggo o erro no servidor para facilitar debug
      console.error('Erro ao criar cliente no banco:', error);
      
      // Eu valido se é erro de conexão com o banco
      if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
        return res.status(503).json({ 
          sucesso: false, 
          erro: 'Erro de conexão com o banco de dados. Verifique se MySQL está rodando.' 
        });
      }
      
      res.status(500).json({ 
        sucesso: false, 
        erro: error.message || 'Erro ao criar cliente' 
      });
    }
  }

  // Atualiza dados de um cliente
  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, telefone, endereco } = req.body;

      const clienteExiste = await Cliente.buscarPorId(id);
      if (!clienteExiste) {
        return res.status(404).json({ sucesso: false, erro: 'Cliente não encontrado' });
      }

      await Cliente.atualizar(id, { nome, email, telefone, endereco });
      res.json({ sucesso: true, mensagem: 'Cliente atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  }

  // Deleta um cliente
  static async deletar(req, res) {
    try {
      const { id } = req.params;

      const clienteExiste = await Cliente.buscarPorId(id);
      if (!clienteExiste) {
        return res.status(404).json({ sucesso: false, erro: 'Cliente não encontrado' });
      }

      await Cliente.deletar(id);
      res.json({ sucesso: true, mensagem: 'Cliente deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  }
}

module.exports = ClienteController;
