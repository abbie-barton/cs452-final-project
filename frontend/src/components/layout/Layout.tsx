import { AppShell, Title, Container, Group } from "@mantine/core";
import { IconPaw } from "@tabler/icons-react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <AppShell header={{ height: 70 }} padding="md">
        <AppShell.Header>
          <Container
            size="xl"
            h="100%"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Group>
              <IconPaw size={32} color="purple.6" />
              <Title order={2} c="purple.6">
                Animal Shelter Admin Portal
              </Title>
            </Group>
          </Container>
        </AppShell.Header>
        <AppShell.Main><Outlet /></AppShell.Main>
      </AppShell>
    </>
  );
}
