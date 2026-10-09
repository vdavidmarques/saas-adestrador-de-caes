import { Request, Response } from 'express';
import { CaoService } from '../services/caes.service';

export class CaoController {
    //Instancia o serviço para podermos utiizar suas funções (como a de buscarPorId)
    private service = new CaoService();

    // Usamos arrow function (=>) para evitar problemas com o contexto do "this" no Express
    buscarPorId = async (req: Request, res: Response) => {
       //1. Iniciamos o bloco try/catch para capturar qualquer erro fatal(ex. banco de dados fora do ar)
       try{
        //2. Extraímos o ID do cão que vem na URL (ex: /caes/:id)
        const { id } = req.params;

        //3. Extraímos o ID do adestrador logado que o middleware de autenticação (JWT) colocou na requisição
        const adestradorId = (req as any).adestradorId; 

        //4. Chamamos o nosso "Chef de Cozinha" (Service) passando o ID do cão convetido para número e o ID do adestrador
        const cao = await this.service.buscarPorId(Number(id), adestradorId);

        //5 Se o Service retornou null, (ou seja, não achou o cão no banco)
        if(!cao) {
            //Retornamos um status 404 (Not Found) com uma mensagem amigável
            return res.status(404).json({ mensagem: 'Cão não encontrado ou não pertence a este adestrador.' });
        }
        
        //6. Se tudo deu certo, retornamos status 200 (ok) enviando o obejeto 'cão' (o nosso dossiÊ) em  formato JSON
        return res.status(200).json(cao);
       } catch (error) {
        //7. Se qualquer linha dentro do 'try' falhar ou ser erro no SQL, o código cai aqui (catch)
        // Imprimimos o erro no console do servidor para o desenvolvedor investigar
            console.error('Erro na busca de cão por ID:', error);
            // 8. Retornamos status 500 (Internal Server Error) para o cliente com uma mensagem genérica de falha
            return res.status(500).json({ mensagem: 'Ocorreu um erro interno ao buscar as informações do cão.' });
        }
    };
}