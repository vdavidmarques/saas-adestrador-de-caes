import db from '../database';

export class TutorRepository {
  // Retorna os dados do banco ou null se não encontrar
  async findById(id: number) {
    const [rows]: any = await db.query('SELECT * FROM tutores WHERE id = ?', [id]);
    return rows[0] || null;
  }
}