/* eslint-disable no-undef */
describe("login", () => {
  it("user can login", () => {
    // visit home page
    cy.visit("/");

    // login button should be visible
    cy.findByRole("link", {
      name: /login/i,
    }).should("be.visible");

    // click login button
    cy.findByRole("link", {
      name: /login/i,
    }).click();

    // email input should be visible
    cy.findByRole("textbox", {
      name: /email\/username/i,
    }).should("be.visible");
    cy.findByRole("textbox", {
      name: /password/i,
    }).should("be.visible");

    // fill in email and password
    cy.findByRole("textbox", {
      name: /email\/username/i,
    }).type("xxx");
    cy.findByRole("textbox", {
      name: /password/i,
    }).type("xxx");

    // click submit
    cy.findByRole("button", { name: /submit/i }).click();

    // expect to see welcome message
    cy.findByText(/welcome/i).should("be.visible");

    // expect to be redirected to dashboard
    cy.findByRole("button", {
      name: /show clients/i,
    }).should("be.visible");

    // expect to click on show clients button
    cy.findByRole("button", {
      name: /show clients/i,
    }).click();

    // expect to see search bar
    cy.findByRole("heading", {
      name: /antama di tacchella angelo & c\./i,
    }).should("be.visible");

    // expect to click on a + button
    cy.get('[data-id="46"] > .sidebar-circle').click();

    // expect to see the address
    cy.findByRole("heading", {
      name: /cascina coronate snc \- 20081 morimondo \(mi\)/i,
    }).should("be.visible");

    // expect to click on a pod button
    cy.findByRole("heading", {
      name: /cascina coronate snc \- 20081 morimondo \(mi\)/i,
    }).click();

    // expect to update dashboard
    cy.findByText(/pod: it001e14906490/i);
  });
});
