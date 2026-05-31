
import type { Meta, StoryObj } from "@storybook/react";
import { InfoCard } from "./index";
import { FiInfo, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const meta: Meta<typeof InfoCard> = {
  title: "Components/InfoCard",
  component: InfoCard,
};

export default meta;
type Story = StoryObj<typeof InfoCard>;

export const Default: Story = {
  args: {
    title: "Informações",
    items: ["Item um", "Item dois", "Item três"],
    icon: FiInfo,
  },
};

export const Sucesso: Story = {
  args: {
    title: "Tudo certo!",
    items: ["Cadastro realizado", "Email confirmado"],
    icon: FiCheckCircle,
    variant: "success",
    iconColor: "success",
  },
};

export const Aviso: Story = {
  args: {
    title: "Atenção",
    items: ["Prazo se encerrando", "Documentos pendentes"],
    icon: FiAlertTriangle,
    variant: "warning",
    iconColor: "warning",
  },
};

export const SemIcone: Story = {
  args: {
    title: "Sem ícone",
    items: ["Item um", "Item dois"],
  },
};