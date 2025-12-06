import axios from "axios";
import { Animal } from "../types/Animal";
import { AnimalFilters } from "../types/AnimalFilters";

const API_BASE = "https://gxxmq0jkd0.execute-api.us-east-2.amazonaws.com";

export const getAnimals = async (
  page = 1,
  limit = 10,
  filters: AnimalFilters = {}
): Promise<{ animals: Animal[]; totalPages: number; total: number }> => {
  const params = new URLSearchParams();

  // Pagination
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  // Filters
  if (filters.name) params.append("name", filters.name);
  if (filters.species) params.append("species", filters.species);
  if (filters.site) params.append("site", filters.site);
  if (filters.size) params.append("size", filters.size);
  if (filters.gender) params.append("gender", filters.gender);

  if (filters.available !== undefined) {
    params.append("available", String(filters.available));
  }

  if (filters.minAge !== undefined) {
    params.append("minAge", filters.minAge.toString());
  }

  if (filters.maxAge !== undefined) {
    params.append("maxAge", filters.maxAge.toString());
  }

  // Sorting
  if (filters.sort) {
    params.append("sort", filters.sort); // "newest" or "oldest"
  }

  const { data } = await axios.get(`${API_BASE}/animals?${params.toString()}`);

  return {
    animals: data.animals,
    totalPages: data.totalPages,
    total: data.total,
  };
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
