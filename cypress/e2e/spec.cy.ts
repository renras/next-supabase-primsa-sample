import { faker } from "@faker-js/faker";

describe("authentication", () => {
  it("should sign in and sign out the user", () => {
    cy.visit("/register");
    const email = faker.internet.email();
    const password = faker.internet.password();

    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type(password);
    cy.get("input[name=confirmPassword]").type(password);

    cy.get("button[type=submit]").click();

    cy.contains(email.toLowerCase());
    cy.contains("Sign Out");
    // get signout button and click it
    cy.get("button").contains("Sign Out").click();
    cy.contains("Sign In");
  });
});
