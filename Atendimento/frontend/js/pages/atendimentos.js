// Página de Atendimentos - Gerencia registro e listagem de atendimentos

// Eu armazeno dados da sessão de atendimentos
let atendimentosData = {
  clienteId: null,
  nomeCliente: null,
  modo: 'geral', // 'geral' para atendimentos recentes ou 'cliente' para atendimentos específicos
  paginaGeral: 1,
  limitePorPagina: 10,
  totalPaginasGeral: 1,
  totalAtendimentosGeral: 0
};

// Eu abro a página de atendimentos e seleciono um cliente específico
async function abrirAtendimentos(clienteId, nomeCliente) {
  // Primeiro carrego a tela de atendimentos
  await carregarTelaAtendimentos();
  
  // Depois mudo para modo cliente
  document.getElementById('seletorCliente').value = clienteId;
  
  // E carrego os dados do cliente
  atendimentosData.clienteId = clienteId;
  atendimentosData.nomeCliente = nomeCliente;
  atendimentosData.modo = 'cliente';
  atendimentosData.paginaGeral = 1;
  
  document.getElementById('nomeClienteAtend').textContent = nomeCliente;
  document.getElementById('containerAtendimentos').style.display = 'block';
  document.getElementById('containerAtendimentosGerais').style.display = 'none';
  
  // Limpo o formulário
  limparFormulario('formularioNovoAtendimento');
  
  // Carrego os atendimentos do cliente
  await carregarAtendimentosLista();
}

// renderizo a página de atendimentos
function renderizarTelaAtendimentos() {
  const html = `
    <div id="telaAtendimentos">
      <div class="row">
        <div class="col-12">
          <h2 class="titulo-secao">
            <i class="fas fa-calendar-check"></i> Registros de Atendimento
          </h2>
        </div>
      </div>

      <!-- Container de atendimentos gerais (recentes) -->
      <div id="containerAtendimentosGerais">
        <div class="row">
          <div class="col-lg-10 offset-lg-1">
            <h4 class="titulo-secao mb-4">
              <i class="fas fa-history"></i> Atendimentos Recentes
            </h4>
            <button class="btn btn-primary mb-4" onclick="mostrarSeletorCliente()">
              <i class="fas fa-filter"></i> Filtrar por Cliente
            </button>
            <div id="listaAtendimentosGeraisContainer"></div>
            
            <!-- Controles de paginação -->
            <nav aria-label="Paginação de atendimentos" id="paginacaoGeral" style="display: none;">
              <ul class="pagination justify-content-center mt-4">
                <li class="page-item" id="btnAnterior">
                  <button class="page-link" onclick="irParaPagina(-1)">Anterior</button>
                </li>
                <li class="page-item active">
                  <span class="page-link">
                    Página <span id="paginaAtual">1</span> de <span id="totalPaginas">1</span>
                  </span>
                </li>
                <li class="page-item" id="btnProximo">
                  <button class="page-link" onclick="irParaPagina(1)">Próximo</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <!-- Seletor de cliente (início oculto) -->
      <div class="row" id="seletorClienteContainer" style="display: none;">
        <div class="col-lg-8 offset-lg-2">
          <div class="formulario">
            <h4 class="mb-4">
              <i class="fas fa-search"></i> Selecione um Cliente
            </h4>
            <div class="mb-3">
              <select class="form-select" id="seletorCliente" onchange="selecionarClienteAtendimentos()">
                <option value="">-- Escolha um cliente --</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Container para formulário e listagem de atendimentos específicos de cliente -->
      <div id="containerAtendimentos" style="display: none;">
        <!-- Formulário de novo atendimento -->
        <div class="row">
          <div class="col-lg-8 offset-lg-2">
            <div class="formulario">
              <h4 class="mb-4">
                <i class="fas fa-plus-circle"></i> Novo Atendimento
              </h4>
              <form id="formularioNovoAtendimento">
                <div class="mb-3">
                  <label for="descricaoAtendimento" class="form-label">Descrição</label>
                  <textarea class="form-control" id="descricaoAtendimento" rows="4" placeholder="Descreva o atendimento" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="statusAtendimento" class="form-label">Status</label>
                  <select class="form-select" id="statusAtendimento">
                    <option value="aberto">Aberto</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="fechado">Fechado</option>
                  </select>
                </div>
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-success">
                    <i class="fas fa-save"></i> Registrar Atendimento
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Lista de atendimentos -->
        <div class="row">
          <div class="col-lg-10 offset-lg-1">
            <h4 class="titulo-secao mt-5">
              <i class="fas fa-list"></i> Atendimentos de <span id="nomeClienteAtend"></span>
            </h4>
            <div id="listaAtendimentosContainer"></div>
            <button class="btn btn-secondary mt-3" onclick="voltarParaAtendimentosGerais()">
              <i class="fas fa-arrow-left"></i> Voltar
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de edição de atendimento -->
      <div class="modal fade" id="modalEditarAtendimento" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Editar Atendimento</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="formularioEditarAtendimento">
                <input type="hidden" id="atendimentoIdEditar">
                <div class="mb-3">
                  <label for="descricaoAtendimentoEditar" class="form-label">Descrição</label>
                  <textarea class="form-control" id="descricaoAtendimentoEditar" rows="4" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="statusAtendimentoEditar" class="form-label">Status</label>
                  <select class="form-select" id="statusAtendimentoEditar">
                    <option value="aberto">Aberto</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="fechado">Fechado</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnSalvarAtendimento">Salvar Alterações</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return html;
}

// Eu carrego a página de atendimentos
async function carregarTelaAtendimentos() {
  const container = document.getElementById('telasContainer');
  container.innerHTML = renderizarTelaAtendimentos();
  
  // Eu carrego a lista de clientes no seletor
  await carregarClientesSeletor();
  
  // Eu carrego os atendimentos gerais (recentes)
  await carregarAtendimentosGerais();
  
  // Eu configuro os event listeners
  document.getElementById('formularioNovoAtendimento').addEventListener('submit', handleAdicionarAtendimento);
  document.getElementById('btnSalvarAtendimento').addEventListener('click', handleSalvarAtendimento);
}

// Eu carrego os clientes no seletor
async function carregarClientesSeletor() {
  try {
    const resultado = await buscarClientes();
    
    if (!resultado.sucesso || !resultado.dados) {
      exibirAlerta('Nenhum cliente disponível', 'warning');
      return;
    }

    const seletor = document.getElementById('seletorCliente');
    const options = resultado.dados.map(cliente => 
      `<option value="${cliente.id}">${cliente.nome}</option>`
    ).join('');
    
    seletor.innerHTML = '<option value="">-- Escolha um cliente --</option>' + options;
  } catch (erro) {
    console.error('Erro ao carregar clientes:', erro);
  }
}

//  carrego os atendimentos gerais (recentes) com paginação
async function carregarAtendimentosGerais() {
  mostrarCarregando(true, 'listaAtendimentosGeraisContainer');
  
  try {
    const resultado = await buscarAtendimentosTodos(atendimentosData.paginaGeral, atendimentosData.limitePorPagina);
    
    if (!resultado.sucesso || !resultado.dados.atendimentos || resultado.dados.atendimentos.length === 0) {
      document.getElementById('listaAtendimentosGeraisContainer').innerHTML = 
        '<p class="text-muted text-center">Nenhum atendimento registrado ainda.</p>';
      document.getElementById('paginacaoGeral').style.display = 'none';
      atendimentosData.totalPaginasGeral = 1;
      atendimentosData.totalAtendimentosGeral = 0;
      return;
    }

    // atualizo os dados de paginação
    atendimentosData.totalAtendimentosGeral = resultado.dados.total || 0;
    atendimentosData.totalPaginasGeral = resultado.dados.totalPaginas || 1;

    // renderizo cada atendimento
    document.getElementById('listaAtendimentosGeraisContainer').innerHTML = resultado.dados.atendimentos.map(atendimento => `
      <div class="card mb-3" data-atendimento-id="${atendimento.id}" data-cliente-id="${atendimento.cliente_id}">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 class="card-title mb-1">
                <strong>#${atendimento.id}</strong> - 
                <span class="text-muted">${atendimento.nome_cliente}</span>
              </h6>
              <small class="text-muted">${formatarData(atendimento.data_atendimento)}</small>
            </div>
            <span class="badge badge-status ${obterCorStatus(atendimento.status)}">
              ${traduzirStatus(atendimento.status)}
            </span>
          </div>
          <p class="card-text mb-3">${atendimento.descricao}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-warning" onclick="abrirEdicaoAtendimentoGeral(${atendimento.id}, '${atendimento.descricao.replace(/'/g, "\\'")}', '${atendimento.status}', ${atendimento.cliente_id})">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger" onclick="deletarAtendimentoGeral(${atendimento.id}, ${atendimento.cliente_id})">
              <i class="fas fa-trash"></i> Deletar
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Eu atualizo a paginação
    atualizarPaginacao();
  } catch (erro) {
    console.error('Erro ao carregar atendimentos gerais:', erro);
    exibirAlerta('Erro ao carregar atendimentos', 'danger');
  } finally {
    mostrarCarregando(false, 'listaAtendimentosGeraisContainer');
  }
}

//  atualizo a exibição dos controles de paginação
function atualizarPaginacao() {
  const paginacaoGeral = document.getElementById('paginacaoGeral');
  const btnAnterior = document.getElementById('btnAnterior');
  const btnProximo = document.getElementById('btnProximo');
  const paginaAtual = document.getElementById('paginaAtual');
  const totalPaginas = document.getElementById('totalPaginas');
  
  paginaAtual.textContent = atendimentosData.paginaGeral;
  totalPaginas.textContent = atendimentosData.totalPaginasGeral;
  
  //  mostro ou escondo os botões baseado na página
  if (atendimentosData.totalPaginasGeral > 1) {
    paginacaoGeral.style.display = 'block';
    btnAnterior.style.display = atendimentosData.paginaGeral > 1 ? 'block' : 'none';
    btnProximo.style.display = atendimentosData.paginaGeral < atendimentosData.totalPaginasGeral ? 'block' : 'none';
  } else {
    paginacaoGeral.style.display = 'none';
  }
}

// navegue entre páginas
async function irParaPagina(direcao) {
  const novaPagina = atendimentosData.paginaGeral + direcao;
  
  if (novaPagina < 1 || novaPagina > atendimentosData.totalPaginasGeral) {
    return;
  }
  
  atendimentosData.paginaGeral = novaPagina;
  await carregarAtendimentosGerais();
  

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarSeletorCliente() {
  document.getElementById('seletorClienteContainer').style.display = 'block';
  document.getElementById('seletorClienteContainer').scrollIntoView({ behavior: 'smooth' });
}

// E para os atendimentos gerais
function voltarParaAtendimentosGerais() {
  atendimentosData.modo = 'geral';
  atendimentosData.clienteId = null;
  atendimentosData.nomeCliente = null;
  document.getElementById('containerAtendimentos').style.display = 'none';
  document.getElementById('containerAtendimentosGerais').style.display = 'block';
  document.getElementById('seletorClienteContainer').style.display = 'none';
  document.getElementById('seletorCliente').value = '';
}

// um cliente e carrego seus atendimentos
async function selecionarClienteAtendimentos() {
  const seletor = document.getElementById('seletorCliente');
  const clienteId = seletor.value;

  if (!clienteId) {
    document.getElementById('containerAtendimentos').style.display = 'none';
    return;
  }

  // busco o nome do cliente
  try {
    const resultado = await buscarCliente(clienteId);
    if (resultado.sucesso) {
      atendimentosData.clienteId = clienteId;
      atendimentosData.nomeCliente = resultado.dados.nome;
      atendimentosData.modo = 'cliente';
      
      document.getElementById('nomeClienteAtend').textContent = resultado.dados.nome;
      document.getElementById('containerAtendimentos').style.display = 'block';
      document.getElementById('containerAtendimentosGerais').style.display = 'none';
      document.getElementById('seletorClienteContainer').style.display = 'none';
      
      
      limparFormulario('formularioNovoAtendimento');
      
  
      await carregarAtendimentosLista();
    }
  } catch (erro) {
    console.error('Erro ao selecionar cliente:', erro);
  }
}

// carrego os atendimentos de um cliente
async function carregarAtendimentosLista() {
  if (!atendimentosData.clienteId) {
    return;
  }

  mostrarCarregando(true, 'listaAtendimentosContainer');
  
  try {
    const resultado = await buscarAtendimentos(atendimentosData.clienteId);
    
    if (!resultado.sucesso || resultado.dados.length === 0) {
      document.getElementById('listaAtendimentosContainer').innerHTML = 
        '<p class="text-muted text-center">Nenhum atendimento registrado para este cliente.</p>';
      return;
    }

    // Eu renderizo cada atendimento
    document.getElementById('listaAtendimentosContainer').innerHTML = resultado.dados.map(atendimento => `
      <div class="card mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h6 class="card-title mb-0">
              <strong>#${atendimento.id}</strong> - 
              ${formatarData(atendimento.data_atendimento)}
            </h6>
            <span class="badge badge-status ${obterCorStatus(atendimento.status)}">
              ${traduzirStatus(atendimento.status)}
            </span>
          </div>
          <p class="card-text mb-3">${atendimento.descricao}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-warning" onclick="abrirEdicaoAtendimento(${atendimento.id})">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger" onclick="deletarAtendimentoConfirm(${atendimento.id})">
              <i class="fas fa-trash"></i> Deletar
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (erro) {
    console.error('Erro ao carregar atendimentos:', erro);
  } finally {
    mostrarCarregando(false, 'listaAtendimentosContainer');
  }
}

// formulário de adicionar atendimento
async function handleAdicionarAtendimento(e) {
  e.preventDefault();

  const descricao = document.getElementById('descricaoAtendimento').value.trim();
  const status = document.getElementById('statusAtendimento').value;

  if (!descricao) {
    exibirAlerta('Preencha a descrição do atendimento', 'warning');
    return;
  }

  mostrarCarregando(true);
  
  try {
    await criarAtendimento(atendimentosData.clienteId, {
      descricao,
      status
    });

    exibirAlerta('Atendimento registrado com sucesso!', 'success');
    
    // Eu limpo e recarrego
    limparFormulario('formularioNovoAtendimento');
    await carregarAtendimentosLista();
  } catch (erro) {
    console.error('Erro ao adicionar atendimento:', erro);
  } finally {
    mostrarCarregando(false);
  }
}

// abro o modal de edição
async function abrirEdicaoAtendimento(atendimentoId) {
  // Eu busco o atendimento na lista visível para pegar dados
  const container = document.getElementById('listaAtendimentosContainer');
  const cards = container.querySelectorAll('.card');
  
  let atendimento = null;
  for (let card of cards) {
    const id = parseInt(card.querySelector('.card-title strong').textContent.replace('#', ''));
    if (id === atendimentoId) {
      atendimento = {
        id: id,
        descricao: card.querySelector('.card-text').textContent,
        status: Array.from(card.querySelector('.badge').classList).find(c => c.startsWith('bg-'))
      };
      break;
    }
  }

  if (atendimento) {
    document.getElementById('atendimentoIdEditar').value = atendimento.id;
    document.getElementById('descricaoAtendimentoEditar').value = atendimento.descricao;
    
    const modal = new bootstrap.Modal(document.getElementById('modalEditarAtendimento'));
    modal.show();
  }
}

// Eu salvo a edição do atendimento
async function handleSalvarAtendimento() {
  const atendimentoId = document.getElementById('atendimentoIdEditar').value;
  const descricao = document.getElementById('descricaoAtendimentoEditar').value.trim();
  const status = document.getElementById('statusAtendimentoEditar').value;

  mostrarCarregando(true);
  
  try {
    // Determino se estou editando atendimento geral ou de cliente específico
    if (atendimentosData.modo === 'geral') {
      // Preciso encontrar o cliente_id do atendimento
      const card = document.querySelector(`[data-atendimento-id="${atendimentoId}"]`);
      const clienteId = card ? card.getAttribute('data-cliente-id') : null;
      
      if (!clienteId) {
        throw new Error('Cliente não identificado');
      }
      
      await atualizarAtendimento(clienteId, atendimentoId, {
        descricao,
        status
      });
      
      exibirAlerta('Atendimento atualizado com sucesso!', 'success');
      bootstrap.Modal.getInstance(document.getElementById('modalEditarAtendimento')).hide();
      await carregarAtendimentosGerais();
    } else {
      // Modo cliente
      await atualizarAtendimento(atendimentosData.clienteId, atendimentoId, {
        descricao,
        status
      });

      exibirAlerta('Atendimento atualizado com sucesso!', 'success');
      bootstrap.Modal.getInstance(document.getElementById('modalEditarAtendimento')).hide();
      await carregarAtendimentosLista();
    }
  } catch (erro) {
    console.error('Erro ao salvar atendimento:', erro);
    exibirAlerta('Erro ao salvar atendimento', 'danger');
  } finally {
    mostrarCarregando(false);
  }
}

// Eu deleto um atendimento
async function deletarAtendimentoConfirm(atendimentoId) {
  if (!confirmar('Deseja realmente deletar este atendimento?')) {
    return;
  }

  mostrarCarregando(true);
  
  try {
    await deletarAtendimento(atendimentosData.clienteId, atendimentoId);
    exibirAlerta('Atendimento deletado com sucesso!', 'success');
    await carregarAtendimentosLista();
  } catch (erro) {
    console.error('Erro ao deletar atendimento:', erro);
  } finally {
    mostrarCarregando(false);
  }
}

// Eu abro o modal de edição para atendimento geral
async function abrirEdicaoAtendimentoGeral(atendimentoId, descricao, status, clienteId) {
  document.getElementById('atendimentoIdEditar').value = atendimentoId;
  document.getElementById('descricaoAtendimentoEditar').value = descricao;
  document.getElementById('statusAtendimentoEditar').value = status;
  
  // Armazeno o cliente_id em um atributo do modal
  document.getElementById('modalEditarAtendimento').setAttribute('data-cliente-id', clienteId);
  
  const modal = new bootstrap.Modal(document.getElementById('modalEditarAtendimento'));
  modal.show();
}

// Eu deleto um atendimento geral
async function deletarAtendimentoGeral(atendimentoId, clienteId) {
  if (!confirmar('Deseja realmente deletar este atendimento?')) {
    return;
  }

  mostrarCarregando(true);
  
  try {
    const resultado = await deletarAtendimento(clienteId, atendimentoId);
    
    if (resultado.sucesso) {
      exibirAlerta('Atendimento deletado com sucesso!', 'success');
      atendimentosData.paginaGeral = 1; // Volta para primeira página
      await carregarAtendimentosGerais();
    } else {
      throw new Error(resultado.mensagem || 'Erro ao deletar');
    }
  } catch (erro) {
    console.error('Erro ao deletar atendimento:', erro);
    exibirAlerta('Erro ao deletar atendimento: ' + erro.message, 'danger');
  } finally {
    mostrarCarregando(false);
  }
}
