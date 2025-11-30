"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const animalService_1 = require("../services/animalService");
const Animal_1 = require("../../../shared/dist/types/Animal");
async function main() {
    try {
        const apollo = await (0, animalService_1.createAnimal)({
            name: "Apollo",
            species: "Dog",
            breed: "Golden Retriever/Lab Mix",
            site: Animal_1.Site.Lehi,
            intake_date: "2024-10-15",
            color: "Golden",
            location_found: "Local Hiking Trail",
            description: "A friendly, energetic dog, loves fetch and needs a big yard. Highly treat-motivated.",
            size: Animal_1.Size.Large,
            gender: Animal_1.Gender.Male,
            spayed_or_neutered: true,
            available_for_adoption: true,
            housetrained: true,
            age: 5,
        });
        console.log("Created animal:", apollo);
    }
    catch (error) {
        console.log("error creating animal: ", error);
    }
}
main();
