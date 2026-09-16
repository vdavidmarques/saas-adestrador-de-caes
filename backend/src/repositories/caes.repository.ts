import db from '../database';

export class CaoRepository {
    // Retorna os dados do banco ou null se não encontrar
    async findById(id: number) {
        const [rows]: any = await db.query('SELECT caes.id, caes.nome, caes.idade, caes.raca, caes.tutor_id, tutores.nome AS tutor_nome FROM caes LEFT JOIN tutores ON caes.tutor_id = tutores.id WHERE caes.id = ?', [id]);
        return rows[0] || null;
    }
}