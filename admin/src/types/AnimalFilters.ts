export interface AnimalFilters {
  name?: string;
  species?: string;
  site?: string;
  size?: string;
  gender?: string;
  available?: boolean;
  minAge?: number;
  maxAge?: number;
  sort?: "newest" | "oldest";
}