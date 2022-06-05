const login = (name) => {
  cy.session(name, () => {
    cy.request({
      method: "POST",
      url: "/api/login",
    });
    cy.getCookie("openfoam_token").should("exist");
  });
};

describe("E2E", () => {
  it("ran a hamFoam case", () => {
    //init session
    login("cypress");
    cy.getCookie("openfoam_token").should("exist");

    //select solver
    cy.visit("/");
    cy.location().should((loc) => expect(loc.pathname).to.eq("/solver"));
    cy.get("[data-testid=solver-select]").parent().click();
    cy.get("[data-value=hamFoam]").click();
    cy.get("[data-testid=solver-next]").click();
    //edit
    cy.get("[data-rct-item-id=system]").click();
    cy.get("[data-rct-item-id='system/controlDict']").click();
    cy.get("[data-testid=edit-controldict-endtime]")
      .clear()
      .type("5184")
      .should("have.value", "5184");
    cy.get("[data-testid=edit-controldict-writeinterval]")
      .clear()
      .type("86")
      .should("have.value", "86");
    cy.get("[data-testid=edit-save]").click().wait(300);
    //run
    cy.visit("/run");
    cy.get("[data-testid=run-start]").click();
    //log
    cy.get("[data-testid=log-text]")
      .contains(
        "/*---------------------------------------------------------------------------*\\",
        { timeout: 10000 }
      )
      .should("not.contain", "hamFoam: not found");

    //post
    cy.visit("/postprocess");
    cy.get("[data-testid=post-start]").click();
    cy.get("[data-testid=post-download]").should("be.enabled");
  });
  after(() => {
    cy.request({
      method: "POST",
      url: "/api/logout",
    });
  });
});
