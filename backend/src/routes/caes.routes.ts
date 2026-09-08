import { Router, Request, Response } from 'express';
import db from '../database'; // ✅ Estilo Módulo TypeScript
import { caoSchema } from '../schemas/cao.schema';

const router = Router();

export interface Cao {
  id?: number;
  nome: string;
  raca: string;
  idade?: number;
  tutor_id: number;
  criado_em?: Date;
}

// Setup da Tabela Cães
router.post('/setup-tabela', async (req: Request, res: Response) => {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS caes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        raca VARCHAR(100) NOT NULL,
        idade INT,
        tutor_id INT NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tutor_id) REFERENCES tutores(id) ON DELETE CASCADE
      )
    `;
    await db.query(sql);
    return res.status(201).json({ mensagem: 'Tabela caes criada com sucesso!' });
  } catch (erro) {
    console.error('Erro ao criar tabela caes:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao criar tabela de cães.' });
  }
});

// GET /caes - Lista cães com dados do tutor via JOIN
router.get('/', async (req: Request, res: Response) => {
  try {
    const sql = `
      SELECT 
        caes.id, 
        caes.nome, 
        caes.raca, 
        caes.idade, 
        caes.criado_em,
        tutores.id AS tutor_id,
        tutores.nome AS tutor_nome,
        tutores.email AS tutor_email
      FROM caes
      INNER JOIN tutores ON caes.tutor_id = tutores.id
    `;
    const [rows] = await db.query(sql);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar cães:', error);
    return res.status(500).json({ mensagem: 'Erro ao consultar cães no banco.' });
  }
});

// GET /caes/:id - Busca um cão específico pelo ID com dados do seu tutor
router.get('/:id', async (req: Request, res: Response) => {
  try {
    // 1. Capturamos o parâmetro 'id' passado na URL
    const { id } = req.params;

    // 2. Executamos a consulta com INNER JOIN para trazer tanto as informações do cão quanto do tutor
    const sql = `
      SELECT 
        caes.id, 
        caes.nome, 
        caes.raca, 
        caes.idade, 
        caes.criado_em,
        tutores.id AS tutor_id,
        tutores.nome AS tutor_nome,
        tutores.email AS tutor_email
      FROM caes
      INNER JOIN tutores ON caes.tutor_id = tutores.id
      WHERE caes.id = ?
    `;

    // 3. Executamos a query usando placeholder (?) contra SQL Injection
    const [rows]: any = await db.query(sql, [id]);

    // 4. Se não encontrar nenhum registro (array vazio), retornamos HTTP 404
    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Cão não encontrado.' });
    }

    // 5. Retornamos o cão localizado
    return res.status(200).json(rows[0]);

  } catch (error) {
    console.error('Erro ao buscar cão por ID:', error);
    return res.status(500).json({ mensagem: 'Erro interno ao consultar o cão no banco.' });
  }
});

// POST /caes - Cadastra um novo cão
router.post('/', async (req: Request, res: Response) => {
  try {
    const validacao = caoSchema.safeParse(req.body);

    if (!validacao.success) {
      return res.status(400).json({
        mensagem: 'Erro de validação',
        erros: validacao.error.flatten().fieldErrors
      });
    }
    const { nome, raca, idade, tutor_id } = validacao.data;
    
    const querySQL = 'INSERT INTO caes (nome, raca, idade, tutor_id) VALUES (?, ?, ?, ?)';
    const [resultado]: any = await db.query(querySQL, [nome, raca, idade || null, tutor_id]);

    return res.status(201).json({
      mensagem: 'Cão cadastrado com sucesso!',
      id: resultado.insertId,
      nome,
      raca,
      idade,
      tutor_id
    });
  } catch (error) {
    console.error('Erro ao cadastrar cão:', error);
    return res.status(500).json({ mensagem: 'Erro ao salvar cão no banco de dados.' });
  }
});

export default router;