describe("Blog app", function () {
  beforeEach(function () {
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to application");
    cy.contains("label", "username").find("input");
    cy.contains("label", "password").find("input");
    cy.get("button").contains("login");
  });
});
