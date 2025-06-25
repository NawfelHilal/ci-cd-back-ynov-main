describe("GET /", () => {
  it("gets a welcome message", () => {
    cy.request("GET", "/").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.eq("Hello World")
    })
  })
})

describe("GET /users", () => {
  it("gets a list of users", () => {
    cy.request("GET", "/users").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.utilisateurs.length).to.eq(2)
    })
  })
})

describe("POST /users", () => {
  it("create a user", () => {
    cy.request('POST', '/users', { name: 'Jane', email: "jane@j.j" }).then(
      (response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('name', 'Jane') // true
      })
    cy.request("GET", "/users").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.utilisateurs.length).to.eq(3)
    })
  })
})