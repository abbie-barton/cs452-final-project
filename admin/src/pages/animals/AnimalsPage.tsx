import { useState, useEffect } from "react";
import {
  Title,
  Container,
  Table,
  Button,
  Group,
  Badge,
  ActionIcon,
  Pagination,
  LoadingOverlay,
  Text,
  Paper,
  Grid,
  TextInput,
  Select,
  NumberInput,
} from "@mantine/core";
import { IconTrash, IconEdit, IconPlus } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Animal } from "../../types/Animal";
import { getAnimals, deleteAnimal } from "../../api/animals";
import NotificationModal from "../../components/NotificationModal";

export default function AnimalsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [filters, setFilters] = useState({
    name: "",
    site: "",
    size: "",
    gender: "",
    available: "",
    minAge: "",
    maxAge: "",
    sort: "newest",
  });

  useEffect(() => {
    const fetchAnimals = async () => {
      setLoading(true);
      try {
        const filterParams: Record<string, string> = {};

        if (filters.name) filterParams.name = filters.name;
        if (filters.site) filterParams.site = filters.site;
        if (filters.size) filterParams.size = filters.size;
        if (filters.gender) filterParams.gender = filters.gender;
        if (filters.available !== "" && filters.available !== undefined) {
          filterParams.available =
            filters.available === "true" ? "true" : "false";
        }
        if (filters.minAge)
          filterParams.minAge = String(Number(filters.minAge));
        if (filters.maxAge)
          filterParams.maxAge = String(Number(filters.maxAge));
        if (filters.sort)
          filterParams.sort = filters.sort as "newest" | "oldest";

        const { animals, totalPages } = await getAnimals(
          page,
          10,
          filterParams
        );

        setAnimals(animals);
        setTotalPages(totalPages);
      } catch (err) {
        console.error("Error fetching animals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, [page, filters]);

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

  useEffect(() => {
    setPage(1);
  }, [filters]);

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
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
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

      <Paper withBorder p="md" radius="lg" mb="xl">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <TextInput
              label="Search Name"
              placeholder="Bella..."
              value={filters.name}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, name: e.currentTarget.value }))
              }
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Site"
              placeholder="Select site"
              data={["", "Lehi", "Saratoga Springs", "Provo"]}
              value={filters.site}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, site: value || "" }))
              }
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Size"
              placeholder="Select size"
              data={["", "Small", "Medium", "Large"]}
              value={filters.size}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, size: value || "" }))
              }
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Gender"
              placeholder="Select gender"
              data={["", "Female", "Male"]}
              value={filters.gender}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, gender: value || "" }))
              }
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Availability"
              data={[
                { value: "", label: "All" },
                { value: "true", label: "Available" },
                { value: "false", label: "Not Available" },
              ]}
              value={filters.available}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, available: value || "" }))
              }
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6, md: 3 }}>
            <NumberInput
              label="Min age"
              min={0}
              value={filters.minAge}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  minAge: value?.toString() || "",
                }))
              }
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6, md: 3 }}>
            <NumberInput
              label="Max age"
              min={0}
              value={filters.maxAge}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  maxAge: value?.toString() || "",
                }))
              }
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              label="Sort by date"
              data={[
                { value: "newest", label: "Newest first" },
                { value: "oldest", label: "Oldest first" },
              ]}
              value={filters.sort}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, sort: value || "newest" }))
              }
            />
          </Grid.Col>
        </Grid>

        <Group justify="space-between" mt="md">
          <Button
            variant="light"
            color="gray"
            onClick={() => {
              setFilters({
                name: "",
                site: "",
                size: "",
                gender: "",
                available: "",
                minAge: "",
                maxAge: "",
                sort: "newest",
              });
              setPage(1);
            }}
          >
            Clear filters
          </Button>

          <Text size="sm" c="dimmed">
            {animals.length} results on this page
          </Text>
        </Group>
      </Paper>

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

      <Group justify="center" mt="xl">
        <Pagination
          total={totalPages}
          value={page}
          onChange={setPage}
          color="purple"
          radius="md"
        />
      </Group>

      <NotificationModal
        message={successMessage}
        isOpen={successModalOpen}
        setIsOpen={setSuccessModalOpen}
        type="success"
      />
    </Container>
  );
}
