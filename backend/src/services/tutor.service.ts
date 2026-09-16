import { TutorRepository } from '../repositories/tutor.repository';
import { AppError } from '../errors/AppError';

export class TutorService {
  private repository = new TutorRepository();

  async buscarPorId(id: number) {
    // 1. Pede os dados ao repositório
    const tutor = await this.repository.findById(id);

    // 2. Aplica a regra de negócio: se não existir, interrompe tudo com erro
    if (!tutor) {
      throw new AppError('Tutor não encontrado.', 404);
    }

    return tutor;
  }
}