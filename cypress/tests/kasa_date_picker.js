/// <reference types="cypress" />

//Create a test using the date picker component to ensure that bookings can be only made on a future date
describe('Main page date picker tests', () => {

  const errorMessages = require('../fixtures/errorMessages.json')

  const formatDate = (date) => {
    let temp = new Intl.DateTimeFormat('en-US').format(date).toString()
    return `${temp.charAt(1) === '/'? 0 + temp : temp}`
  }

  beforeEach(() => {
    cy.visit('https://kasa.com')
    cy.killEmailPopup()
  })

  it('Search panel shows error for past check-in and check-out dates',() => {
    let pastCheckIn = `01/01/1990`
    let pastCheckOut = `01/07/1990`

    cy.fillMainDatePicker(pastCheckIn, pastCheckOut)

    cy.get('#full-screen-hero-invalid-dates-error')
        .should('be.visible')
        .contains(errorMessages.invalidDate)
  })

  it('Search panel shows error for past check-in and current day check-out dates',() => {
    let pastCheckIn = '01/29/2022'
    let todayCheckout = formatDate(new Date)

    cy.fillMainDatePicker(pastCheckIn, todayCheckout)

    cy.get('#full-screen-hero-invalid-dates-error')
        .should('be.visible')
        .contains(errorMessages.invalidDate)
  })

  it('Search panel shows error for current day check-in and future check-out dates',() => {
    let todayCheckIn = formatDate(new Date)
    let futureCheckOut = '02/22/2022'

    cy.fillMainDatePicker(todayCheckIn, futureCheckOut)

    cy.get('#full-screen-hero-invalid-dates-error')
        .should('be.visible')
        .contains(errorMessages.invalidDate)
  })

  it('Search panel shows NO error for future check-in and check-out dates',() => {
    let futureCheckIn = '03/20/2022'
    let futureCheckOut = '03/22/2022'

    cy.fillMainDatePicker(futureCheckIn, futureCheckOut)

    cy.get('#full-screen-hero-invalid-dates-error')
        .should('not.exist')
  })
})
