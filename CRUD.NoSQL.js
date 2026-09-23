// CRUD - MONGODB


// ==================================================
// CREATE
// ==================================================


// BANCO DE DADOS

// Exibir os bancos de dados
show databases;

// Criar/selecionar banco de dados
use loja_informatica;


// COLLECTIONS

// Criar nova collection
db.createCollection("cliente");

// Mostrar todas as collections
show collections;


// INSERÇÃO DE DOCUMENTOS

// Inserir um documento
db.cliente.insertOne({
    "nome": "jefté"
});

// Inserir um documento com diferentes tipos de dados
db.cliente.insertOne({
    "nome": "jefté",
    "idade": 35,
    "pets": ["dora", "sabrina"],
    "endereco": {
        "logradouro": "Sossego"
    }
});

// Inserir vários documentos de uma vez
db.cliente.insertMany([
    { "nome": "Brenno" },
    { "nome": "João" },
    { "nome": "MAria" },
    { "nome": "José" },
    { "nome": "Noé" }
]);


// ==================================================
// READ
// ==================================================


// CONSULTA DE DOCUMENTOS

// Mostrar todos os documentos/objetos
db.cliente.find();

// Buscar documento pelo campo
db.cliente.find({
    "nome": "José"
});

// Buscar documento pelo identificador único
db.cliente.find({
    "_id": ObjectId("6a7bbab007ff2cf8649f68a9")
});

// Buscar apenas o primeiro documento correspondente
db.cliente.findOne({
    "nome": "José"
});


// ==================================================
// UPDATE
// ==================================================


// ATUALIZAÇÃO DE DOCUMENTOS

// Atualizar um campo existente
db.cliente.updateOne(
    { "nome": "MAria" },
    { $set: { "nome": "Maria" } }
);

// Adicionar um novo campo ao documento
db.cliente.updateOne(
    { "nome": "Maria" },
    {
        $set: {
            "endereco": {
                "logradouro": "sossego"
            }
        }
    }
);

// Atualizar vários documentos de uma vez
db.cliente.updateMany(
    { "endereco.logradouro": "sossego" },
    { $set: { "endereco.cidade": "Salvador" } }
);

// Substituir o documento inteiro (exceto o _id)
db.cliente.replaceOne(
    { "nome": "Brenno" },
    { "nome": "Brenno", "idade": 11, "status": "ativo" }
);


// ==================================================
// DELETE
// ==================================================


// REMOÇÃO DE DOCUMENTOS

// Remover um documento
db.cliente.deleteOne({
    "nome": "José"
});

// Remover vários documentos
db.cliente.deleteMany({
    "status": "inativo"
});


// ==================================================
// RELACIONAMENTOS
// ==================================================


// ONE-TO-ONE (UM PARA UM)

// Embarcado
db.patients.insertOne({
    "name": "Jefté",
    "age": 35,
    "diseaseSummary": {
        "diseases": ["cold", "broken leg"]
    }
});

// Por referência
db.persons.insertOne({
    "name": "Jefté",
    "age": 35,
    "salary": 3000
});

db.cars.insertOne({
    "model": "BMW",
    "price": 40000,
    "owner": ObjectId("6aa9e2cee9c288ce1241317e")
});


// ONE-TO-MANY (UM PARA MUITOS)

// Embarcado
db.questionThreads.insertOne({
    "creator": "Jefté",
    "question": "How does that work?",
    "answers": [
        { "text": "Like that." },
        { "text": "Thanks!" }
    ]
});

// Por referência
db.cities.insertOne({
    "name": "New York City",
    "coordinates": {
        "lat": 21,
        "lng": 55
    }
});

db.citizens.insertMany([
    { "name": "Jefté Goes", "cityId": ObjectId("5b98d6b44d01c52e1637a99f") },
    { "name": "Brenno Salvador", "cityId": ObjectId("5b98d6b44d01c52e1637a99f") }
]);


// MANY-TO-MANY (MUITOS PARA MUITOS)

// Embarcado
db.customers.insertOne({
    "name": "Jefté",
    "age": 35
});

db.customers.updateOne(
    {},
    {
        $set: {
            "orders": [
                { "title": "A Book", "price": 12.99, "quantity": 2 }
            ]
        }
    }
);

// Por referência
db.authors.insertMany([
    { "name": "Jorge Amado", "age": 78, "address": { "street": "Bahia" } },
    { "name": "Graciliano Ramos", "age": 55, "address": { "street": "Rio de Janeiro" } }
]);

db.books.updateOne(
    {},
    {
        $set: {
            "authors": [
                ObjectId("5b98d9e44d01c52e1637a9a6"),
                ObjectId("5b98d9e44d01c52e1637a9a7")
            ]
        }
    }
);
