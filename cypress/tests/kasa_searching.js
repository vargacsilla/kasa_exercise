/// <reference types="cypress" />

describe('Searching Kasas', () => {

  const locations =  require('../fixtures/locations')

  beforeEach(() => {
    cy.clearCookies()
    cy.visit('https://kasa.com')
    cy.killEmailPopup()
  })

  locations.forEach((city) => {
    // Search Kasas in at least three different locations including Austin, TX
    it(`Searching for a Kasa in ${city} should list properties`, () => {

      cy.searchForLocation(city)

      cy.get('.location-list .list-page__title')
          .contains(city)
      cy.get('.property-card__content')
          .should('have.length.at.least', 1)
    })

    // Check if our system does not allow guests to book a single-night stay at all searched locations
    it(`Should not be able to book single night stay at ${city}`, () => {

      cy.searchForLocation(city)

      cy.get('#nav-check-in-input').type('03/01/2022')
      cy.get('#nav-check-out-input').type('03/02/2022')
      cy.get('button[type=\'submit\']').contains('Search').click()

      cy.get('.property-card button').each(button => {
        cy.wrap(button).contains('Change dates')
      })
      cy.get('.property-card .recommended-room-type').should('not.exist')
    })

    // Include a scenario that checks if a selected Kasa has "Heating" in the amenities list when
    // a user visits the property details pages for all the locations they have searched for previously
    it(`First Kasa in ${city} should have heating`, () => {

      cy.searchForLocation(city)

      cy.get('.property-card__content')
          .should('have.length.at.least', 1)
          .first()
          .find('.property-card__name')
          .click()

      cy.get('.room-type-card__content')
          .should('have.length.at.least', 1)
          .first()
          .find('.room-type-card__header-title')
          .click()

      cy.get('.room-type-popup__amenities-list')
          .should('have.length.at.least', 1)
          .contains('Heating')
    })
  })
})
