/// <reference types="cypress" />

const format = (string) => {
  return string.replace(' ', '_')
}

describe('Selected beer', () => {

  // const beer = 'The End Of History'         // first two tests should fail with this beer
  const beer = 'AB:12'                   // all tests should pass with this beer

  beforeEach(() => {
    cy.request({
      url: 'https://api.punkapi.com/v2/beers',
      qs: {
          beer_name: `${format(beer)}`
      },
    }).as('SpecificBeer')
        .should((response) => {
          expect(response.status).to.equal(200)
          expect(response.body).to.have.length(1) //assuming that each beer has a unique name
          expect(response.body[0].name).to.equal(beer)
        })
  })

  //  Create a test that checks if the selected beer has exactly 12.5 grams of 'Magnum' hops
  //  and fails if the creator puts other amounts in it.
  it(`'${beer}' should contain 12.5 grams of 'Magnum' hops`, () => {
    cy.get('@SpecificBeer')
        .should((response) => {
          expect(response.body[0].ingredients.hops
              .filter(hop =>
                  hop.name === 'Magnum' &&
                  hop.amount.value === 12.5 &&
                  hop.amount.unit === 'grams')).length.to.be.at.least(1)
        })
  })

  //  Please also check if the IBU content is entered as a number.
  it(`'${beer}' should have IBU content entered as a number`, () => {
    cy.get('@SpecificBeer')
        .should((response) => {
          expect(!!response.body[0].ibu && !isNaN(response.body[0].ibu)).to.be.true
        })
  })

  //  Please also check if the description for the beer is not empty.
  it(`'${beer}' should have description`, () => {
    cy.get('@SpecificBeer')
        .should((response) => {
          expect(response.body[0].description).not.to.be.empty
        })
  })
})

