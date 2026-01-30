// Rotas de Atendimento - Define os endpoints para gerenciar atendimentos de clientes
const express = require('express');
const router = express.Router({ mergeParams: true });
const AtendimentoController = require('../controllers/AtendimentoController');

// GET - Busca todos os atendimentos de um cliente
router.get('/', AtendimentoController.buscarPorCliente);

// POST - Cria um novo atendimento
router.post('/', AtendimentoController.criar);

// PUT - Atualiza um atendimento
router.put('/:id', AtendimentoController.atualizar);

// DELETE - Deleta um atendimento
router.delete('/:id', AtendimentoController.deletar);

module.exports = router;
