/// <reference types="cypress" />

const format = (string) => {
  return string.replace(' ', '_')
}
// Create a couple of examples using your own preferred tool or solution (in a scripted way) in order to
// tell us which beer has 'Wyeast 3522 - Belgian Ardennes' yeast in it with 'Tomahawk' hops.
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

  it(`There should be at least one beer with '${yeast}' yeast and '${hops}' hops in it`, () => {
    cy.get('@YeastAndHops')
        .should((response) => {
          expect(response.body).length.to.be.at.least(1);
        })
    })

  it(`Log out all the beers with '${yeast}' yeast and '${hops}' hops in it`, () => {
    cy.log(`The following beers have '${yeast}' yeast and '${hops}' hops:`);
    cy.get('@YeastAndHops').then((response) => {
        response.body.forEach((item) => {
            cy.log(item.name)
        })
      })
    })

  it(`Filtered beers should contain '${yeast}' yeast and '${hops}' hops`, () => {
    cy.get('@YeastAndHops')
        .should((response) => {
          expect(response.body.every(beer => {
            return beer.ingredients.hops.find(hop => hop === hops) &&
            beer.yeast === yeast}))
        })
  })
})
