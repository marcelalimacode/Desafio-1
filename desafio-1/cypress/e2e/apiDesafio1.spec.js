/// <reference types="cypress" />

describe('Desafio API - Parte 1', () => {
  const BASE_URL = 'https://demoqa.com';
  const USERNAME = `user${Date.now()}`;
  const PASSWORD = 'SenhaForte123!';
  let userId;
  let token;

  it('Executa todo o fluxo do desafio', () => {
    // 1️⃣ Criar usuário
    cy.request('POST', `${BASE_URL}/Account/v1/User`, {
      userName: USERNAME,
      password: PASSWORD
    }).then((res) => {
      expect(res.status).to.eq(201);
      userId = res.body.userID;
      cy.log('Usuário criado: ' + userId);
    });

    // 2️⃣ Gerar token
    cy.request('POST', `${BASE_URL}/Account/v1/GenerateToken`, {
      userName: USERNAME,
      password: PASSWORD
    }).then((res) => {
      expect(res.status).to.eq(200);
      token = res.body.token;
      cy.log('Token gerado: ' + token);
    });

    // 3️⃣ Confirmar autorização
    cy.request('POST', `${BASE_URL}/Account/v1/Authorized`, {
      userName: USERNAME,
      password: PASSWORD
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.authorized).to.be.true;
      cy.log('Usuário autorizado');
    });

    // 4️⃣ Listar livros disponíveis e 5️⃣ Alugar dois livros
    cy.request('GET', `${BASE_URL}/BookStore/v1/Books`).then((res) => {
      expect(res.status).to.eq(200);
      const books = res.body.books;
      const selectedBooks = books.slice(0, 2).map(b => ({ isbn: b.isbn }));

      cy.request({
        method: 'POST',
        url: `${BASE_URL}/BookStore/v1/Books`,
        headers: { Authorization: `Bearer ${token}` },
        body: {
          userId: userId,
          collectionOfIsbns: selectedBooks
        }
      }).then((res) => {
        expect(res.status).to.eq(201);
        cy.log('Livros alugados com sucesso!');
      });
    });

    // 6️⃣ Listar detalhes do usuário
    cy.request({
      method: 'GET',
      url: `${BASE_URL}/Account/v1/User/${userId}`,
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      expect(res.status).to.eq(200);
      cy.log('Detalhes do usuário: ' + JSON.stringify(res.body));
    });
  });
});
