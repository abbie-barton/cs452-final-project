"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const animalService_1 = require("../../services/animalService");
const main = async (event) => {
    try {
        if (!event.body) {
            return { statusCode: 400, body: "Missing request body" };
        }
        const data = JSON.parse(event.body);
        const created = await (0, animalService_1.createAnimal)(data);
        return {
            statusCode: 201,
            body: JSON.stringify(created),
        };
    }
    catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Server error" }),
        };
    }
};
exports.main = main;
