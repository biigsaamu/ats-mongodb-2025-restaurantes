//TAREAS OBLIGATORIAS

// 1. Diseño del esquema de la base de datos 

/*
Consulta para ver cuantas inspecciones tiene cada negocio, segun su nombre, 
para la decisión de i usar referencias o documentos embedidos en el  primer ejercicio.
*/ 
db.inspections.aggregate([
	{$group: {_id: "$business_name", sumaTotal: {$sum: 1}}},
	{$sort: {sumaTotal:-1}}
]);

// 2. Implementación de consultas en MongoDB

/*
Búsqueda de todos los restaurantes de un tipo de comida específico (ej. "Chinese").
*/ 
db.restaurants.aggregate([
    {$match: {type_of_food : "Chinese"}},
    {$project: {_id:0, name:1, address:1, "address line 2":1}}
]);

db.restaurants.aggregate([
    {$match: {type_of_food : "Chinese"}},
    {$group: {_id: "$name"}}
  ])

/*
Consulta de inspecciones con violaciones (Violation Issued) ordenadas por fecha
*/

db.inspections.aggregate([
	{$match: {"result": {$eq: "Violation Issued"}}},
 	{$addFields:{realDate: { $toDate : "$date"}}},
	{$sort: {realDate : 1}},
{$project:{_id:0, business_name:1, result:1, date:1}}
]);

/*
Restaurantes con una calificación superior a 4
*/

db.restaurants.aggregate([
    {$match: {rating: {$gt: 4}}},
  {$group: { _id: "$name", rating: { $first: "$rating" }}},
    {$sort: {_id: 1}},
    {$project: { _id: 0, name: "$_id", rating: 1}} 
]);

// 3. Uso de agregaciones

/*
Agrupar restaurantes por tipo de comida y calcular la calificación promedio
*/

db.restaurants.aggregate([
	{$match: {"rating": {$ne: "Not yet rated"}}},
	{$group: {_id: "$type_of_food", calificacion_promedio: {$avg: "$rating"}}}
]);

/*
Contar el número de inspecciones por resultado y mostrar los porcentajes. 
6370 és el número total de documentos de la colección inspections
*/

db.inspections.aggregate([
	{$group: {_id: "$result", numResult: {$sum:1}}},
	{$project: {_id:1, numResult:1, percent: {$divide: ["$numResult", 6370]}}}
]);

/*
Unir restaurantes con sus inspecciones utilizando $lookup.
*/

db.restaurants.aggregate([
	{$project: {_id:1, name: 1, stri: {$toString: "$_id"}}},
	{$lookup:{
    from: "inspections",
    localField: "stri",
    foreignField: "restaurant_id",
    as: "details"}},
   	 {$project: {name:1, stri:1, "details.restaurant_id":1, "details.date":1, "details.business_name":1}},
    	{$limit: 2}
]);

//TAREAS AVANZADAS

// 1. Optimización del rendimiento

/*
Creación de índices.
*/

db.inspections.createIndex({ sector: 1 })

db.inspections.createIndex({ restaurant_id: 1 })

db.inspections.createIndex({ result: 1 })

db.inspections.createIndex({ date: 1 })

/*
Consultas para analizar rendimiento índices mediante explain()
*/

db.inspections.find({
    "result": "Pass"
}).explain("executionStats");

db.inspections.find({
    "sector": "Storage Warehouse - 120"
}).explain("executionStats");

db.inspections.find({
    "restaurant_id": "55f14312c7447c3da7051b5c"
}).explain("executionStats");

db.inspectionsIso.find({ 
    date: { $gte: ISODate("2024-03-01T00:00:00Z") } 
}).explain("executionStats");
  
  

  
