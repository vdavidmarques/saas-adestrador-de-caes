import { TreinosRepository } from '../repositories/treinos.repository';
import { AppError } from '../errors/AppError';

export class TreinosService {
    private repository = new TreinosRepository();

    async buscarPorId(id: number) {
        const treino = await this.repository.findById(id);

        //2. Aplica a regra de negócio: se não existir, interrompe tudo com erro
        if (!treino) {
            throw new AppError('Treino não encontrado.', 404);
        }
    }
}