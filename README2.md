/**
 * ============================================================
 *  QA Script Recorder  |  MODERATE LEVEL
 *  Framework : Cypress 13.17.0
 *  Node.js   : 20+
 *  Pattern   : describe() + it() with visibility assertions
 *  Generated : 2026-05-07T10:05:38.932Z
 * ============================================================
 *
 *  DIFFERENCES FROM BEGINNER LEVEL
 *  ────────────────────────────────
 *  • Wrapped in describe() block for organised reporting
 *  • Every click asserts element visibility first
 *    → Catches missing/hidden elements before interacting
 *  • Uses should() assertions for more reliable tests
 *  • Proper structure for scaling to multiple test cases
 *
 *  Setup:
 *    npm install cypress@13.17.0 --save-dev
 *
 *  Run:
 *    npx cypress open   (interactive — watch it run)
 *    npx cypress run    (headless — for CI/CD)
 *
 *  PASSWORDS
 *  ─────────
 *  Create cypress.env.json in your project root:
 *    { "TEST_PASSWORD": "your_password" }
 *
 *  DELETING COMMENTS
 *  ─────────────────
 *  Inline // comments explain the purpose of each command.
 *  Delete any you no longer need.
 * ============================================================
 */

/// <reference types="cypress" />

describe('RecordedTest', () => {

  it('recorded test', () => {

    // ── Recorded Actions ───────────────────────────────────────────────────
    // Navigate to the starting URL
    // Cypress automatically waits for the page to fully load
    cy.visit('https://dev.zukraan.com/onboarding/term');

    // Assert the element "Select Age" is visible before clicking
    // should() makes the assertion — Cypress retries until it passes or times out
    cy.get("select.w-full.px-4").should('be.visible').click();

    // Pick the dropdown option matching this visible text
    cy.get("select.w-full.px-4").select('25 years');

    // Assert the element "Male" is visible before clicking
    // should() makes the assertion — Cypress retries until it passes or times out
    cy.get("button.flex-1.px-6:nth-child(1)").should('be.visible').click();

    // Assert the element "Continue" is visible before clicking
    // should() makes the assertion — Cypress retries until it passes or times out
    cy.xpath("/html[1]/body[1]/div[1]/div[1]/div[1]/main[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[1]/button[1]").should('be.visible').click();

    // Check the checkbox (idempotent — safe to repeat)
    cy.get("label.flex.items-center:nth-child(1) > input.w-5.h-5").check();

    // Check the checkbox (idempotent — safe to repeat)
    cy.get("label.flex.items-center:nth-child(1) > input.w-5.h-5").check();

    // Clear any existing value then type the new one
    cy.get("[name=\"full_name\"]").clear().type('alex kashyap');

    // Clear any existing value then type the new one
    cy.get("[placeholder=\"Enter your number\"]").clear().type('+91 91980 71230');

    // Clear any existing value then type the new one
    cy.get("[name=\"full_name\"]").clear().type('alex kashyap');

    // Clear any existing value then type the new one
    cy.get("[placeholder=\"Enter your number\"]").clear().type('+91 4323 233 232');

    // Clear any existing value then type the new one
    cy.get("[name=\"email\"]").clear().type('test@covertiger.com');

    // Assert the element "Continue" is visible before clicking
    // should() makes the assertion — Cypress retries until it passes or times out
    cy.xpath("/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[1]/form[1]/div[5]/button[1]").should('be.visible').click();

    // Assert the element "Yes" is visible before clicking
    // should() makes the assertion — Cypress retries until it passes or times out
    cy.get("button.px-8.py-2:nth-child(1)").should('be.visible').click();

    // Assert the element "Salaried" is visible before clicking
    // should() makes the assertion — Cypress retries until it passes or times out
    cy.get("button.px-8.py-2:nth-child(1)").should('be.visible').click();

    // Assert the element "Bengaluru" is visible before clicking
    // should() makes the assertion — Cypress retries until it passes or times out
    cy.get("button.inline-flex.items-center:nth-child(1)").should('be.visible').click();

    // ── End of recorded actions ──────────────────────────────────────────

  });

});
