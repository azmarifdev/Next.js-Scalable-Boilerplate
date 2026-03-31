import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button } from "@/components/ui/button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary"
  }
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary"
  }
};
