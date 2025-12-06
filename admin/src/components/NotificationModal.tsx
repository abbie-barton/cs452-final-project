import { Paper, Group, Text, CloseButton, Transition } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

export default function NotificationModal({
  message,
  isOpen,
  setIsOpen,
  type = "success",
}: {
  message: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  type?: "success" | "error";
}) {
  const isSuccess = type === "success";
  
  return (
    <Transition
      mounted={isOpen}
      transition="slide-up"
      duration={400}
      timingFunction="ease"
    >
      {(styles) => (
        <Paper
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 9999,
            ...styles,
          }}
          shadow="lg"
          p="md"
          radius="md"
          withBorder
          w={350}
        >
          <Group justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              {isSuccess ? (
                <IconCheck size={24} color="var(--mantine-color-teal-6)" />
              ) : (
                <IconX size={24} color="var(--mantine-color-red-6)" />
              )}
              <div>
                <Text fw={600} size="sm">
                  {isSuccess ? "Success" : "Error"}
                </Text>
                <Text size="sm" c="dimmed">
                  {message}
                </Text>
              </div>
            </Group>
            <CloseButton onClick={() => setIsOpen(false)} />
          </Group>
        </Paper>
      )}
    </Transition>
  );
}