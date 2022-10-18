import { screen, render } from "@testing-library/react";
import Register from "../pages/register";

const setup = () => {
  render(<Register />);
};

describe("register page", () => {
  it("renders a register heading", () => {
    setup();
    expect(
      screen.getByRole("heading", { name: /register/i })
    ).toBeInTheDocument();
  });

  it("renders an email input", () => {
    setup();
    expect(screen.getByRole("textbox", { name: /email/i }));
  });
});
