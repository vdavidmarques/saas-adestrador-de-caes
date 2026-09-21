import request from 'supertest';
import app from '../app';

describe('Testes de Integração - Módulo de Tutores', () => {
  
  it('deve retornar status 400 e os erros de validação do Zod se o corpo do POST /tutores estiver vazio ou inválido', async () => {
    // Simulamos uma requisição POST sem enviar os dados obrigatórios
    const resposta = await request(app)
      .post('/tutores')
      .send({});

    // O Zod deve interceptar e retornar 400 Bad Request
    expect(resposta.status).toBe(400);
    expect(resposta.body).toHaveProperty('erros');
  });

});