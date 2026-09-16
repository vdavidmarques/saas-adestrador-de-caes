import { CaoRepository } from "../repositories/caes.repository";    
import { AppError } from "../errors/AppError";

export class CaoService {
    private repository = new CaoRepository();

    async buscarPorId(id: number) {
        // 1. Pede os dados ao repositório
        const cao = await this.repository.findById(id);

        //2. Aplica a regra de negócio: se não existir, interrompe tudo com erro
        if (!cao) {
            throw new AppError('Cão não encontrado.', 404);
        }
    }
}