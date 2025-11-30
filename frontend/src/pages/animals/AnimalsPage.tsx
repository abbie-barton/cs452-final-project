import { useEffect, useState } from "react";
import { getAnimals } from "../../api/animals";
import { Animal, Site, Gender, Size } from "../../types/Animal";
import { Card, Text, Container } from "@mantine/core";

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);

//   useEffect(() => {
//     getAnimals().then(setAnimals);
//   }, []);
useEffect(() => {
    setAnimals([{ id: 1, name: "Buddy", species: "Dog", breed: "Golden Retriever", site: Site.Provo, intake_date: "2023-10-01", color: "Golden", location_found: "Park", description: "Friendly and energetic", size: Size.Large, gender: Gender.Female}])
}, []);

  return (
    <Container>
      <h1>Animals</h1>
      {animals.map((a) => (
        <Card key={a.id} shadow="sm" padding="lg" mb="md">
          <Text>{a.name}</Text>
          <Text size="sm">{a.species} - {a.breed}</Text>
          <Text size="sm">Location: {a.location_found}</Text>
        </Card>
      ))}
    </Container>
  );
}
