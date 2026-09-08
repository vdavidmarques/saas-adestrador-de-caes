import { z } from 'zod';

//Definimos o formato rigoroso que esperamos receber no POST /tutores
export const tutorSchema = z.object({
    nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('O email não é válido'),
    telefone: z.string().min(10, 'O telefone deve ter pelo menos 10 digitos'),
});