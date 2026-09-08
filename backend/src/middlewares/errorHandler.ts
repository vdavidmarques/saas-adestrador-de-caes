import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // 1. Se for um erro de negócio que nós lançamos (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'erro',
      mensagem: err.message
    });
  }

  // 2. Se for um erro de validação do Zod que escapou
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'erro_validacao',
      erros: err.flatten().fieldErrors
    });
  }

  // 3. Se for um erro de banco de dados ou erro inesperado do Node (Status 500)
  console.error('❌ Erro Crítico:', err);
  
  return res.status(500).json({
    status: 'erro',
    mensagem: 'Ocorreu um erro interno no servidor.'
  });
}