// Input.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./index";
import { BsEnvelope, BsPerson, BsLock } from "react-icons/bs";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: "Nome", placeholder: "Digite seu nome" },
};

export const ComIcone: Story = {
  args: { label: "E-mail", placeholder: "seu@email.com", icon: BsEnvelope },
};

export const ComErro: Story = {
  args: { label: "Usuário", placeholder: "Digite o usuário", icon: BsPerson, error: "Campo obrigatório" },
};

export const Senha: Story = {
  args: { label: "Senha", type: "password", icon: BsLock, showPasswordToggle: true },
};

export const Obrigatorio: Story = {
  args: { label: "CPF", placeholder: "000.000.000-00", showRequired: true },
};