console.log("Aula 10 - DOM iniciado");


let alunos = carregarDados(STORAGE_KEYS.alunos, alunosIniciais.map(aluno => ({ ...aluno })));
let cursos = carregarDados(STORAGE_KEYS.cursos, cursosIniciais.map(curso => ({ ...curso })));
let matriculas = carregarDados(STORAGE_KEYS.matriculas, matriculasIniciais.map(matricula => ({ ...matricula })));
let usuarios = carregarDados(STORAGE_KEYS.usuarios, usuariosIniciais.map(usuario => ({ ...usuario })));


if (localStorage.getItem(STORAGE_KEYS.alunos) === null) salvarDados(STORAGE_KEYS.alunos, alunos);
if (localStorage.getItem(STORAGE_KEYS.cursos) === null) salvarDados(STORAGE_KEYS.cursos, cursos);
if (localStorage.getItem(STORAGE_KEYS.matriculas) === null) salvarDados(STORAGE_KEYS.matriculas, matriculas);
if (localStorage.getItem(STORAGE_KEYS.usuarios) === null) salvarDados(STORAGE_KEYS.usuarios, usuarios);

const seletor = (css) => document.querySelector(css);

function criarParagrafo(rotulo, valor) {
    const p = document.createElement("p");
    p.textContent = `${rotulo}: ${valor}`;
    return p;
}


function atualizarDashboard() {
    const totalAlunos = seletor("#total-alunos");
    const totalCursos = seletor("#total-cursos");
    const totalMatriculas = seletor("#total-matriculas");
    const totalUsuarios = seletor("#total-usuarios");

    if (!totalAlunos || !totalCursos || !totalMatriculas || !totalUsuarios) return;

    totalAlunos.textContent = alunos.length;
    totalCursos.textContent = cursos.length;
    totalMatriculas.textContent = matriculas.length;
    totalUsuarios.textContent = usuarios.length;

    seletor("#alunos-ativos").textContent = alunos.filter(a => a.status === "ativo").length;
    seletor("#cursos-ativos").textContent = cursos.filter(c => c.ativo).length;
    seletor("#matriculas-ativas").textContent = matriculas.filter(m => m.status === "ativa").length;
    seletor("#usuarios-ativos").textContent = usuarios.filter(u => u.status === "ativo").length;
}


function classeStatus(status) {
    if (status === "ativo" || status === "ativa") return "status-ativo";
    if (status === "inativo" || status === "inativa") return "status-inativo";
    if (status === "trancado" || status === "trancada") return "status-trancado";
    return "";
}

function criarCardAluno(aluno, permitirRemocao = true) {
    const card = document.createElement("article");
    card.classList.add("card");
    card.dataset.id = String(aluno.id);

    const titulo = document.createElement("h3");
    titulo.textContent = aluno.nome;
    const email = criarParagrafo("E-mail", aluno.email);
    const curso = criarParagrafo("Curso", aluno.curso);
    const status = criarParagrafo("Status", aluno.status);
    const classe = classeStatus(aluno.status);
    if (classe) status.classList.add(classe);

    const acoes = document.createElement("div");
    acoes.classList.add("card-acoes");

    const detalhes = document.createElement("button");
    detalhes.type = "button";
    detalhes.textContent = "Ver detalhes";
    detalhes.addEventListener("click", () => exibirDetalhesAluno(aluno));
    acoes.append(detalhes);

    if (permitirRemocao) {
        const alterar = document.createElement("button");
        alterar.type = "button";
        alterar.textContent = "Alterar status";
        alterar.classList.add("botao-secundario");
        alterar.addEventListener("click", () => {
            const novoStatus = aluno.status === "ativo" ? "inativo" : "ativo";
            alterarStatusAluno(aluno.id, novoStatus);
        });

        const remover = document.createElement("button");
        remover.type = "button";
        remover.textContent = "Remover";
        remover.classList.add("botao-secundario");
        remover.addEventListener("click", () => removerAluno(aluno.id));
        acoes.append(alterar, remover);
    }

    card.append(titulo, email, curso, status, acoes);
    return card;
}

function renderizarAlunos(listaAlunos, destino = "#lista-alunos", permitirRemocao = true) {
    const lista = seletor(destino);
    if (!lista) return;

    lista.textContent = "";
    const mensagem = seletor("#mensagem-lista");

    if (listaAlunos.length === 0) {
        if (mensagem) {
            mensagem.textContent = "Nenhum aluno encontrado.";
            mensagem.className = "mensagem mensagem-aviso";
        }
        return;
    }

    if (mensagem) {
        mensagem.textContent = "";
        mensagem.className = "mensagem";
    }

    for (const aluno of listaAlunos) {
        lista.append(criarCardAluno(aluno, permitirRemocao));
    }
}

function renderizarCursos(listaCursos) {
    const lista = seletor("#lista-cursos");
    if (!lista) return;
    lista.textContent = "";

    for (const curso of listaCursos) {
        const card = document.createElement("article");
        card.classList.add("card");
        const titulo = document.createElement("h3");
        titulo.textContent = `${curso.sigla} — ${curso.nome}`;
        const status = criarParagrafo("Status", curso.ativo ? "ativo" : "inativo");
        status.classList.add(curso.ativo ? "status-ativo" : "status-inativo");
        card.append(titulo, status);
        lista.append(card);
    }
}

function renderizarMatriculas(listaMatriculas) {
    const lista = seletor("#lista-matriculas");
    if (!lista) return;
    lista.textContent = "";

    for (const matricula of listaMatriculas) {
        const card = document.createElement("article");
        card.classList.add("card");
        const titulo = document.createElement("h3");
        titulo.textContent = `Matrícula ${matricula.numero}`;
        const aluno = criarParagrafo("Aluno", matricula.aluno);
        const curso = criarParagrafo("Curso", matricula.curso);
        const status = criarParagrafo("Status", matricula.status);
        const classe = classeStatus(matricula.status);
        if (classe) status.classList.add(classe);
        card.append(titulo, aluno, curso, status);
        lista.append(card);
    }
}

function renderizarUsuarios(listaUsuarios) {
    const lista = seletor("#lista-usuarios");
    if (!lista) return;
    lista.textContent = "";

    for (const usuario of listaUsuarios) {
        const card = document.createElement("article");
        card.classList.add("card");
        const titulo = document.createElement("h3");
        titulo.textContent = usuario.nome;
        const perfil = criarParagrafo("Perfil", usuario.perfil);
        const status = criarParagrafo("Status", usuario.status);
        status.classList.add(usuario.status === "ativo" ? "status-ativo" : "status-inativo");
        card.append(titulo, perfil, status);
        lista.append(card);
    }
}


function exibirDetalhesAluno(aluno) {
    const nome = seletor("#detalhe-nome");
    if (!nome) return;
    nome.textContent = `Nome: ${aluno.nome}`;
    seletor("#detalhe-email").textContent = `E-mail: ${aluno.email}`;
    seletor("#detalhe-curso").textContent = `Curso: ${aluno.curso}`;
    seletor("#detalhe-status").textContent = `Status: ${aluno.status}`;
}

function aplicarFiltros() {
    const busca = seletor("#busca");
    const filtroStatus = seletor("#filtro-status");
    if (!busca || !filtroStatus) return;

    const termo = busca.value.trim().toLowerCase();
    const statusSelecionado = filtroStatus.value;
    const resultado = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(termo) &&
        (statusSelecionado === "" || aluno.status === statusSelecionado)
    );

    renderizarAlunos(resultado);
}


function gerarNovoId() {
    if (alunos.length === 0) return 1;
    const ids = alunos.map(aluno => aluno.id);
    return Math.max(...ids) + 1;
}

function cadastrarAluno(event) {
    event.preventDefault();
    const formulario = event.target;

    const novoAluno = {
        id: gerarNovoId(),
        nome: seletor("#nome").value.trim(),
        email: seletor("#email").value.trim(),
        curso: seletor("#curso").value,
        status: seletor("#status").value
    };

    alunos.push(novoAluno);
    salvarDados(STORAGE_KEYS.alunos, alunos);

    const mensagem = seletor("#mensagem-cadastro");
    if (mensagem) {
        mensagem.textContent = `Aluno ${novoAluno.nome} cadastrado com sucesso.`;
        mensagem.className = "mensagem mensagem-sucesso";
    }

    renderizarAlunos(alunos, "#lista-alunos-form", false);
    formulario.reset();
    atualizarDashboard();
}

function removerAluno(id) {
    const indice = alunos.findIndex(aluno => aluno.id === id);
    if (indice === -1) return;

    alunos.splice(indice, 1);
    salvarDados(STORAGE_KEYS.alunos, alunos);
    aplicarFiltros();
    atualizarDashboard();
}

function alterarStatusAluno(id, novoStatus) {
    const aluno = alunos.find(item => item.id === id);
    if (!aluno) return;

    aluno.status = novoStatus;
    salvarDados(STORAGE_KEYS.alunos, alunos);
    aplicarFiltros();
    atualizarDashboard();
}

function restaurarAlunos() {
    alunos = alunosIniciais.map(aluno => ({ ...aluno }));
    salvarDados(STORAGE_KEYS.alunos, alunos);
    renderizarAlunos(alunos);
    renderizarAlunos(alunos, "#lista-alunos-form", false);
    atualizarDashboard();

    const busca = seletor("#busca");
    const filtroStatus = seletor("#filtro-status");
    if (busca) busca.value = "";
    if (filtroStatus) filtroStatus.value = "";

    const mensagem = seletor("#mensagem-lista");
    if (mensagem) {
        mensagem.textContent = "Dados iniciais dos alunos restaurados.";
        mensagem.className = "mensagem mensagem-sucesso";
    }
}

function restaurarDadosIniciais() {
    alunos = alunosIniciais.map(aluno => ({ ...aluno }));
    cursos = cursosIniciais.map(curso => ({ ...curso }));
    matriculas = matriculasIniciais.map(matricula => ({ ...matricula }));
    usuarios = usuariosIniciais.map(usuario => ({ ...usuario }));

    salvarDados(STORAGE_KEYS.alunos, alunos);
    salvarDados(STORAGE_KEYS.cursos, cursos);
    salvarDados(STORAGE_KEYS.matriculas, matriculas);
    salvarDados(STORAGE_KEYS.usuarios, usuarios);
    inicializarAplicacao();
}


function configurarEventos() {
    const botaoDashboard = seletor("#btn-atualizar-dashboard");
    if (botaoDashboard) botaoDashboard.addEventListener("click", atualizarDashboard);

    const botaoAtualizar = seletor("#btn-atualizar");
    if (botaoAtualizar) botaoAtualizar.addEventListener("click", aplicarFiltros);

    const busca = seletor("#busca");
    if (busca) busca.addEventListener("input", aplicarFiltros);

    const filtroStatus = seletor("#filtro-status");
    if (filtroStatus) filtroStatus.addEventListener("change", aplicarFiltros);

    const formularioAluno = seletor("#form-aluno");
    if (formularioAluno) formularioAluno.addEventListener("submit", cadastrarAluno);

    const botaoRestaurar = seletor("#btn-restaurar-alunos");
    if (botaoRestaurar) botaoRestaurar.addEventListener("click", restaurarAlunos);

    const linkAlunos = seletor("#link-alunos");
    if (linkAlunos) linkAlunos.setAttribute("title", "Acessar cadastro de alunos");
}


function inicializarAplicacao() {
    renderizarAlunos(alunos);
    renderizarAlunos(alunos, "#lista-alunos-form", false);
    renderizarCursos(cursos);
    renderizarMatriculas(matriculas);
    renderizarUsuarios(usuarios);
    atualizarDashboard();
}

configurarEventos();
inicializarAplicacao();
