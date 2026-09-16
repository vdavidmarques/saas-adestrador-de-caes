import db from '../database';

export class TreinosRepository {
    //Retorna os dados do banco ou null se não acontecer
    async findById(id:number){
        const [rows]:any = await db.query('SELECT treinos.id, treinos.titulo, treinos.status, treinos.criado_em, cases.nome AS cao_nome, caes.raca AS cao_raca FROM treinos INNER JOIN caes ON treinos.caes_id = caes.id WHERE 1=1', [id]);
        return rows[0] || null;
    }
}