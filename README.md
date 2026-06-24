# Sistema Financeiro

MVP de um sistema financeiro pessoal desenvolvido com HTML, CSS e JavaScript. O objetivo do projeto é permitir que o usuário registre receitas e despesas, acompanhe o saldo atualizado e consulte o histórico de movimentações de forma simples, rápida e visual.

O sistema funciona no navegador e utiliza `localStorage` para salvar os dados localmente, sem necessidade de backend ou banco de dados externo.

## Funcionalidades

- Cadastro de receitas e despesas;
- Registro de descrição, valor, tipo, categoria, data e observação;
- Cálculo automático de receitas, despesas e saldo total;
- Exibição de movimentações recentes;
- Histórico completo com filtros por texto, tipo e categoria;
- Gráficos simples de distribuição por categoria e comparação entre receitas e despesas;
- Exclusão de movimentações cadastradas;
- Persistência dos dados no navegador.

## Estrutura de pastas

A organização foi simplificada para separar os arquivos de configuração da aplicação. A raiz do projeto fica apenas com documentação e Docker, enquanto o código da interface fica dentro de `public/`.

```text
Sistema-Financeiro/
|-- README.md
|-- Dockerfile
|-- docker-compose.yml
`-- public/
    |-- index.html
    `-- assets/
        |-- css/
        |   `-- styles.css
        `-- js/
            |-- app.js
            |-- storage.js
            `-- transactions.js
```

### Organização dos arquivos

- `public/index.html`: página principal renderizada no navegador;
- `public/assets/css/styles.css`: estilos visuais da aplicação;
- `public/assets/js/app.js`: controle da interface, eventos, abas, formulários, filtros e renderização;
- `public/assets/js/transactions.js`: regras de movimentações, cálculos, filtros, categorias e formatação de valores;
- `public/assets/js/storage.js`: leitura e gravação dos dados no `localStorage`;
- `Dockerfile`: configuração para publicar a pasta `public/` com Nginx;
- `docker-compose.yml`: configuração para subir o container na porta `8080`.

## Como executar

### Execução local

Como o projeto usa módulos JavaScript, o ideal é executar com um servidor local.

Opção com Live Server:

1. Abra a pasta do projeto no VS Code;
2. Instale ou habilite a extensão Live Server;
3. Clique com o botão direito em `public/index.html`;
4. Selecione `Open with Live Server`.

Opção com Python:

```bash
cd public
python -m http.server 8080
```

Depois acesse:

```text
http://localhost:8080
```

### Execução com Docker

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Depois acesse:

```text
http://localhost:8080
```

## Vídeo de apresentação

Cada grupo deverá gravar um vídeo de até 15 minutos apresentando o projeto. Abaixo estão as respostas organizadas para orientar a gravação.

### 1. Apresentação do projeto

O sistema busca resolver a dificuldade de controlar receitas, despesas e saldo de maneira prática. Muitas pessoas fazem esse acompanhamento de forma desorganizada, usando anotações soltas ou planilhas pouco intuitivas. O projeto propõe uma interface simples para registrar movimentações financeiras e visualizar rapidamente a situação geral.

O fluxo principal escolhido para o MVP foi o cadastro de movimentações financeiras. O usuário informa se a movimentação é uma receita ou despesa, preenche os dados principais e, após salvar, o sistema atualiza automaticamente o saldo, os totais, o histórico e os gráficos.

### 2. Demonstração do MVP

Na demonstração, o sistema deve ser apresentado em funcionamento no navegador. O fluxo principal pode ser mostrado seguindo estes passos:

1. Acessar a tela inicial com o resumo financeiro;
2. Clicar em `Nova movimentação` ou acessar a aba `Registrar`;
3. Preencher descrição, valor, tipo, categoria, data e observação;
4. Salvar a movimentação;
5. Mostrar o saldo atualizado no resumo;
6. Abrir o histórico de movimentações;
7. Usar os filtros por busca, tipo ou categoria;
8. Demonstrar a exclusão de uma movimentação, se necessário.

Essa demonstração comprova que o MVP atende ao objetivo principal: registrar e acompanhar movimentações financeiras de forma simples.

### 3. Uso da IA

A IA foi utilizada como apoio no desenvolvimento do projeto, principalmente para organizar ideias, estruturar o código, revisar a interface, sugerir melhorias no fluxo do MVP e auxiliar na documentação.

Ela ajudou a acelerar tarefas como criação de textos, organização das responsabilidades, correção de erros, melhoria da legibilidade do código e preparação do roteiro de apresentação. A IA não substituiu o trabalho do grupo, mas serviu como ferramenta de apoio para pesquisa, revisão e produtividade.

### 4. Participação dos integrantes

**Alessandro Mion Batista**  
Responsável pela organização geral do projeto, estrutura dos arquivos, versionamento no GitHub e apoio na integração das partes do MVP.

**Miguel Santuchi Poleto**  
Responsável pelo desenvolvimento das funcionalidades principais, incluindo cadastro de movimentações, cálculo de saldo e atualização dos dados exibidos na tela.

**Maria Laura Barbosa**  
Responsável pela interface e experiência do usuário, contribuindo com a organização visual das telas, formulários, cards de resumo e navegação por abas.

**Emilly Bedin**  
Responsável pela documentação e apoio na apresentação, contribuindo com a escrita do README, organização do roteiro do vídeo e descrição das funcionalidades.

**Rafael Zoppé**  
Responsável pelos testes e correção de bugs, verificando o fluxo principal, filtros, exclusão de movimentações e comportamento da aplicação no navegador.

**Andrey Magalhães**  
Responsável pela pesquisa e uso da IA no projeto, apoiando a equipe na busca por soluções, revisão de código, melhorias de organização e preparação do MVP.

## Observação

Este projeto é um MVP acadêmico. Por isso, os dados são salvos apenas no navegador do usuário por meio do `localStorage`. Não há autenticação, backend ou banco de dados externo nesta versão.
