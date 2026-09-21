import request from 'supertest';
import { describe, expect, it } from '@jest/globals';
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
  
  it('deve bloquear o acesso e retornar 401 ao tentar listar tutores sem enviar o Token JWT', async () => {
    // Simulamos uma requisição GET sem configurar o header 'Authorization'
    const resposta = await request(app).get('/tutores');

    // A expectativa é que o nosso auth.middleware intercepte e barre a requisição
    expect(resposta.status).toBe(401);
    expect(resposta.body.mensagem).toBe('Token JWT não fornecido.');
  });
});