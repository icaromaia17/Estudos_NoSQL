# Estudos_NoSQL

Repositório da disciplina de NoSQL. Uso para guardar as anotações das aulas, os comandos do MongoDB no `mongosh` e os exercícios.

---

#  Arquivos

| Arquivo | Tipo | Descrição |
|---|---|---|
| [`CRUD.NoSQL.js`](CRUD.NoSQL.js) | Código | Comandos do MongoDB reunidos em um só arquivo: banco, collections, CRUD e relacionamentos |
| [`atividade_pratica.js`](atividade_pratica.js) | Exercícios | Atividade "Antes e Depois" com o banco `store` e a collection `customers`, mais a seção de desafio |
| [`JAVA_SpringBoot.md`](JAVA_SpringBoot.md) | Anotações | API REST com Java e Spring Boot: conceitos, camadas e CRUD completo |
| [`imagens/`](imagens) | Imagens | Imagens usadas nas anotações |

---

# Estrutura do repositório

```
Estudos_NoSQL
├── README.md
├── CRUD.NoSQL.js
├── atividade_pratica.js
├── JAVA_SpringBoot.md
└── imagens/
```

---

# O que foi visto

# MongoDB (`CRUD.NoSQL.js`)

| Tema | Comandos e conceitos |
|---|---|
| **Banco e collections** | `show databases`, `use`, `createCollection`, `show collections` |
| **Create** | `insertOne`, `insertMany` |
| **Read** | `find`, `findOne`, busca por campo e por `_id` |
| **Update** | `updateOne`, `updateMany`, `replaceOne`, operador `$set` |
| **Delete** | `deleteOne`, `deleteMany` |
| **Relacionamentos** | one-to-one, one-to-many e many-to-many, cada um de forma **embarcada** e **por referência** |

### Atividade prática (`atividade_pratica.js`)

Dez exercícios no formato "Antes e Depois", cobrindo:

- Consulta com projeção e filtros com múltiplas condições
- Atualização de um e de vários documentos (`$set`, `$inc`, `$unset`)
- Inserção e remoção de documentos
- Ordenação com `sort`
- Desafio final com `countDocuments`, `limit`, `$in`, `$gte` e `$lte`

### Spring Boot (`JAVA_SpringBoot.md`)

- O que é Spring Boot e uma API REST
- Arquitetura em camadas: **Model**, **Controller**, **Service** e **Repository**
- Injeção de dependência, JPA e banco H2
- CRUD completo com `POST`, `GET`, `PUT` e `DELETE`
- Status HTTP (`200`, `201`, `204` e `404`)

---

##  Como usar

### Comandos do MongoDB

1. Instale o MongoDB e o `mongosh`.
2. Abra o terminal interativo:

```
mongosh
```

3. Copie os comandos dos arquivos `.js` e cole no terminal, uma seção por vez.

> O `_id` usado nos exemplos de busca é apenas ilustrativo. O seu será outro: copie o valor que o `insertOne` ou o `find()` devolver.

### Exemplo em Spring Boot

1. Gere o projeto no [Spring Initializr](https://start.spring.io) com Spring Web, Spring Data JPA, Lombok e H2 Database.
2. Crie as classes de cada camada conforme o `JAVA_SpringBoot.md`.
3. Execute a classe principal e teste as rotas no Postman, em `http://localhost:8080`.

---

##  Tecnologias

| Tecnologia | Uso |
|---|---|
| MongoDB e `mongosh` | Banco NoSQL orientado a documentos e seu terminal |
| Java 17 e Spring Boot | API REST |
| Spring Data JPA e H2 | Acesso ao banco em memória, no exemplo da API |
| Lombok | Redução de código repetitivo |
| Postman | Teste das requisições HTTP |
