// Página de Clientes - Gerencia registro e listagem de clientes

// Eu renderizo a página de clientes
function renderizarTelaClientes() {
  const html = `
    <div id="telaClientes">
      <div class="row">
        <div class="col-12">
          <h2 class="titulo-secao">
            <i class="fas fa-address-book"></i> Registro de Clientes
          </h2>
        </div>
      </div>

      <!-- Formulário de novo cliente -->
      <div class="row">
        <div class="col-lg-8 offset-lg-2">
          <div class="formulario">
            <h4 class="mb-4">
              <i class="fas fa-user-plus"></i> Adicionar Novo Cliente
            </h4>
            <form id="formularioCliente">
              <div class="row">
                <div class="col-md-12 mb-3">
                  <label for="nomeCliente" class="form-label">Nome Completo</label>
                  <input type="text" class="form-control" id="nomeCliente" placeholder="Digite o nome do cliente" required>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="emailCliente" class="form-label">Email</label>
                  <input type="email" class="form-control" id="emailCliente" placeholder="email@exemplo.com" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="telefoneCliente" class="form-label">Telefone</label>
                  <input type="tel" class="form-control" id="telefoneCliente" placeholder="923 456 789" required>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12 mb-3">
                  <label for="enderecoCliente" class="form-label">Endereço</label>
                  <input type="text" class="form-control" id="enderecoCliente" placeholder="Rua, número, complemento">
                </div>
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-save"></i> Adicionar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Lista de clientes -->
      <div id="listaClientes" class="row mt-4"></div>

      <!-- Modal de edição de cliente -->
      <div class="modal fade" id="modalEditarCliente" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Editar Cliente</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="formularioEditarCliente">
                <input type="hidden" id="clienteIdEditar">
                <div class="mb-3">
                  <label for="nomeClienteEditar" class="form-label">Nome Completo</label>
                  <input type="text" class="form-control" id="nomeClienteEditar" required>
                </div>
                <div class="mb-3">
                  <label for="emailClienteEditar" class="form-label">Email</label>
                  <input type="email" class="form-control" id="emailClienteEditar" required>
                </div>
                <div class="mb-3">
                  <label for="telefoneClienteEditar" class="form-label">Telefone</label>
                  <input type="tel" class="form-control" id="telefoneClienteEditar" required>
                </div>
                <div class="mb-3">
                  <label for="enderecoClienteEditar" class="form-label">Endereço</label>
                  <input type="text" class="form-control" id="enderecoClienteEditar">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnSalvarEdicao">Salvar Alterações</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return html;
}

// Eu carrego a página de clientes
async function carregarTelaClientes() {
  const container = document.getElementById('telasContainer');
  container.innerHTML = renderizarTelaClientes();
  
  // Eu busco e renderizo os clientes
  await carregarClientes();
  
  // Eu configuro os event listeners
  document.getElementById('formularioCliente').addEventListener('submit', handleAdicionarCliente);
  document.getElementById('btnSalvarEdicao').addEventListener('click', handleSalvarEdicao);
}

// Eu carrego todos os clientes do backend
async function carregarClientes() {
  mostrarCarregando(true, 'listaClientes');
  
  try {
    const resultado = await buscarClientes();
    
    if (!resultado.sucesso || !resultado.dados || resultado.dados.length === 0) {
      document.getElementById('listaClientes').innerHTML = '<div class="col-12"><p class="text-center text-muted">Nenhum cliente registrado.</p></div>';
      return;
    }

    // Eu renderizo cada cliente como um card
    document.getElementById('listaClientes').innerHTML = resultado.dados.map(cliente => `
      <div class="col-lg-6 col-md-12">
        <div class="card card-cliente">
          <div class="card-header d-flex justify-content-between align-items-center">
            <strong>${cliente.nome}</strong>
            <span class="badge bg-info">#${cliente.id}</span>
          </div>
          <div class="card-body">
            <p><strong>Email:</strong> ${cliente.email}</p>
            <p><strong>Telefone:</strong> ${cliente.telefone}</p>
            <p><strong>Endereço:</strong> ${cliente.endereco || 'Não informado'}</p>
            <div class="d-flex flex-wrap gap-2 mt-3">
              <button class="btn btn-sm btn-info btn-acao" onclick="abrirAtendimentos(${cliente.id}, '${cliente.nome}')">
                <i class="fas fa-clipboard-list"></i> Atendimentos
              </button>
              <button class="btn btn-sm btn-warning btn-acao" onclick="abrirEdicaoCliente(${cliente.id})">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="btn btn-sm btn-danger btn-acao" onclick="deletarClienteConfirm(${cliente.id}, '${cliente.nome}')">
                <i class="fas fa-trash"></i> Deletar
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (erro) {
    console.error('Erro ao carregar clientes:', erro);
  } finally {
    mostrarCarregando(false, 'listaClientes');
  }
}

// Eu handle o formulário de adicionar cliente
async function handleAdicionarCliente(e) {
  e.preventDefault();

  const nome = document.getElementById('nomeCliente').value.trim();
  const email = document.getElementById('emailCliente').value.trim();
  const telefone = document.getElementById('telefoneCliente').value.trim();
  const endereco = document.getElementById('enderecoCliente').value.trim();

  // Eu valido os campos
  if (!nome || !email || !telefone) {
    exibirAlerta('Preencha todos os campos obrigatórios', 'warning');
    return;
  }

  if (!validarEmail(email)) {
    exibirAlerta('Email inválido', 'warning');
    return;
  }

  mostrarCarregando(true);
  
  try {
    await criarCliente({ nome, email, telefone, endereco });
    exibirAlerta('Cliente adicionado com sucesso!', 'success');
    
    // Eu limpo e recarrego
    limparFormulario('formularioCliente');
    await carregarClientes();
  } catch (erro) {
    console.error('Erro ao adicionar cliente:', erro);
  } finally {
    mostrarCarregando(false);
  }
}

// Eu abro o modal de edição
async function abrirEdicaoCliente(clienteId) {
  try {
    mostrarCarregando(true);
    
    const resultado = await buscarCliente(clienteId);
    
    if (!resultado.sucesso) {
      exibirAlerta('Erro ao carregar dados do cliente', 'danger');
      return;
    }

    const cliente = resultado.dados;

    // Eu preencho o formulário
    document.getElementById('clienteIdEditar').value = clienteId;
    document.getElementById('nomeClienteEditar').value = cliente.nome;
    document.getElementById('emailClienteEditar').value = cliente.email;
    document.getElementById('telefoneClienteEditar').value = cliente.telefone;
    document.getElementById('enderecoClienteEditar').value = cliente.endereco || '';

    // Eu abro o modal
    const modal = new bootstrap.Modal(document.getElementById('modalEditarCliente'));
    modal.show();
  } catch (erro) {
    console.error('Erro ao abrir edição:', erro);
  } finally {
    mostrarCarregando(false);
  }
}

// Eu salvo a edição do cliente
async function handleSalvarEdicao() {
  const clienteId = document.getElementById('clienteIdEditar').value;

  mostrarCarregando(true);
  
  try {
    await atualizarCliente(clienteId, {
      nome: document.getElementById('nomeClienteEditar').value.trim(),
      email: document.getElementById('emailClienteEditar').value.trim(),
      telefone: document.getElementById('telefoneClienteEditar').value.trim(),
      endereco: document.getElementById('enderecoClienteEditar').value.trim()
    });

    exibirAlerta('Cliente atualizado com sucesso!', 'success');
    
    // Eu fecho o modal e recarrego
    bootstrap.Modal.getInstance(document.getElementById('modalEditarCliente')).hide();
    await carregarClientes();
  } catch (erro) {
    console.error('Erro ao salvar edição:', erro);
  } finally {
    mostrarCarregando(false);
  }
}

// Eu deleto um cliente
async function deletarClienteConfirm(clienteId, nomeCliente) {
  if (!confirmar(`Deseja realmente deletar o cliente "${nomeCliente}"? Todos os seus atendimentos também serão removidos.`)) {
    return;
  }

  mostrarCarregando(true);
  
  try {
    await deletarCliente(clienteId);
    exibirAlerta('Cliente deletado com sucesso!', 'success');
    await carregarClientes();
  } catch (erro) {
    console.error('Erro ao deletar cliente:', erro);
  } finally {
    mostrarCarregando(false);
  }
}
