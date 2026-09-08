import { Router, Request, Response } from 'express';
import db from '../database';
import { treinoSchema } from '../schemas/treino.schema';

const router = Router();

export interface Treino {
  id?: number;
  titulo: string;
  status?: string;
  cao_id: number;
  criado_em?: Date;
}

// Setup Tabela Treinos
router.post('/setup-tabela', async (req: Request, res: Response) => {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS treinos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pendente',
        cao_id INT NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cao_id) REFERENCES caes(id) ON DELETE CASCADE
      )
    `;
    await db.query(sql);
    return res.status(201).json({ mensagem: 'Tabela treinos criada com sucesso!' });
  } catch (erro) {
    console.error('Erro ao criar tabela treinos:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao criar tabela de treinos.' });
  }
});

// GET /treinos - Lista treinos com JOIN e suporte a filtros
router.get('/', async (req: Request, res: Response) => {
  try {
    const { cao_id, status } = req.query;

    let sql = `
      SELECT 
        treinos.id, 
        treinos.titulo, 
        treinos.status, 
        treinos.criado_em,
        caes.nome AS cao_nome,
        caes.raca AS cao_raca
      FROM treinos
      INNER JOIN caes ON treinos.cao_id = caes.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (cao_id) {
      sql += ' AND treinos.cao_id = ?';
      params.push(cao_id);
    }

    if (status) {
      sql += ' AND treinos.status = ?';
      params.push(status);
    }

    const [rows] = await db.query(sql, params);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    return res.status(500).json({ mensagem: 'Erro ao consultar treinos no banco.' });
  }
});

// POST /treinos - Cadastra treino
router.post('/', async (req: Request, res: Response) => {
  try {
    const validacao = treinoSchema.safeParse(req.body);
    if (!validacao.success) {
      return res.status(400).json({
        mensagem: 'Erro de validação',
        erros: validacao.error.flatten().fieldErrors
      });
    }
    
    const { titulo, status, cao_id }: Treino = validacao.data;

    const sql = 'INSERT INTO treinos (titulo, status, cao_id) VALUES (?, ?, ?)';
    const [resultado]: any = await db.query(sql, [titulo, status || 'Pendente', cao_id]);

    return res.status(201).json({
      mensagem: 'Treino cadastrado com sucesso!',
      id: resultado.insertId,
      titulo,
      status: status || 'Pendente',
      cao_id
    });
  } catch (error) {
    console.error('Erro ao cadastrar treino:', error);
    return res.status(500).json({ mensagem: 'Erro ao salvar treino no banco de dados.' });
  }
});

// PATCH /treinos/:id/status - Atualiza status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ mensagem: 'O campo status é obrigatório.' });
    }

    const querySQL = 'UPDATE treinos SET status = ? WHERE id = ?';
    const [resultado]: any = await db.query(querySQL, [status, id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Treino não encontrado.' });
    }

    return res.status(200).json({
      mensagem: 'Status do treino atualizado com sucesso!',
      id: Number(id),
      novoStatus: status
    });
  } catch (error) {
    console.error('Erro ao atualizar status do treino:', error);
    return res.status(500).json({ mensagem: 'Erro interno ao atualizar status do treino.' });
  }
});

export default router;