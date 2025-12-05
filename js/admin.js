// js/admin.js

// --- Referências aos elementos do DOM (HTML) ---
const form = document.getElementById('form-admin');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const listaUsuarios = document.getElementById('lista-usuarios');
const campoPesquisa = document.getElementById('pesquisa');

// Chave para salvar os dados no navegador
const STORAGE_KEY = 'projetoweb_usuarios';

// 1. Evento: Carregar dados ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarLista();
});

// 2. Evento: Cadastrar Usuário (Enviar Formulário)
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Impede a página de recarregar

    const nome = nomeInput.value;
    const email = emailInput.value;

    // Gera a data e hora atual formatada (pt-BR)
    const dataAtual = new Date().toLocaleString('pt-BR');

    // Cria o objeto do usuário conforme pedido no projeto
    const novoUsuario = {
        nome: nome,
        email: email,
        data: dataAtual
    };

    // Recupera a lista atual do Local Storage
    let usuarios = lerDados();

    // Adiciona o novo usuário ao final da lista
    usuarios.push(novoUsuario);

    // Salva a lista atualizada
    salvarDados(usuarios);

    // Limpa o formulário e atualiza a tela
    limparFormulario();
    atualizarLista();

    alert('Usuário cadastrado com sucesso!');
});

// --- Funções Auxiliares ---

// 3. Função para Ler dados do Local Storage
function lerDados() {
    const dados = localStorage.getItem(STORAGE_KEY);
    // Se tiver dados, converte de JSON para Array. Se não, retorna Array vazio.
    return dados ? JSON.parse(dados) : [];
}

// 4. Função para Salvar dados no Local Storage
function salvarDados(dados) {
    // Converte o Array para JSON (texto) antes de salvar
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

// 5. Função para Atualizar a Lista na tela (Renderizar)
function atualizarLista(listaFiltrada = null) {
    // Se passarmos uma lista filtrada (pesquisa), usa ela. Se não, lê tudo do storage.
    const usuarios = listaFiltrada || lerDados();

    listaUsuarios.innerHTML = ''; // Limpa o HTML da lista atual

    // Verifica se a lista está vazia
    if (usuarios.length === 0) {
        // AQUI ESTÁ A ALTERAÇÃO: Usa a classe do CSS externo
        listaUsuarios.innerHTML = '<li class="empty-message">Nenhum registro encontrado.</li>';
        return;
    }

    // Cria um item <li> para cada usuário
    usuarios.forEach((usuario) => {
        const li = document.createElement('li');

        // Monta o HTML interno do item
        li.innerHTML = `
            <div class="user-info">
                <strong>Data:</strong> ${usuario.data}<br>
                <strong>Nome:</strong> ${usuario.nome}<br>
                <strong>E-mail:</strong> ${usuario.email}
            </div>
            <button class="btn-excluir" onclick="excluirUsuario('${usuario.email}')">Excluir</button>
        `;

        listaUsuarios.appendChild(li);
    });
}

// 6. Função para Limpar Campos do Formulário
function limparFormulario() {
    nomeInput.value = '';
    emailInput.value = '';
    nomeInput.focus(); // Coloca o cursor de volta no campo nome
}

// 7. Função para Excluir um item específico
function excluirUsuario(emailParaDeletar) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        let usuarios = lerDados();

        // Filtra a lista mantendo apenas quem tem e-mail DIFERENTE do excluído
        usuarios = usuarios.filter(user => user.email !== emailParaDeletar);

        salvarDados(usuarios);
        atualizarLista(); // Atualiza a tela

        // Se estivermos no meio de uma pesquisa, refaz o filtro visualmente
        if (campoPesquisa.value !== '') {
            pesquisarUsuario();
        }
    }
}

// 8. Função para Excluir TODOS os itens
function limparTudo() {
    // Verifica se existem dados antes de perguntar
    if (lerDados().length === 0) {
        alert("A lista já está vazia.");
        return;
    }

    if (confirm('ATENÇÃO: Isso apagará TODOS os cadastros permanentemente. Deseja continuar?')) {
        localStorage.removeItem(STORAGE_KEY); // Remove a chave inteira
        atualizarLista();
        alert('Todos os dados foram excluídos.');
    }
}

// 9. Função de Pesquisa
function pesquisarUsuario() {
    const termo = campoPesquisa.value.toLowerCase();
    const usuarios = lerDados();

    // Filtra usuários cujo nome OU email contenham o termo digitado
    const resultados = usuarios.filter(user => {
        return user.nome.toLowerCase().includes(termo) ||
            user.email.toLowerCase().includes(termo);
    });

    // Atualiza a lista passando apenas os resultados filtrados
    atualizarLista(resultados);
}