import { screen, render } from "@testing-library/react";
import Register from "../pages/register";

jest.mock("../utils/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
    from: jest.fn(() => ({
      insert: jest.fn(),
    })),
  },
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

const setup = () => {
  render(<Register />);
};

describe("register page", () => {
  it("renders a register heading", () => {
    setup();
    const heading = screen.getByRole("heading", { name: /register/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders an email input", () => {
    setup();
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    expect(emailInput).toBeInTheDocument();
  });

  it("renders a password input", () => {
    setup();
    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toBeInTheDocument();
  });

  it("renders a confirm password input", () => {
    setup();
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("renders a link to sign in", () => {
    setup();
    const link = screen.getByRole("link", {
      name: "Already have an account? Sign In",
    });
    expect(link).toHaveAttribute("href", "/sign-in");
  });

  it("renders a register button", () => {
    setup();
    const registerButton = screen.getByRole("button", {
      name: /register/i,
    });
    expect(registerButton).toBeInTheDocument();
  });
});
