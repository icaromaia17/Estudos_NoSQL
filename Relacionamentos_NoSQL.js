

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
