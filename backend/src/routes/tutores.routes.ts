import { Router, Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import db from '../database'; // ✅ Estilo Módulo TypeScript
import { tutorSchema } from '../schemas/tutor.schema';
import { AppError } from '../errors/AppError';

const router = Router();

// Interface para definir a estrutura de um Tutor
export interface Tutor {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  criado_em?: Date;
}

// Rota de setup da tabela
router.post('/setup-tabela', async (req: Request, res: Response) => {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS tutores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        telefone VARCHAR(50) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.query(sql);
    return res.status(201).json({ mensagem: 'Tabela tutores criada com sucesso!' });
  } catch (erro) {
    console.error('Erro ao criar tabela:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao criar tabela no banco de dados.' });
  }
});

// GET /tutores - Busca todos os tutores
router.get('/', async (req: Request, res: Response) => {
  const { id } = req.params;
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM tutores WHERE id = ?', [id]);
  
  if(rows.length === 0) {
    // Basta "lançar" o erro. O errorHandles vai capturar e formatar como JSON 404.
    throw new AppError('Nenhum tutor encontrado.', 404);
  }

  return res.status(200).json(rows[0]);
});

// GET /tutores/:id - Busca tutor por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sql = 'SELECT id, nome, email, telefone, criado_em FROM tutores WHERE id = ?';
    const [rows]: any = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Tutor não encontrado.' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar tutor:', error);
    return res.status(500).json({ mensagem: 'Erro interno no servidor ao buscar tutor.' });
  }
});

// POST /tutores - Cadastra novo tutor
router.post('/', async (req: Request, res: Response) => {
  try {
     //1. O safeParse valida o req.body contra o schema sem quebrar a aplicação(não lança exceção)
    const validacao = tutorSchema.safeParse(req.body);

    //2. Se a validação falhar, retornamos um erro 400 com a lista de erros do Zod
    if (!validacao.success) {
        return res.status(400).json({ 
            mensagem: 'Erro de validação nos dados enviados.',
            erros: validacao.error.issues
        });
    }
    
    // 3. Se passou na validação, extraímos os dados tipados e seguros
    const { nome, email, telefone } = validacao.data;

    const querySQL = 'INSERT INTO tutores (nome, email, telefone) VALUES (?, ?, ?)';
    const [resultado]: any = await db.query(querySQL, [nome, email, telefone || null]);

    return res.status(201).json({
      mensagem: 'Tutor cadastrado com sucesso!',
      id: resultado.insertId,
      nome,
      email,
      telefone
    });
  } catch (error) {
    console.error('Erro ao cadastrar tutor:', error);
    return res.status(500).json({ mensagem: 'Erro ao salvar tutor no banco de dados.' });
  }
});

export default router;