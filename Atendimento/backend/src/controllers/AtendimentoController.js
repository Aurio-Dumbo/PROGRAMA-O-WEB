// Controller de Atendimento - Lógica de negócio para operações com atendimentos
const Atendimento = require('../models/Atendimento');
const Cliente = require('../models/Cliente');

class AtendimentoController {
  // Eu busco todos os atendimentos com paginação
  static async buscarTodos(req, res) {
    try {
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = parseInt(req.query.limite) || 10;

      if (pagina < 1) {
        return res.status(400).json({ 
          sucesso: false, 
          erro: 'Página deve ser maior que 0' 
        });
      }

      const resultado = await Atendimento.buscarTodos(pagina, limite);
      res.json({ sucesso: true, dados: resultado });
    } catch (error) {
      console.error('Erro ao buscar atendimentos:', error);
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  }

  // usco todos os atendimentos de um cliente
  static async buscarPorCliente(req, res) {
    try {
      const { clienteId } = req.params;

      // Eu valido se o cliente existe
      const cliente = await Cliente.buscarPorId(clienteId);
      if (!cliente) {
        return res.status(404).json({ sucesso: false, erro: 'Cliente não encontrado' });
      }

      const atendimentos = await Atendimento.buscarPorCliente(clienteId);
      res.json({ sucesso: true, dados: atendimentos });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  }

  // Eu crio um novo atendimento para um cliente
  static async criar(req, res) {
    try {
      const { clienteId } = req.params;
      const { descricao, status } = req.body;

      // Eu valido se o cliente existe
      const cliente = await Cliente.buscarPorId(clienteId);
      if (!cliente) {
        return res.status(404).json({ sucesso: false, erro: 'Cliente não encontrado' });
      }

      // Eu valido descrição obrigatória
      if (!descricao) {
        return res.status(400).json({ 
          sucesso: false, 
          erro: 'Descrição do atendimento é obrigatória' 
        });
      }

      const id = await Atendimento.criar({ 
        cliente_id: clienteId, 
        descricao, 
        status 
      });

      res.status(201).json({ 
        sucesso: true, 
        id, 
        mensagem: 'Atendimento criado com sucesso' 
      });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  }

  // Eu atualizo um atendimento existente
  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { descricao, status } = req.body;

      await Atendimento.atualizar(id, { descricao, status });
      res.json({ sucesso: true, mensagem: 'Atendimento atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  }

  // Eu deleto um atendimento
  static async deletar(req, res) {
    try {
      const { id } = req.params;

      await Atendimento.deletar(id);
      res.json({ sucesso: true, mensagem: 'Atendimento deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  }
}

module.exports = AtendimentoController;
