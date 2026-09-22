import request from 'supertest';
import { describe, expect, it, jest } from '@jest/globals';
import app from '../app';
import jwt from 'jsonwebtoken';

// Mockando o banco de dados e forçando a devolver arrays vazios para não quebrar a desestruturação
jest.mock('../database', () => ({
  query: jest.fn<() => Promise<[unknown[], unknown[]]>>().mockResolvedValue([[], []]),
}));

describe('Testes de Integração - Módulo de Tutores', () => {

  // Geramos um "crachá" (Token JWT) válido falso apenas para o teste usar
  const tokenValido = jwt.sign(
    { id: 1 }, 
    process.env.JWT_SECRET || 'chave_fallback_insegura'
  );
  
  it('deve retornar status 400 e os erros de validação do Zod se o corpo do POST /tutores estiver vazio ou inválido', async () => {
    // Simulamos uma requisição POST sem enviar os dados obrigatórios
    const resposta = await request(app)
      .post('/tutores')
      .set('Authorization', `Bearer ${tokenValido}`)//Mostramos o crachá para o segurança!
      .send({});// Enviamos o corpo vazio

    // O Zod deve interceptar e retornar 400 Bad Request
    expect(resposta.status).toBe(400);
    expect(resposta.body).toHaveProperty('erros');
  });
  
  // O teste do 401 fica IGUAL, pois nele nós propositalmente NÃO enviamos o token (.set)
  it('deve bloquear o acesso e retornar 401 ao tentar listar tutores sem enviar o Token JWT', async () => {
    // Simulamos uma requisição GET sem configurar o header 'Authorization'
    const resposta = await request(app).get('/tutores');

    // A expectativa é que o nosso auth.middleware intercepte e barre a requisição
    expect(resposta.status).toBe(401);
    expect(resposta.body.mensagem).toBe('Token JWT não fornecido.');
  });
});