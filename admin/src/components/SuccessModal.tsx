import { Paper, Group, Text, CloseButton, Transition } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

export default function SuccessModal({
  successMessage,
  successModalOpen,
  setSuccessModalOpen,
}: {
  successMessage: string;
  successModalOpen: boolean;
  setSuccessModalOpen: (open: boolean) => void;
}) {
  return (
    <Transition
      mounted={successModalOpen}
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
              <IconCheck size={24} color="var(--mantine-color-teal-6)" />
              <div>
                <Text fw={600} size="sm">
                  Success
                </Text>
                <Text size="sm" c="dimmed">
                  {successMessage}
                </Text>
              </div>
            </Group>
            <CloseButton onClick={() => setSuccessModalOpen(false)} />
          </Group>
        </Paper>
      )}
    </Transition>
  );
}
