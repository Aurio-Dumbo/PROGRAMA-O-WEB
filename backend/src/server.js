// Servidor principal - Configuração do Express e inicialização da aplicação
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Configuração de middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Importa as rotas
const clienteRoutes = require('./routes/clienteRoutes');
const atendimentoRoutes = require('./routes/atendimentoRoutes');
const AtendimentoController = require('./controllers/AtendimentoController');

// Define os prefixos das rotas
app.use('/api/clientes', clienteRoutes);
app.use('/api/clientes/:clienteId/atendimentos', atendimentoRoutes);

// Rota para buscar todos os atendimentos com paginação
app.get('/api/atendimentos', AtendimentoController.buscarTodos);

// Rota padrão para servir o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Tratamento de erro para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ sucesso: false, erro: 'Rota não encontrada' });
});

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
