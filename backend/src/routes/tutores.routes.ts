import { Router, Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import db from '../database'; // ✅ Estilo Módulo TypeScript
import { tutorSchema } from '../schemas/tutor.schema';
import { AppError } from '../errors/AppError';
import { TutorController } from '../controllers/tutor.controller';

const router = Router();
const tutorController = new TutorController();

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
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(50) NOT NULL,
        adestrador_id INT NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (adestrador_id) REFERENCES adestradores(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;
    await db.query(sql);
    return res.status(201).json({ mensagem: 'Tabela tutores criada com sucesso com vínculo de adestrador!' });
  } catch (error) {
    console.error('Erro ao criar tabela tutores:', error);
    return res.status(500).json({ mensagem: 'Erro interno ao criar tabela.' });
  }
});

// GET /tutores - Busca todos os tutores do adestrador logado com Paginação
router.get('/', async (req: Request, res: Response) => {
  const adestradorId = (req as any).adestradorId;
  
  //1. Capturamos os alores da URL (query strings) ou definimos valores padrão. Ex: ?pagina=1&limite=10
  const pagina = parseInt(req.query.pagina as string) || 1;
  const limite = parseInt(req.query.limite as string) || 10;

  //2. Calculamos quantos registros o banco deve "pular" (Offset)
  const offset = (pagina -1) * limite;


  //3. Buscamos o total de tutores que esse adestrador possui para o Front-end saber quantas páginas existem
  const sqlTotal = 'SELECT COUNT(*) as total FROM tutores WHERE adestrador_id = ?';
  const [linhasTotal]: any = await db.query(sqlTotal, [adestradorId]);
  const totalRegistros = linhasTotal[0].total;
  const totalPaginas = Math.ceil(totalRegistros / limite);

  //4. Buscamos os dados reais com LIMIT e OFFSET
  //Dica de segurança: LIMIT e OFFSET no mysql2 precisam de tratamento numérico explícito, então usamos a conversão direta na string ou passamos os números puros.
  const sqlDados = `
    SELECT * FROM tutores 
    WHERE adestrador_id = ? 
    ORDER BY criado_em DESC 
    LIMIT ? OFFSET ?
  `;

  const [tutores]:any = await db.query(sqlDados, [adestradorId, limite, offset]);

  //5. Retornamos um objeto estruturado (Padrão profissional de paginação)
  return res.status(200).json({
    dados: tutores,
    metadados: {
      total_registros: totalRegistros,
      total_paginas: totalPaginas,
      pagina_atual: pagina,
      limite_por_pagina: limite
    }
  })
});

// GET /tutores/:id - Busca tutor por ID
router.get('/:id', tutorController.buscarPorId);

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
    const adestradorId = (req as any).adestradorId; // Capturado do JWT pelo middleware!

    const querySQL = 'INSERT INTO tutores (nome, email, telefone, adestrador_id) VALUES (?, ?, ?, ?)';
    const [resultado]: any = await db.query(querySQL, [nome, email, telefone || null, adestradorId]);

    return res.status(201).json({
      mensagem: 'Tutor cadastrado com sucesso!',
      id: resultado.insertId,
      nome,
      email,
      telefone,
      adestrador_id: adestradorId
    });
  } catch (error) {
    console.error('Erro ao cadastrar tutor:', error);
    return res.status(500).json({ mensagem: 'Erro ao salvar tutor no banco de dados.' });
  }
});

export default router;