// AvatarUpload.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { AvatarUpload } from "./index";

const meta: Meta<typeof AvatarUpload> = {
  title: "Components/AvatarUpload",
  component: AvatarUpload,
};

export default meta;
type Story = StoryObj<typeof AvatarUpload>;

const handlers = {
  onUpload: async () => {},
  onRemove: async () => {},
};

export const SemAvatar: Story = {
  args: {
    userName: "João Silva",
    ...handlers,
  },
};

export const ComAvatar: Story = {
  args: {
    userName: "João Silva",
    currentAvatar: "https://i.pravatar.cc/150?img=3",
    ...handlers,
  },
};

export const Enviando: Story = {
  args: {
    userName: "João Silva",
    currentAvatar: "https://i.pravatar.cc/150?img=3",
    isUploading: true,
    ...handlers,
  },
};

export const Sucesso: Story = {
  args: {
    userName: "João Silva",
    currentAvatar: "https://i.pravatar.cc/150?img=3",
    showSuccess: true,
    ...handlers,
  },
};

export const ComErro: Story = {
  args: {
    userName: "João Silva",
    uploadError: "Erro ao enviar imagem. Tente novamente.",
    ...handlers,
  },
};