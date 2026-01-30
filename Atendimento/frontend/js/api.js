// Módulo de API - Gerencia todas as requisições ao backend

//  defino a URL base da API
const API_URL = 'http://localhost:3001/api';

// faço uma requisição GET para a API
async function apiGet(rota) {
  try {
    const resposta = await fetch(`${API_URL}${rota}`);
    const dados = await resposta.json();
    
    if (!resposta.ok) {
      throw new Error(dados.erro || 'Erro na requisição');
    }
    
    return dados;
  } catch (erro) {
    exibirAlerta(`Erro: ${erro.message}`, 'danger');
    throw erro;
  }
}

// Eu faço uma requisição POST para a API
async function apiPost(rota, corpo) {
  try {
    const resposta = await fetch(`${API_URL}${rota}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(corpo)
    });
    
    const dados = await resposta.json();
    
    if (!resposta.ok) {
      throw new Error(dados.erro || 'Erro ao adicionar');
    }
    
    return dados;
  } catch (erro) {
    exibirAlerta(`Erro: ${erro.message}`, 'danger');
    throw erro;
  }
}

// Eu faço uma requisição PUT para a API
async function apiPut(rota, corpo) {
  try {
    const resposta = await fetch(`${API_URL}${rota}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(corpo)
    });
    
    const dados = await resposta.json();
    
    if (!resposta.ok) {
      throw new Error(dados.erro || 'Erro ao atualizar');
    }
    
    return dados;
  } catch (erro) {
    exibirAlerta(`Erro: ${erro.message}`, 'danger');
    throw erro;
  }
}

// faço uma requisição DELETE para a API
async function apiDelete(rota) {
  try {
    const resposta = await fetch(`${API_URL}${rota}`, {
      method: 'DELETE'
    });
    
    const dados = await resposta.json();
    
    if (!resposta.ok) {
      throw new Error(dados.erro || 'Erro ao deletar');
    }
    
    return dados;
  } catch (erro) {
    exibirAlerta(`Erro: ${erro.message}`, 'danger');
    throw erro;
  }
}

// busco todos os clientes
async function buscarClientes() {
  return apiGet('/clientes');
}

//  busco um cliente específico
async function buscarCliente(id) {
  return apiGet(`/clientes/${id}`);
}

// crio um novo cliente
async function criarCliente(cliente) {
  return apiPost('/clientes', cliente);
}

// atualizo um cliente
async function atualizarCliente(id, cliente) {
  return apiPut(`/clientes/${id}`, cliente);
}

// deleto um cliente
async function deletarCliente(id) {
  return apiDelete(`/clientes/${id}`);
}

// busco atendimentos de um cliente
async function buscarAtendimentos(clienteId) {
  return apiGet(`/clientes/${clienteId}/atendimentos`);
}

// busco todos os atendimentos com paginação
async function buscarAtendimentosTodos(pagina = 1, limite = 10) {
  return apiGet(`/atendimentos?pagina=${pagina}&limite=${limite}`);
}

// rio um novo atendimento
async function criarAtendimento(clienteId, atendimento) {
  return apiPost(`/clientes/${clienteId}/atendimentos`, atendimento);
}

// atualizo um atendimento
async function atualizarAtendimento(clienteId, atendimentoId, atendimento) {
  return apiPut(`/clientes/${clienteId}/atendimentos/${atendimentoId}`, atendimento);
}

// eleto um atendimento
async function deletarAtendimento(clienteId, atendimentoId) {
  return apiDelete(`/clientes/${clienteId}/atendimentos/${atendimentoId}`);
}
