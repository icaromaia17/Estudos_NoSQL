# CRUD - Spring Boot

Material explicado sobre como criar uma **API REST** com Java e **Spring Boot**: os conceitos por trás, a configuração do projeto, o código de cada camada e as quatro operações do CRUD.

Para ilustrar, os exemplos usam uma entidade simples chamada `Tarefa` (uma lista de afazeres), gravada em um banco **H2** por meio do **Spring Data JPA**. Como o H2 roda em memória dentro da aplicação, **os dados somem quando ela é encerrada**.

> Os códigos são exemplos ilustrativos, escritos para explicar a estrutura de um projeto Spring Boot.

---

## Conceitos Básicos

### O que é o Spring Boot

O **Spring Framework** é um conjunto de ferramentas para construir aplicações Java. Ele é poderoso, mas exige muita configuração manual. O **Spring Boot** vem para simplificar isso: oferece configuração automática, servidor web embutido (a aplicação sobe sozinha, sem instalar nada à parte) e dependências já organizadas em pacotes prontos, chamados de *starters*.

### O que é uma API REST

Uma **API** é a porta de entrada que um programa oferece para outros conversarem com ele. Uma API **REST** faz isso pela web, usando os métodos do protocolo HTTP, e normalmente troca os dados em formato **JSON**.

| Operação | Método HTTP | Rota | Equivalente em SQL |
|---|---|---|---|
| Create | `POST` | `/tarefa` | `INSERT` |
| Read | `GET` | `/tarefa`, `/tarefa?titulo=estudar`, `/tarefa/{id}` | `SELECT` |
| Update | `PUT` | `/tarefa/{id}` | `UPDATE` |
| Delete | `DELETE` | `/tarefa/{id}` | `DELETE` |

### Arquitetura em camadas (MVC)

Dividir a aplicação em camadas, cada uma com uma responsabilidade, deixa o código limpo, fácil de entender e de manter:

| Camada | Responsabilidade |
|---|---|
| **Model** | Representa os dados (`Tarefa`) e vira uma tabela no banco |
| **Controller** | O "porteiro": recebe as requisições HTTP e devolve as respostas |
| **Service** | Concentra a lógica de negócio |
| **Repository** | Conversa com o banco de dados |

Caminho de uma requisição:

```
Requisição -> Controller -> Service -> Repository -> Banco de dados
```

A resposta volta pelo mesmo caminho. Regra importante: o Controller **não** fala direto com o banco, ele sempre passa pelo Service.

### Injeção de dependência

Quando uma classe precisa de outra para funcionar (o Controller precisa do Service, o Service precisa do Repository), o jeito ingênuo seria criá-la com `new`:

```java
// Sem injeção: a classe cria e fica presa à sua dependência
private TarefaService tarefaService = new TarefaService();
```

No Spring, a classe apenas **declara** que precisa da dependência, e o Spring cria e entrega o objeto pronto:

```java
// Com injeção: o Spring entrega a dependência pelo construtor
private final TarefaService tarefaService;

public TarefaController(TarefaService tarefaService) {
    this.tarefaService = tarefaService;
}
```

Isso deixa as classes menos acopladas, mais fáceis de testar e de trocar. O Spring sabe quais classes gerenciar por causa de annotations como `@Service`, `@Repository` e `@RestController`.

### JPA, ORM e banco H2

- **JPA** é a especificação Java que mapeia classes para tabelas (isso se chama **ORM**). Cada objeto vira uma linha, e cada atributo, uma coluna.
- **Spring Data JPA** vai além: gera sozinho os comandos SQL mais comuns a partir de uma interface, sem precisar escrevê-los.
- **H2** é um banco relacional leve que roda em memória, ideal para aprender e testar. Em produção, ele costuma ser trocado por PostgreSQL, MySQL etc., sem mudar o código das camadas.

---

## Preparação

### Criando o projeto

O projeto é gerado no **Spring Initializr** (start.spring.io):

| Campo | Escolha |
|---|---|
| Project | Maven |
| Language | Java |
| Spring Boot | Versão estável padrão (sem SNAPSHOT nem M) |
| Java | 17 |

**Dependências**

| Dependência | Para que serve |
|---|---|
| **Spring Web** | Criar os endpoints HTTP e o servidor web embutido |
| **Spring Data JPA** | Acessar o banco relacional sem escrever SQL na mão |
| **Lombok** | Gerar getters, setters e construtores por annotations, reduzindo código repetitivo |
| **H2 Database** | Banco em memória para desenvolvimento e testes |

Com o projeto aberto na IDE, executa-se a classe principal (a que tem `@SpringBootApplication`). Quando o log mostrar `Started ... Application`, a API está no ar em `http://localhost:8080`.

**Estrutura de pastas**

```
src/main/java/com/exemplo/tarefas
├── TarefasApplication.java
├── model
│   └── Tarefa.java
├── repository
│   └── TarefaRepository.java
├── service
│   └── TarefaService.java
└── controller
    └── TarefaController.java
```

### Configuração do banco (application.yml)

A conexão com o banco é configurada em `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:tarefas
    driver-class-name: org.h2.Driver
    username: sa
    password:

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

  h2:
    console:
      enabled: true
      path: /h2-console
```

| Bloco | O que faz |
|---|---|
| `datasource` | Define a URL (banco em memória chamado `tarefas`), o driver e o usuário |
| `jpa.hibernate.ddl-auto: update` | Cria e ajusta as tabelas a partir das entidades |
| `jpa.show-sql: true` | Mostra no console o SQL gerado, ótimo para aprender |
| `h2.console` | Liga o console web do H2 |

### Console do H2

Com a aplicação rodando, o console abre no navegador em `http://localhost:8080/h2-console`. Na tela de login, usam-se os mesmos dados do `application.yml`:

| Campo | Valor |
|---|---|
| JDBC URL | `jdbc:h2:mem:tarefas` |
| User Name | `sa` |
| Password | (vazio) |

Lá é possível rodar SQL direto e conferir se a API realmente gravou os dados:

```sql
SELECT * FROM tarefa;
```

### Testando com o Postman

O **Postman** simula o cliente da API: escolhe-se o método, digita-se a URL e, nas requisições com corpo, vai-se em **Body → raw → JSON**.

---

## Código Base

### Model

```java
package com.exemplo.tarefas.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tarefa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    private Boolean concluida;
}
```

O `@Entity` marca a classe como entidade JPA e o `@Table` dá nome à tabela. O `@Id` indica a chave primária, e o `@GeneratedValue` faz o banco criar os `id` em sequência. As annotations do Lombok escrevem getters, setters e construtores durante a compilação. Em projetos com Spring Boot 3 ou mais novo, os imports vêm de `jakarta.persistence` (nas versões antigas era `javax.persistence`).

### Repository

```java
package com.exemplo.tarefas.repository;

import com.exemplo.tarefas.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {

    List<Tarefa> findByTituloContainingIgnoreCase(String titulo);
}
```

Ao estender `JpaRepository<Tarefa, Long>` (entidade e tipo da chave), o repositório ganha de graça `findAll()`, `findById()`, `save()`, `existsById()` e `deleteById()`, sem nenhuma query escrita. O método `findByTituloContainingIgnoreCase` é uma consulta derivada: o Spring monta o SQL só pelo nome do método. Não existe implementação, e por isso é uma `interface`.

### Service

```java
package com.exemplo.tarefas.service;

import com.exemplo.tarefas.model.Tarefa;
import com.exemplo.tarefas.repository.TarefaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TarefaService {

    private final TarefaRepository tarefaRepository;

    public Tarefa criar(Tarefa tarefa) {
        tarefa.setId(null);
        return tarefaRepository.save(tarefa);
    }

    public List<Tarefa> listar(String titulo) {
        if (titulo == null || titulo.isBlank()) {
            return tarefaRepository.findAll();
        }
        return tarefaRepository.findByTituloContainingIgnoreCase(titulo);
    }

    public Optional<Tarefa> buscarPorId(Long id) {
        return tarefaRepository.findById(id);
    }

    public Optional<Tarefa> atualizar(Long id, Tarefa dados) {
        return tarefaRepository.findById(id).map(existente -> {
            existente.setTitulo(dados.getTitulo());
            existente.setConcluida(dados.getConcluida());
            return tarefaRepository.save(existente);
        });
    }

    public boolean remover(Long id) {
        if (!tarefaRepository.existsById(id)) {
            return false;
        }
        tarefaRepository.deleteById(id);
        return true;
    }
}
```

O `@Service` registra a classe como componente de lógica de negócio. O `@RequiredArgsConstructor` cria o construtor com os campos `final`, e é por ele que o Spring entrega o `TarefaRepository` pronto (a injeção de dependência vista acima). No `criar`, o `id` é zerado para que o banco sempre gere um novo. No `atualizar` e no `remover`, o Service confere se a tarefa existe antes de agir, e o `Optional` representa um resultado que pode não existir.

### Controller

```java
package com.exemplo.tarefas.controller;

import com.exemplo.tarefas.model.Tarefa;
import com.exemplo.tarefas.service.TarefaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tarefa")
@RequiredArgsConstructor
public class TarefaController {

    private final TarefaService tarefaService;

    @PostMapping
    public ResponseEntity<Tarefa> criar(@RequestBody Tarefa tarefa) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tarefaService.criar(tarefa));
    }

    @GetMapping
    public List<Tarefa> listar(@RequestParam(required = false) String titulo) {
        return tarefaService.listar(titulo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarefa> buscarPorId(@PathVariable Long id) {
        return tarefaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarefa> atualizar(@PathVariable Long id, @RequestBody Tarefa tarefa) {
        return tarefaService.atualizar(id, tarefa)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        if (tarefaService.remover(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
```

O `@RestController` faz a classe responder requisições devolvendo JSON, e o `@RequestMapping("/tarefa")` fixa a rota base. Cada método responde a um verbo HTTP. O Controller não toca nos dados: só repassa o trabalho ao Service e escolhe o status da resposta com o `ResponseEntity`.

**Anotações utilizadas**

| Anotação | Descrição |
|---|---|
| `@SpringBootApplication` | Marca a classe principal e liga a configuração automática |
| `@Entity` | Marca a classe como entidade, mapeada para uma tabela |
| `@Table` | Define o nome da tabela |
| `@Id` | Indica a chave primária |
| `@GeneratedValue` | Gera a chave primária automaticamente |
| `@Getter` / `@Setter` | Lombok: criam getters e setters |
| `@NoArgsConstructor` / `@AllArgsConstructor` | Lombok: criam os construtores |
| `@RequiredArgsConstructor` | Lombok: cria o construtor com os campos `final` |
| `@Service` | Classe de lógica de negócio |
| `@RestController` | Classe que responde requisições HTTP com dados |
| `@RequestMapping` | Define a rota base (`/tarefa`) |
| `@PostMapping` / `@GetMapping` / `@PutMapping` / `@DeleteMapping` | Mapeiam cada verbo HTTP |
| `@RequestBody` | Converte o JSON do corpo em objeto |
| `@PathVariable` | Lê um valor que vem na URL |
| `@RequestParam` | Lê um parâmetro de busca da URL |

---

## Create

```http
# Cadastrar uma tarefa
POST http://localhost:8080/tarefa
Content-Type: application/json

{
    "titulo": "Estudar Spring Boot",
    "concluida": false
}

# Cadastrar outra tarefa
POST http://localhost:8080/tarefa
Content-Type: application/json

{
    "titulo": "Testar a API no Postman",
    "concluida": false
}
```

Resposta do primeiro `POST` (status `201 Created`):

```json
{
    "id": 1,
    "titulo": "Estudar Spring Boot",
    "concluida": false
}
```

O `POST` cadastra **uma** tarefa e devolve o objeto salvo, já com o `id` gerado pelo banco. Para cadastrar várias, repete-se a requisição. Em seguida, vale conferir no console do H2 com `SELECT * FROM tarefa;`.

**Métodos utilizados em Create**

| Método | Descrição |
|---|---|
| `POST /tarefa` | Cadastra uma nova tarefa |
| `criar()` | Método do Controller/Service que trata o cadastro |
| `save()` | Método do `JpaRepository` que grava o registro (um `INSERT`) |

---

## Read

```http
# Listar todas as tarefas
GET http://localhost:8080/tarefa

# Buscar tarefas pelo título
GET http://localhost:8080/tarefa?titulo=estudar

# Buscar uma tarefa pelo id
GET http://localhost:8080/tarefa/1
```

Resposta do primeiro `GET` (status `200 OK`):

```json
[
    { "id": 1, "titulo": "Estudar Spring Boot", "concluida": false },
    { "id": 2, "titulo": "Testar a API no Postman", "concluida": false }
]
```

O `GET /tarefa` sem parâmetros devolve tudo. Com `?titulo=estudar`, devolve as tarefas cujo título contém o texto, sem diferenciar maiúsculas de minúsculas. O `GET /tarefa/1` busca pelo `id` e responde `404 Not Found` se ele não existir.

**Métodos utilizados em Read**

| Método | Descrição |
|---|---|
| `GET /tarefa` | Lista todas as tarefas |
| `GET /tarefa?titulo=...` | Lista as tarefas cujo título contém o texto |
| `GET /tarefa/{id}` | Busca uma tarefa pelo `id` |
| `findAll()` | Retorna todos os registros da tabela |
| `findByTituloContainingIgnoreCase()` | Consulta derivada, criada pelo nome do método |
| `findById()` | Retorna o registro do `id` informado, se existir |

---

## Update

```http
# Atualizar uma tarefa
PUT http://localhost:8080/tarefa/1
Content-Type: application/json

{
    "titulo": "Estudar Spring Boot e JPA",
    "concluida": true
}
```

Resposta (status `200 OK`):

```json
{
    "id": 1,
    "titulo": "Estudar Spring Boot e JPA",
    "concluida": true
}
```

O `PUT /tarefa/1` busca a tarefa do `id` informado e **troca os valores** de `titulo` e `concluida` pelos enviados no corpo, mantendo o mesmo `id`. Se o `id` não existir, a resposta é `404 Not Found`. Como o objeto já existe, o `save()` faz um `UPDATE` em vez de um `INSERT`.

**Métodos utilizados em Update**

| Método | Descrição |
|---|---|
| `PUT /tarefa/{id}` | Atualiza os dados de uma tarefa |
| `atualizar()` | Método do Controller/Service que trata a atualização |
| `findById()` | Localiza o registro antes de alterar |
| `save()` | Grava o registro alterado (um `UPDATE`) |

---

## Delete

```http
# Remover uma tarefa
DELETE http://localhost:8080/tarefa/1
```

A resposta é `204 No Content` (sem corpo). Repetindo o mesmo `DELETE`, a tarefa já não existe e a resposta passa a ser `404 Not Found`. Um novo `GET /tarefa` mostra a lista sem o item removido.

**Métodos utilizados em Delete**

| Método | Descrição |
|---|---|
| `DELETE /tarefa/{id}` | Remove a tarefa do `id` informado |
| `remover()` | Método do Controller/Service que trata a remoção |
| `existsById()` | Confere se o registro existe antes de apagar |
| `deleteById()` | Apaga o registro (um `DELETE`) |

---

## Status HTTP Utilizados

| Status | Significado | Onde aparece |
|---|---|---|
| `200 OK` | Deu certo | `GET` e `PUT` |
| `201 Created` | Recurso criado | `POST` |
| `204 No Content` | Deu certo, sem corpo na resposta | `DELETE` |
| `404 Not Found` | A tarefa não foi encontrada | `GET`, `PUT` e `DELETE` com `id` inexistente |

---

## Comparação com SQL

| Operação | SQL | API Spring Boot | JpaRepository |
|---|---|---|---|
| Create | `INSERT INTO tarefa ...` | `POST /tarefa` | `save()` |
| Read (todos) | `SELECT * FROM tarefa` | `GET /tarefa` | `findAll()` |
| Read (por título) | `SELECT * FROM tarefa WHERE titulo LIKE ...` | `GET /tarefa?titulo=...` | `findByTituloContainingIgnoreCase()` |
| Read (por id) | `SELECT * FROM tarefa WHERE id = ...` | `GET /tarefa/{id}` | `findById()` |
| Update | `UPDATE tarefa SET ... WHERE id = ...` | `PUT /tarefa/{id}` | `save()` (com `id` existente) |
| Delete | `DELETE FROM tarefa WHERE id = ...` | `DELETE /tarefa/{id}` | `deleteById()` |

A grande vantagem do Spring Data JPA é que nenhuma dessas queries precisa ser escrita: o `JpaRepository` as gera sozinho.

---

## Fluxo Completo

```
Postman -> Controller -> Service -> Repository -> Banco H2
```

1. O Postman envia a requisição para `/tarefa`.
2. O **Controller** recebe e chama o **Service**.
3. O **Service** aplica a regra (por exemplo, conferir se a tarefa existe) e chama o **Repository**.
4. O **Repository** executa a operação no banco H2.
5. A resposta volta pelo mesmo caminho, com o status HTTP correspondente.

---

## Do protótipo ao projeto profissional

Um projeto como este é um bom ponto de partida, mas aplicações de nível profissional vão além. Alguns caminhos para evoluir:

| Tema | Descrição |
|---|---|
| **WebFlux** | Programação reativa, com processamento assíncrono para lidar com muitas requisições ao mesmo tempo |
| **Integração com IA** | Chamar serviços de inteligência artificial (como o ChatGPT) a partir da API, por exemplo para gerar conteúdo dinâmico a partir dos dados cadastrados |
| **Banco persistente** | Trocar o H2 em memória por PostgreSQL, MySQL etc. |
| **DTOs** | Objetos próprios para entrada e saída, sem expor a entidade diretamente |
| **Validação** | Conferir os dados recebidos antes de gravar |
| **Tratamento de erros** | Respostas de erro padronizadas e centralizadas |
| **Testes automatizados** | Garantir que cada camada continua funcionando após mudanças |
