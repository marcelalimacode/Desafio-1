Cypress.Commands.add('criarUsuario', (usuario) => {
  return cy.request('POST', '/Account/v1/User', usuario);
});
