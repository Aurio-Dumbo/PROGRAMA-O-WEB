// Arquivo de Utilitários - Funções auxiliares da aplicação

// exibo mensagens de alerta na tela
function exibirAlerta(mensagem, tipo = 'success') {
  const alerta = document.getElementById('alerta');
  alerta.textContent = mensagem;
  alerta.className = `alert alert-custom alert-${tipo}`;
  alerta.style.display = 'block';
  
  // Eu escondo o alerta após 4 segundos
  setTimeout(() => {
    alerta.style.display = 'none';
  }, 4000);
}

// exibo ou escondo o spinner de carregamento
function mostrarCarregando(mostrar = true, container = 'telasContainer') {
  // Eu busco ou crio o spinner
  let spinner = document.getElementById('spinnerCarregamento');
  
  if (!spinner) {
    spinner = document.createElement('div');
    spinner.id = 'spinnerCarregamento';
    spinner.className = 'spinner-loading ativo';
    spinner.innerHTML = `
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    `;
    document.getElementById(container).appendChild(spinner);
  }
  
  if (mostrar) {
    spinner.classList.add('ativo');
  } else {
    spinner.classList.remove('ativo');
  }
}

//  formato uma data para o padrão brasileiro
function formatarData(data) {
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

// retorna a cor do badge baseada no status
function obterCorStatus(status) {
  const cores = {
    'aberto': 'bg-danger',
    'em_andamento': 'bg-warning text-dark',
    'fechado': 'bg-success'
  };
  return cores[status] || 'bg-secondary';
}

// traduz o status para português
function traduzirStatus(status) {
  const traducoes = {
    'aberto': 'Aberto',
    'em_andamento': 'Em Andamento',
    'fechado': 'Fechado'
  };
  return traducoes[status] || status;
}

// valida um email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

//u valida um telefone (básico)
function validarTelefone(telefone) {
  const regex = /^[\d\s\(\)\-\+]{10,}$/;
  return regex.test(telefone);
}

// Eu limpa um formulário
function limparFormulario(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
  }
}

//  crio um modal de confirmação
function confirmar(mensagem) {
  return new Promise((resolve) => {
    document.getElementById('mensagemConfirmar').textContent = mensagem;
    
    const modal = new bootstrap.Modal(document.getElementById('modalConfirmar'));
    
    const btnSim = document.getElementById('btnConfirmarSim');
    const btnNao = document.getElementById('btnConfirmarNao');
    
    // Remover listeners anteriores para evitar duplicação
    btnSim.replaceWith(btnSim.cloneNode(true));
    btnNao.replaceWith(btnNao.cloneNode(true));
    
    const newBtnSim = document.getElementById('btnConfirmarSim');
    const newBtnNao = document.getElementById('btnConfirmarNao');
    
    newBtnSim.addEventListener('click', () => {
      modal.hide();
      resolve(true);
    });
    
    newBtnNao.addEventListener('click', () => {
      modal.hide();
      resolve(false);
    });
    
    modal.show();
  });
}
