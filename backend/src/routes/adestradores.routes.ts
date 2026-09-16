import { Router, Request, Response } from 'express';
import db from '../database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adestradorSchema, loginSchema } from '../schemas/adestrador.schema';
import { AppError } from '../errors/AppError';

const router = Router();

// ============================================================================
// SETUP DA TABELA DE ADESTRADORES (POST /adestradores/setup-tabela)
// ============================================================================
router.post('/setup-tabela', async (req: Request, res: Response) => {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS adestradores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        senha_hash VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `;
    await db.query(sql);
    
    return res.status(201).json({ mensagem: 'Tabela adestradores criada com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
    return res.status(500).json({ mensagem: 'Erro ao criar tabela de adestradores.' });
  }
});

// ============================================================================
// CADASTRAR ADESTRADOR (POST /adestradores)
// ============================================================================
router.post('/', async (req: Request, res: Response) => {
    //1. Validação de dados com Zod
    const validacao = adestradorSchema.safeParse(req.body);

    if (!validacao.success) {
        return res.status(400).json({
            mensagem: 'Erro de validação',
            erros: validacao.error.flatten().fieldErrors
        });
    }

    const { nome, email, senha } = validacao.data;
    // 2. Transformando a senha em Hash
    //O número 8 é o "salt round" (custo computacional). Qautno maior, mais lento e seguro. 8 é um equilíbrio para APIs padrão.
    const senhaHash = await bcrypt.hash(senha, 8);

    try{
        //3. Inserindo no banco de dados com a senha já protegida
        const sql = 'INSERT INTO adestradores (nome, email, senha_hash) VALUES (?, ?, ?)';
        const [resultado]:any = await db.query(sql, [nome, email, senhaHash]);

        //4. Retornando os dados do usuário recém-criado(NUNCA retorne a senha, nem mesmo o hash)
        return res.status(201).json({
            mensagem: 'Adestrador cadastrado com sucesso!',
            id: resultado.insertId,
            nome,
            email
        });
    } catch (error: any) {
        //Tratamento específico: o campo 'email' é UNIQUE na tabela. Se o erro for de duplicação, barramos aqui
        if (error.code === 'ER_DUP_ENTRY') {
            throw new AppError('Este e-mail já está em uso por outro adestrador', 409)
        }

        //Se for outro erro, lançamos um erro genérico para o middleware global capturar
        throw new AppError('Erro interno ao cadastrar adestrador', 500);
    }
});

// ============================================================================
// FAZER LOGIN (POST /adestradores/login)
// ============================================================================
router.post('/login', async (req: Request, res: Response) => {
  // 1. Valida o formato dos dados recebidos
  const validacao = loginSchema.safeParse(req.body);
  if (!validacao.success) {
    return res.status(400).json({ erros: validacao.error.flatten().fieldErrors });
  }

  const { email, senha } = validacao.data;

  // 2. Busca o adestrador no MySQL
  const sql = 'SELECT * FROM adestradores WHERE email = ?';
  const [rows]: any = await db.query(sql, [email]);
  const adestrador = rows[0];

  // Regra de Ouro de Segurança: Se não encontrar o e-mail ou a senha errar, 
  // retorne o MESMO erro genérico (401 Unauthorized) para não dar dicas a hackers.
  if (!adestrador) {
    throw new AppError('E-mail ou senha incorretos.', 401);
  }

  // 3. Compara a senha em texto limpo com o hash salvo no banco
  const senhaValida = await bcrypt.compare(senha, adestrador.senha_hash);
  if (!senhaValida) {
    throw new AppError('E-mail ou senha incorretos.', 401);
  }

  // 4. Gera o Crachá Digital (JWT)
  // Assinamos o token contendo apenas o ID do usuário. O token expirará em 1 dia.
  const token = jwt.sign(
    { id: adestrador.id },
    process.env.JWT_SECRET || 'chave_fallback_insegura', 
    { expiresIn: '1d' }
  );

  // 5. Retorna o token para o cliente salvar (ex: no LocalStorage do navegador)
  return res.status(200).json({
    mensagem: 'Login realizado com sucesso!',
    token, // Este é o JWT gigante
    adestrador: {
      id: adestrador.id,
      nome: adestrador.nome,
      email: adestrador.email
    }
  });
});

export default router;