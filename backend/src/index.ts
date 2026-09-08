// 1. Importa o Express e o CORS com a sintaxe de módulos do TypeScript
import { errorHandler } from './middlewares/errorHandler'; // Importa o middleware
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Importa as rotas (que também renomearemos para .ts)
import tutoresRoutes from './routes/tutores.routes';
import caesRoutes from './routes/caes.routes';
import treinosRoutes from './routes/treinos.routes';

// 2. Criando a aplicação Express
const app = express();

// 3. Configurando o Express para entender dados no formato JSON
app.use(express.json());
app.use(cors());

app.use('/tutores', tutoresRoutes);
app.use('/caes', caesRoutes);

//Registra a rota de treinos
app.use('/treinos', treinosRoutes);

// O middleware de erro DEVE vir depois de todas as rotas, para capturar erros que possam ocorrer nelas
app.use(errorHandler);

// 6. Iniciando o servidor na porta 3000
app.listen(3000, () => {
  console.log('🐾 Servidor de Adestramento rodando na porta 3000!');
});