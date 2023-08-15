const fs = require('fs');
const { rename } = require('fs/promises');

const filePath = './data.json';
const rawData = fs.readFileSync(filePath);
let data = JSON.parse(rawData);


// // Filter out objects where country is equal to "India"
// data = data.filter(obj => obj.country === "India");

// // Add rank property in each object with value increasing by 1
// let id = 1;
// data.forEach((obj, index) => {
//     obj.id = index + 1;
// });

// // to add any property
// data.forEach((obj) => {
//     obj.growth_from_2000_to_2023 = `${Math.round(Math.random() * 100) / 10 + 1}%`;
// })

// //To change the name of any property
// data.forEach(obj => {
//     obj.latitude = obj.lat;
//     obj.longitude = obj.lng;
//     obj.state = obj.admin_namewrite;
//     delete obj.lat;
//     delete obj.lng;
//     delete obj.admin_name;
// });

// To Delete any property from the object
data.forEach(campgroundData => {
    delete campgroundData.id;
});


// // To reorder the properties into any order, its ambiguous though.
// const propertyOrder = ["city", "growth_from_2000_to_2023", "latitude", "longitude", "population", "rank", "state"];

// const reorderedData = {};
// propertyOrder.forEach(property => {
//     if (data.hasOwnProperty(property)) {
//         reorderedData[property] = data[property];
//     }
// });

const modifiedData = JSON.stringify(data, null, 2); // Convert data to JSON string with 2-space indentation
fs.writeFileSync(filePath, modifiedData);
