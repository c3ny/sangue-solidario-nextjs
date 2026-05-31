// Spinner.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Spinner, FullPageSpinner, InlineSpinner } from "./index";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Grande: Story = {
  args: { size: "xl" },
};

export const ComLabel: Story = {
  args: { showLabel: true, label: "Carregando dados..." },
};

export const Centralizado: Story = {
  args: { centered: true },
};

// FullPageSpinner e InlineSpinner são componentes separados,
// então usam render customizado

export const PaginaInteira: Story = {
  render: () => <FullPageSpinner label="Carregando aplicação..." />,
};

export const Inline: Story = {
  render: () => (
    <button style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <InlineSpinner variant="dark" /> Salvando...
    </button>
  ),
};