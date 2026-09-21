import express from 'express';
import cors from 'cors';
import tutoresRoutes from './routes/tutores.routes';
import caesRoutes from './routes/caes.routes';
import treinosRoutes from './routes/treinos.routes';
import adestradoresRoutes from './routes/adestradores.routes';
import { errorHandler } from './middlewares/errorHandler';

// Inicializa a aplicação Express
const app = express();

// Middlewares globais de aplicação
app.use(express.json());
app.use(cors());

// Registro de Rotas Públicas
app.use('/adestradores', adestradoresRoutes);

// Registro de Rotas do Domínio (Protegidas ou abertas conforme configurado)
app.use('/tutores', tutoresRoutes);
app.use('/caes', caesRoutes);
app.use('/treinos', treinosRoutes);

// Middleware Global de Tratamento de Erros (Deve ser sempre o último)
app.use(errorHandler);

// Exportamos o app isolado para uso nos testes automatizados
export default app;