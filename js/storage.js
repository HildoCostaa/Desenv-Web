console.log("Módulo de armazenamento carregado.");

const STORAGE_KEYS = {
    alunos: "academico_alunos",
    cursos: "academico_cursos",
    matriculas: "academico_matriculas",
    usuarios: "academico_usuarios"
};


function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
}


function carregarDados(chave, valorPadrao) {
    const dados = localStorage.getItem(chave);

    if (dados === null) {
        return valorPadrao;
    }

    try {
        return JSON.parse(dados);
    } catch (erro) {
        console.error("Erro ao carregar dados da chave:", chave, erro);
        return valorPadrao;
    }
}

function removerDados(chave) {
    localStorage.removeItem(chave);
}
