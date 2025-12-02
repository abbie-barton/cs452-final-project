import { useState, useEffect } from "react";
import {
  Title,
  Container,
  Table,
  Button,
  Group,
  Badge,
  ActionIcon,
  LoadingOverlay,
} from "@mantine/core";
import { IconTrash, IconEdit, IconPlus } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Animal } from "../../types/Animal";
import { getAnimals, deleteAnimal } from "../../api/animals";
import SuccessModal from "../../components/SuccessModal";

export default function AnimalsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchAnimals = async () => {
      setLoading(true);
      try {
        const data = await getAnimals();
        setAnimals(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching animals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setSuccessModalOpen(true);
      window.history.replaceState({}, document.title);

      setTimeout(() => {
        setSuccessModalOpen(false);
      }, 3000);
    }
  }, [location.state]);

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteAnimal(id);
      setAnimals((prev) => prev.filter((a) => a.id !== id));
      setLoading(false);
      setSuccessMessage("Animal deleted successfully");
      setSuccessModalOpen(true);

      setTimeout(() => {
        setSuccessModalOpen(false);
      }, 3000);
    } catch (err) {
      console.error("Error deleting animal:", err);
      setLoading(false);
    } 
  };

  return (
    <Container size="xl" pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <Group justify="space-between" mb="xl">
        <Title order={1}>All Animals</Title>
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={() => navigate("/animals/add")}
          color="purple"
          size="md"
        >
          Add New Animal
        </Button>
      </Group>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Species</Table.Th>
            <Table.Th>Breed</Table.Th>
            <Table.Th>Age</Table.Th>
            <Table.Th>Site</Table.Th>
            <Table.Th>Size</Table.Th>
            <Table.Th>Gender</Table.Th>
            <Table.Th>Available</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {animals.length > 0 ? (
            animals.map((animal) => (
              <Table.Tr key={animal.id}>
                <Table.Td>{animal.name}</Table.Td>
                <Table.Td>{animal.species}</Table.Td>
                <Table.Td>{animal.breed || "-"}</Table.Td>
                <Table.Td>{animal.age ? `${animal.age} years` : "-"}</Table.Td>
                <Table.Td>{animal.site}</Table.Td>
                <Table.Td>{animal.size}</Table.Td>
                <Table.Td>{animal.gender}</Table.Td>
                <Table.Td>
                  <Badge
                    color={animal.available_for_adoption ? "teal" : "orange"}
                    variant="light"
                  >
                    {animal.available_for_adoption ? "Yes" : "No"}
                  </Badge>
                </Table.Td>

                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="light"
                      color="orange"
                      size="lg"
                      onClick={() => navigate(`/animals/edit/${animal.id}`)}
                    >
                      <IconEdit size={18} />
                    </ActionIcon>

                    <ActionIcon
                      variant="light"
                      color="red"
                      size="lg"
                      onClick={() => handleDelete(animal.id!)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={9} style={{ textAlign: "center" }}>
                {loading ? "Loading..." : "No animals found"}
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      <SuccessModal
        successModalOpen={successModalOpen}
        setSuccessModalOpen={setSuccessModalOpen}
        successMessage={successMessage}
      />
    </Container>
  );
}
