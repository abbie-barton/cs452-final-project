import {
  Title,
  Container,
  Grid,
  Card,
  Text,
  Group,
  ThemeIcon,
  Stack,
} from "@mantine/core";
import {
  IconPaw,
  IconUsers,
  IconCalendar,
  IconHeart,
} from "@tabler/icons-react";

export default function Home() {
  const stats = [
    { title: "Total Animals", value: "24", icon: IconPaw, color: "purple" },
    { title: "Available", value: "15", icon: IconHeart, color: "teal" },
    {
      title: "Pending Adoptions",
      value: "5",
      icon: IconCalendar,
      color: "orange",
    },
    {
      title: "Adopted This Month",
      value: "8",
      icon: IconUsers,
      color: "purple",
    },
  ];

  return (
    <Container size="xl">
      <Title order={1} mb="xl">
        Dashboard
      </Title>

      <Grid>
        {stats.map((stat) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={stat.title}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed" fw={500}>
                    {stat.title}
                  </Text>
                  <Text size="xl" fw={700}>
                    {stat.value}
                  </Text>
                </Stack>
                <ThemeIcon
                  size={60}
                  radius="md"
                  color={stat.color}
                  variant="light"
                >
                  <stat.icon size={32} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Grid mt="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Title order={3} mb="md">
              Quick Actions
            </Title>
            <Stack gap="md">
              <Card
                padding="md"
                radius="md"
                bg="purple.0"
                style={{ cursor: "pointer" }}
              >
                <Group>
                  <ThemeIcon size={40} radius="md" color="purple">
                    <IconPaw size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={500}>Manage Animals</Text>
                    <Text size="sm" c="dimmed">
                      Add, edit, or remove animals
                    </Text>
                  </div>
                </Group>
              </Card>

              <Card
                padding="md"
                radius="md"
                bg="teal.0"
                style={{ cursor: "pointer" }}
              >
                <Group>
                  <ThemeIcon size={40} radius="md" color="teal">
                    <IconUsers size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={500}>View Adoptions</Text>
                    <Text size="sm" c="dimmed">
                      Track adoption records
                    </Text>
                  </div>
                </Group>
              </Card>

              <Card
                padding="md"
                radius="md"
                bg="orange.0"
                style={{ cursor: "pointer" }}
              >
                <Group>
                  <ThemeIcon size={40} radius="md" color="orange">
                    <IconCalendar size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={500}>Schedule Events</Text>
                    <Text size="sm" c="dimmed">
                      Manage appointments and visits
                    </Text>
                  </div>
                </Group>
              </Card>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Title order={3} mb="md">
              Recent Activity
            </Title>
            <Stack gap="md">
              <div>
                <Text size="sm" fw={500}>
                  Luna adopted by John Smith
                </Text>
                <Text size="xs" c="dimmed">
                  2 hours ago
                </Text>
              </div>
              <div>
                <Text size="sm" fw={500}>
                  New animal added: Charlie (Dog)
                </Text>
                <Text size="xs" c="dimmed">
                  5 hours ago
                </Text>
              </div>
              <div>
                <Text size="sm" fw={500}>
                  Adoption application submitted for Max
                </Text>
                <Text size="xs" c="dimmed">
                  1 day ago
                </Text>
              </div>
              <div>
                <Text size="sm" fw={500}>
                  Bella's status updated to Available
                </Text>
                <Text size="xs" c="dimmed">
                  2 days ago
                </Text>
              </div>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
