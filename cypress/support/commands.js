Cypress.Commands.add('fillMainDatePicker', (checkIn, checkOut) => {
    cy.get('#full-screen-hero-check-in-input')
        .should('be.visible')
        .should('have.length', 1)
        .should('be.empty')
        .type(checkIn)

    cy.get('#full-screen-hero-check-out-input')
        .should('be.visible')
        .should('have.length', 1)
        .should('be.empty')
        .type(checkOut)
        .blur()
})

Cypress.Commands.add('searchForLocation', (location) => {
    cy.get('#full-screen-hero-search-input')
        .should('be.visible')
        .should('have.length', 1)
        .should('be.empty')
        .type(location)

    cy.get('button[type=\'submit\'].is-primary').click()
})

// I know, I know, this is ugly - if I had more time and info,
// I would have handled the iframe situation by setting cookies
// so that it does not appear at all.
Cypress.Commands.add('killEmailPopup', (checkIn, checkOut) => {
    const getIframeDocument = () => {
        return cy
            .get('iframe.ab-in-app-message', { timeout: 10000 })
            .its('0.contentDocument')
    }

    const getIframeBody = () => {
        return getIframeDocument()
            .its('body').should('not.be.undefined')
            .then(cy.wrap)
    }

    getIframeBody().find('.ab-close-button').click()
})

