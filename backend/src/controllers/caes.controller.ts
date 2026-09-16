import { Request, Response } from 'express';
import { CaoService } from '../services/caes.service';

export class CaoController {
    private service = new CaoService();

    // Usamos arrow function (=>) para evitar problemas com o contexto do "this" no Express
    buscarPorId = async (req: Request, res: Response) => {
        const { id } = req.params;

        // Chama o serviço passando os dados limpos
        const cao = await this.service.buscarPorId(Number(id));

        //Retonar o status de sucesso
        return res.status(200).json(cao);
    };
}