import { createAnimal } from "../services/animalService";
import { Site, Size, Gender } from "../../../shared/dist/types/Animal";

async function main() {
  try {
    const apollo = await createAnimal({
      name: "Apollo",
      species: "Dog",
      breed: "Golden Retriever/Lab Mix",
      site: Site.Lehi,
      intake_date: "2024-10-15",
      color: "Golden",
      location_found: "Local Hiking Trail",
      description:
        "A friendly, energetic dog, loves fetch and needs a big yard. Highly treat-motivated.",
      size: Size.Large,
      gender: Gender.Male,
      spayed_or_neutered: true,
      available_for_adoption: true,
      housetrained: true,
      age: 5,
    });

    console.log("Created animal:", apollo);
  } catch (error) {
    console.log("error creating animal: ", error);
  }
}

main();
