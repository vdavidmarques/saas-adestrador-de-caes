import { Request, Response } from 'express';
import { TutorService } from '../services/tutor.service';
import { AppError } from '../errors/AppError';
import db from '../database';

export class TutorController {
  private service = new TutorService();

  // Usamos arrow function (=>) para evitar problemas com o contexto do "this" no Express
  buscarPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    
  // Chama o serviço passando os dados limpos
  const tutor = await this.service.buscarPorId(Number(id));
  const adestradorId = (req as any).adestradorId;

  const [rows]: any = await db.query(
    'SELECT * FROM tutores WHERE id = ? AND adestrador_id = ?', 
    [id, adestradorId]
  );
  
  if (rows.length === 0) {
    throw new AppError('Tutor não encontrado.', 404);
  }

    // Retorna o status de sucesso
    return res.status(200).json(tutor);
  };
}