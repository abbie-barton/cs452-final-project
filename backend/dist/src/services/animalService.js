"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimal = createAnimal;
exports.getAnimals = getAnimals;
const mysql_1 = require("../db/mysql");
async function createAnimal(animal) {
    const [result] = await mysql_1.pool.execute("INSERT INTO animals (name, breed, species, site, intake_date, color, location_found, description, size, gender, spayed_or_neutered, available_for_adoption, housetrained, declawed, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        animal.name,
        animal.breed ?? null,
        animal.species,
        animal.site,
        animal.intake_date,
        animal.color,
        animal.location_found,
        animal.description ?? null,
        animal.size,
        animal.gender,
        animal.spayed_or_neutered ?? null,
        animal.available_for_adoption ?? null,
        animal.housetrained ?? null,
        animal.declawed ?? null,
        animal.age ?? null,
    ]);
    const insertId = result.insertId;
    const { id, ...animalWithoutId } = animal;
    return { id: insertId, ...animalWithoutId };
}
async function getAnimals() {
    const [rows] = await mysql_1.pool.query("SELECT * FROM animals");
    return rows;
}
