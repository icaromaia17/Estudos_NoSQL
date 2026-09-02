use store


db.createCollection("customers")


db.customers.insertMany([
  { "name": "Ana", "age": 25, "city": "Salvador", "active": true, "points": 120 },
  { "name": "Bruno", "age": 32, "city": "Feira de Santana", "active": true, "points": 300 },
  { "name": "Carlos", "age": 28, "city": "Salvador", "active": false, "points": 80 },
  { "name": "Daniela", "age": 40, "city": "São Paulo", "active": true, "points": 500 },
  { "name": "Eduarda", "age": 22, "city": "Rio de Janeiro", "active": false, "points": 50 }
])


// EXERCÍCIO 1 – CONSULTA


db.customers.find(
  { "city": "Salvador" },
  { "_id": 0, "name": 1, "city": 1 }
)


// EXERCÍCIO 2 – ATUALIZAÇÃO


db.customers.updateOne(
  { "name": "Carlos" },
  { $set: { "active": true } }
)


// EXERCÍCIO 3 – ATUALIZAR VÁRIOS DOCUMENTOS


db.customers.updateMany(
  { "city": "Salvador" },
  { $set: { "state": "BA" } }
)


// EXERCÍCIO 4 – INCREMENTO


db.customers.updateOne(
  { "name": "Ana" },
  { $inc: { "points": 50 } }
)


// EXERCÍCIO 5 – INSERÇÃO


db.customers.insertOne({
  "name": "Fernando",
  "age": 29,
  "city": "Recife",
  "active": true,
  "points": 90
})


// EXERCÍCIO 6 – REMOÇÃO


db.customers.deleteOne({ "name": "Eduarda" })


// EXERCÍCIO 7 – CRIAR UM NOVO CAMPO


db.customers.updateOne(
  { "name": "Daniela" },
  { $set: { "vip": true } }
)



// EXERCÍCIO 8 – REMOVER UM CAMPO


db.customers.updateOne(
  { "name": "Bruno" },
  { $unset: { "points": "" } }
)


// EXERCÍCIO 9 – ORDENAÇÃO


db.customers.find().sort({ "age": -1 })


// EXERCÍCIO 10 – FILTRO COM MÚLTIPLAS CONDIÇÕES


db.customers.find(
  { "active": true, "age": { $gt: 30 } },
  { "_id": 0, "name": 1 }
)


// DESAFIO


db.customers.find({}, { "_id": 0, "name": 1 })

db.customers.countDocuments()

db.customers.countDocuments({ "active": true })

db.customers.find().sort({ "points": -1 }).limit(1)

db.customers.find().sort({ "age": 1 }).limit(1)

db.customers.find({ "points": { $gte: 100, $lte: 400 } })

db.customers.find({ "city": { $in: ["Salvador", "São Paulo"] } })

db.customers.find().sort({ "name": 1 })

db.customers.find().limit(3)

db.customers.find({ "active": false })
