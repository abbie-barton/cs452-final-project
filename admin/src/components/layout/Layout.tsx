import { AppShell, Title, Group } from "@mantine/core";
import { IconPaw } from "@tabler/icons-react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <>
      <AppShell
      header={{ height: 70 }}
      navbar={{ 
        width: 200, 
        breakpoint: "sm",
      }}
      padding="md"
    >
        <AppShell.Header>
          <Group h="100%" px="md" style={{ alignItems: "center" }}>
            <IconPaw size={32} color="purple.6" />
            <Title order={2} c="purple.6">
              Animal Shelter Admin Portal
            </Title>
          </Group>
        </AppShell.Header>
        <Sidebar />
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  );
}
