import { AppShell, NavLink } from "@mantine/core";
import { IconPaw, IconUsers, IconHome, IconHeart } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Animals", icon: IconPaw, path: "/animals" },
    { label: "Users", icon: IconUsers, path: "/users" },
    { label: "Foster", icon: IconHome, path: "/foster" },
    { label: "Adoption", icon: IconHeart, path: "/adoption" },
  ];

  return (
    <AppShell.Navbar p="md">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          label={item.label}
          leftSection={<item.icon size={20} />}
          onClick={() => navigate(item.path)}
          active={location.pathname.startsWith(item.path)}
          color="purple"
          variant="filled"
          mb="xs"
        />
      ))}
    </AppShell.Navbar>
  );
}
