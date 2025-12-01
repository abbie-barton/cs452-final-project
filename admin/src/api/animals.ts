import axios from "axios";
import { Animal } from "../../../shared/dist/types/Animal";

const API_BASE = "https://gxxmq0jkd0.execute-api.us-east-2.amazonaws.com"; 

export const getAnimals = async (): Promise<Animal[]> => {
  const { data } = await axios.get(`${API_BASE}/animal`);
  return data;
};

export const createAnimal = async (animal: Animal): Promise<Animal> => {
  const { data } = await axios.post(`${API_BASE}/animal`, animal);
  return data;
};
