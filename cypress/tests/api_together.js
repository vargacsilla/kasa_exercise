/// <reference types="cypress" />

const format = (string) => {
  return string.replace(' ', '_')
}
// Create a couple of examples using your own preferred tool or solution (in a scripted way) in order to tell us
// which beer has 'Wyeast 3522 - Belgian Ardennes' yeast in it with 'Tomahawk' hops. Create a test that checks if
// the selected beer has exactly 12.5 grams of 'Magnum' hops and fails if the creator puts other amounts in it.
// Please also check if the IBU content is entered as a number and if the description for the beer is not empty.
describe('Yeast and hops', () => {
  const yeast = 'Wyeast 3522 - Belgian Ardennes'
  const hops = 'Tomahawk'

  beforeEach(() => {
    // NOTE: the API responds with paginated results, the max amount per page is 80.
    // A really thorough solution would cover results through multiple pages, but
    // now because of limited time I chose not to focus on this part.
    cy.request({
      url: 'https://api.punkapi.com/v2/beers',
      qs: {
          page: 1,
          per_page: 80,
          hops: `${format(hops)}`,
          yeast: `${format(yeast)}`
      },
    }).as('YeastAndHops')
        .should((response) => {
          expect(response).property('status').to.equal(200)
            expect(response).property('body').to.not.be.empty
        })
  })

  it(`Beers with '${yeast}' yeast and '${hops}' hops should have 12.5 grams of 'Magnum' hops, IBU as a number and not empty description `, () => {
      cy.get('@YeastAndHops')
          .should((response) => {
              expect(response.body).length.to.be.at.least(1);

              response.body.forEach(beer => {
                  expect(beer.ingredients.hops
                      .filter(hop =>
                          hop.name === 'Magnum' &&
                          hop.amount.value === 12.5 &&
                          hop.amount.unit === 'grams')).length.to.be.at.least(1)

                  expect(!!beer.ibu && !isNaN(beer.ibu)).to.be.true

                  expect(beer.description).not.to.be.empty
              })
          })
  })
})
