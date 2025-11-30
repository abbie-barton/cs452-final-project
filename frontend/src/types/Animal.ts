export enum Site {
  Lehi = "Lehi",
  SaratogaSprings = "Saratoga Springs",
  Provo = "Provo",
}

export enum Size {
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
}

export enum Gender {
  Female = "Female",
  Male = "Male",
}

export interface Animal {
  id?: number;
  name: string;
  breed?: string;
  species: string;
  site: Site;
  intake_date: string;
  color: string;
  location_found: string;
  description?: string;
  size: Size;
  gender: Gender;
  spayed_or_neutered?: boolean;
  available_for_adoption?: boolean;
  housetrained?: boolean;
  declawed?: boolean;
  age?: number;
}
