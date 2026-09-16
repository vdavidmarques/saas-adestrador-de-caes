import { z } from 'zod';

export const adestradorSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.email('Formato de e-mail inválido.'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.')
});

export const loginSchema = z.object({
  email: z.email('Formato de e-mail inválido.'),
  senha: z.string().min(1, 'A senha é obrigatória.')
});