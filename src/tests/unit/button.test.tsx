import { render } from "@testing-library/react";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders button label", () => {
    const { getByRole } = render(<Button>Click me</Button>);
    expect(getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });
});
