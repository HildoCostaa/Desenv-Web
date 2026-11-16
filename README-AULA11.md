# Sistema de Gerenciamento Acadêmico — Aula 11

Projeto baseado no repositório da Aula 10, adaptado para a atividade de persistência local.

## Como executar
1. Extraia a pasta do projeto.
2. Abra `index.html` no navegador (recomendado usar Live Server no VS Code).
3. Navegue entre Dashboard, Alunos, Cursos, Matrículas e Usuários.
4. Cadastre, remova ou altere o status de um aluno e atualize a página para conferir a persistência.
5. Na página Alunos, use **Restaurar dados iniciais** para restaurar os alunos de exemplo.

## Arquivos principais
- `js/dados.js`: dados iniciais (`alunosIniciais`, `cursosIniciais`, `matriculasIniciais`, `usuariosIniciais`).
- `js/storage.js`: chaves e funções `salvarDados`, `carregarDados` e `removerDados`.
- `js/app.js`: carregamento, renderização, operações de alunos, restauração e eventos.

## Testes úteis no Console
```js
// Ver as chaves usadas pelo projeto
STORAGE_KEYS

// Ver os alunos carregados
alunos

// Remover somente os alunos salvos (ao recarregar, volta aos dados iniciais)
removerDados(STORAGE_KEYS.alunos)

// Simular JSON inválido e depois atualizar a página
localStorage.setItem(STORAGE_KEYS.alunos, "conteudo invalido")

// Restaurar as quatro coleções depois de localStorage.clear()
restaurarDadosIniciais()
```

Observação: cursos, matrículas e usuários são áreas de listagem na versão de Aula 10 fornecida; não foram inventados formulários funcionais de cadastro/edição para essas entidades. Os arrays são carregados do LocalStorage e as funções de persistência estão prontas para futuras operações.
