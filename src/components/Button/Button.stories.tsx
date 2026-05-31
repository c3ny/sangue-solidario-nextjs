// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./index";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Confirmar",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Cancelar",
    variant: "secondary",
  },
};

export const Danger: Story = {
  args: {
    children: "Excluir",
    variant: "danger",
  },
};

export const Loading: Story = {
  args: {
    children: "Salvar",
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Indisponível",
    disabled: true,
  },
};