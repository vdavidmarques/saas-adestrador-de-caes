import { z } from 'zod';

export const caoSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  raca: z.string().min(2, 'A raça deve ter pelo menos 2 caracteres.'),
  idade: z.coerce.number().int().positive().optional(),
  tutor_id: z.coerce.number().int().positive('O ID do tutor é obrigatório.')
});