import { z } from 'zod';

export const treinoSchema = z.object({
  titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.'),
  status: z.string().optional(),
  cao_id: z.coerce.number().int().positive('O ID do cão é obrigatório.')
});