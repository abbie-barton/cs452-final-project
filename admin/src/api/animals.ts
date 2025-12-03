import axios from "axios";
import { Animal } from "../types/Animal";

const API_BASE = "https://gxxmq0jkd0.execute-api.us-east-2.amazonaws.com"; 

export const getAnimals = async (): Promise<Animal[]> => {
  const { data } = await axios.get(`${API_BASE}/animals`);
  return data.results;
};

export const getAnimalById = async (id: number): Promise<Animal> => {
  const { data } = await axios.get(`${API_BASE}/animals/${id}`);
  return data;
};

export const createAnimal = async (animal: Animal): Promise<Animal> => {
  const { data } = await axios.post(`${API_BASE}/animals`, animal);
  return data;
};

export const updateAnimal = async (animal: Animal): Promise<boolean> => {
  await axios.put(`${API_BASE}/animals/${animal.id}`, animal);
  return true;
};

export const deleteAnimal = async (id: number): Promise<boolean> => {
  await axios.delete(`${API_BASE}/animals/${id}`);
  return true;
};
