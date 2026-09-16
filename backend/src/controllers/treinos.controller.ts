import { Request, Response } from 'express';
import { TreinosService } from '../services/treinos.service';

export class TreinosController {
    private service = new TreinosService();

    //Usamos arrow function (=>) para evitar problemas com o contexto do "this" no Express
    buscarPorId = async (req: Request, res: Response) => {
        const { id } = req.params;

        //Chama o serviço passando os dados limpos
        const treino = await this.service.buscarPorId(Number(id));

        //Retorna o status de sucesso
        return res.status(200).json(treino);
    }
}