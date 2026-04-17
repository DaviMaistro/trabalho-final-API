# API REST - Gerenciador de Tarefas

## Tecnologias Utilizadas

* Node.js
* Express
* SQLite3
* JSON Web Token (JWT)

---

## Funcionalidades

* Autenticação com JWT
* CRUD completo de tarefas
* Banco de dados SQLite
* Filtros por status
* Ordenação de resultados
* Paginação
* Relacionamento entre usuários e tarefas (JOIN)
* Validações de dados
* Status codes corretos
* 20 registros iniciais no banco

---

## Estrutura do Projeto

```text
/projeto
 ├── server.js
 ├── banco.db
 ├── package.json
 ├── README.md
 └── collection_postman.json
```

---

## Instalação

Clone ou baixe o projeto.

No terminal, dentro da pasta do projeto, execute:

```bash
npm install
```

Ou instale manualmente:

```bash
npm install express sqlite3 jsonwebtoken
```

---

## Como Executar

```bash
node server.js
```

Servidor iniciado em:

```text
http://localhost:3000
```

---

## Usuário Padrão para Login

```text
usuario: admin
senha: 1234
```

---

## Banco de Dados

O banco é criado automaticamente com nome:

```text
banco.db
```

Tabelas criadas:

* usuarios
* tarefas

Também são inseridos automaticamente:

* 1 usuário padrão
* 20 tarefas iniciais

---

# Rotas da API

---

## GET /

Retorna mensagem inicial da API.

### Exemplo:

```json
{
  "mensagem": "API funcionando",
  "status": "sucesso"
}
```

---

## GET /info

Retorna informações do sistema.

### Exemplo:

```json
{
  "nome": "API REST CRUD SQLite",
  "versao": "1.0.0",
  "autor": "Davi"
}
```

---

## POST /login

Realiza autenticação e retorna token JWT.

### URL

```text
http://localhost:3000/login
```

### Body JSON

```json
{
  "usuario": "admin",
  "senha": "1234"
}
```

### Resposta

```json
{
  "token": "SEU_TOKEN"
}
```

---

# Rotas Protegidas

Necessário enviar header:

```text
Authorization: Bearer SEU_TOKEN
```

---

## GET /tarefas

Lista tarefas cadastradas.

### URL

```text
http://localhost:3000/tarefas
```

### Exemplo de retorno

```json
[
  {
    "id": 1,
    "titulo": "Tarefa 1",
    "descricao": "Descrição 1",
    "status": "pendente",
    "usuario": "admin"
  }
]
```

---

## GET /tarefas/:id

Busca tarefa pelo ID.

### Exemplo

```text
/tarefas/1
```

---

## POST /tarefas

Cria nova tarefa.

### Body JSON

```json
{
  "titulo": "Estudar Node",
  "descricao": "Projeto final",
  "status": "andamento"
}
```

### Resposta

```json
{
  "mensagem": "Tarefa criada"
}
```

---

## PUT /tarefas/:id

Atualiza tarefa existente.

### Exemplo

```json
{
  "titulo": "Tarefa Atualizada",
  "descricao": "Nova descrição",
  "status": "concluido"
}

---

## DELETE /tarefas/:id

Remove tarefa pelo ID.

---

# Filtros, Ordenação e Paginação

## Paginação

```text
GET /tarefas?pagina=2
```

## Ordenação

```text
GET /tarefas?ordem=titulo
```

## Filtro por status

```text
GET /tarefas?status=pendente
```

---
