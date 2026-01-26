// Rotas de Cliente - Define os endpoints para operações CRUD
const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');

// GET - Busca todos os clientes
router.get('/', ClienteController.buscarTodos);

// GET - Busca um cliente específico
router.get('/:id', ClienteController.buscarPorId);

// POST - Cria um novo cliente
router.post('/', ClienteController.criar);

// PUT - Atualiza um cliente
router.put('/:id', ClienteController.atualizar);

// DELETE - Deleta um cliente
router.delete('/:id', ClienteController.deletar);

module.exports = router;
