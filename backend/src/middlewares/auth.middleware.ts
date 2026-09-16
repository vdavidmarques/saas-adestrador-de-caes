import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

export function verificarToken(req: Request, res: Response, next: NextFunction) {
  // 1. Captura o token enviado no cabeçalho (Header) da requisição
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token JWT não fornecido.', 401);
  }

  // O padrão do cabeçalho é: "Bearer eyJhbGci..."
  // Usamos a desestruturação de array para descartar a palavra "Bearer" e pegar só o token
  const [, token] = authHeader.split(' ');

  try {
    // 2. Tenta abrir o token com a nossa chave secreta
    const secret = process.env.JWT_SECRET || 'chave_fallback_insegura';
    const decoded = jwt.verify(token, secret);

    // 3. Se deu certo, injetamos o ID do adestrador na requisição para uso futuro
    // (O TypeScript reclama se adicionarmos propriedades novas ao req padrão, então forçamos com 'any' por enquanto)
    (req as any).adestradorId = (decoded as any).id;

    // 4. Libera a catraca para a rota continuar executando (chama o próximo middleware ou controlador)
    return next();
  } catch (error) {
    // Se o token foi adulterado, forjado ou o tempo (expiresIn) passou, o verify quebra
    throw new AppError('Token inválido ou expirado.', 401);
  }
}