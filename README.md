# API REST - Gerenciador de Tarefas

## Tecnologias Utilizadas
Node.js
Express
SQLite3
JSON Web Token (JWT)

## Funcionalidades
Autenticação com JWT
CRUD completo de tarefas
Banco de dados SQLite
Filtros por status
Ordenação de resultados
Paginação
Relacionamento entre usuários e tarefas
Validações de dados
Status codes corretos
20 registros iniciais no banco

## Instalação

No terminal, dentro da pasta do projeto:

```bash
npm install
```

Ou:

```bash
npm install express sqlite3 jsonwebtoken
```

## Como Executar

```bash
node server.js
```

Servidor iniciado em:

```text
http://localhost:3000
```

## Usuário Padrão

```text
usuario: admin
senha: 1234
```

## Banco de Dados

Arquivo:

```text
banco.db
```

Tabelas:
usuarios
tarefas

Também são inseridos automaticamente:

1 usuário padrão
20 tarefas iniciais

## Rotas da API

## GET /

Retorna mensagem inicial da API.

## GET /info

Retorna informações do sistema.

## POST /login

Realiza autenticação e retorna token JWT.

Body JSON:

```json
{
  "usuario": "admin",
  "senha": "1234"
}
```

Resposta:

```json
{
  "token": "SEU_TOKEN"
}
```

## Header para Rotas Protegidas

```text
Authorization: Bearer SEU_TOKEN
```

## GET /tarefas

Lista tarefas cadastradas.

## GET /tarefas/:id

Busca tarefa pelo ID.

## POST /tarefas

Cria nova tarefa.

Body JSON:

```json
{
  "titulo": "Estudar Node",
  "descricao": "Projeto final",
  "status": "andamento"
}
```

## PUT /tarefas/:id

Atualiza tarefa existente.

Body JSON:

```json
{
  "titulo": "Tarefa Atualizada",
  "descricao": "Nova descrição",
  "status": "concluido"
}
```

## DELETE /tarefas/:id

Remove tarefa pelo ID.

## Filtros, Ordenação e Paginação

Paginação:

```text
GET /tarefas?pagina=2
```

Ordenação:

```text
GET /tarefas?ordem=titulo
```

Filtro:

```text
GET /tarefas?status=pendente
```

## Status Codes


## Testes no Postman

Importar arquivo:

```text
collection_postman.json
```

Executar:

1. POST /login
2. Copiar token
3. Testar rotas protegidas

