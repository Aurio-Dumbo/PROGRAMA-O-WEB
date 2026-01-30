// Script Principal - Gerencia navegação entre telas

//  carrego a tela quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // carrego a tela padrão (clientes)
  carregarTela('clientes');
});

// carrego uma tela específica
async function carregarTela(nomeTela) {
  // atualizo os botões de navegação
  document.getElementById('btnClientes').classList.remove('active');
  document.getElementById('btnAtendimentos').classList.remove('active');

  try {
    if (nomeTela === 'clientes') {
      document.getElementById('btnClientes').classList.add('active');
      await carregarTelaClientes();
    } else if (nomeTela === 'atendimentos') {
      document.getElementById('btnAtendimentos').classList.add('active');
      await carregarTelaAtendimentos();
    }
  } catch (erro) {
    console.error(`Erro ao carregar tela ${nomeTela}:`, erro);
    exibirAlerta('Erro ao carregar tela', 'danger');
  }
}
