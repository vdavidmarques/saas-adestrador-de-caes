// Importa a conexão com o banco de dados (ajuste o caminho conforme o seu projeto)
//Aqui é onde a consulta ao banco de dados (o nosso JOIN) vai acontecer.
import db from '../database';

export class CaoService {
    
    //Função assíncrona que recebe o ID do cão e o ID do adestrador logado
    async buscarPorId(caoId: number, adestradorId: number) {

        //1. Declaramos a nossa instrução SQÇ com o LEFT JOIN para buscar o dossiê completo
        const sqlJoin = `
            SELECT
                c.id AS cao_id, c.nome AS cao_nome, c.raca AS cao_raca,
                t.id AS tutor_id, t.nome AS tutor_nome, t.telefone AS tutor_telefone,
                tr.id AS treino_id, tr.descricao AS treino_descricao, tr.data AS treino_data
            FROM caes c
            -- Junta com a tabela tutores comparando as chaves estrangeiras
            LEFT JOIN tutores t ON c.tutor_id = t.id 
            -- Junta com a tabela treinos comparando o ID do cão
            LEFT JOIN treinos tr ON c.id = tr.cao_id
            -- Filtra pelo cão específico e garante que o tutor pertence ao adestrador logado
            WHERE c.id = ? AND t.adestrador_id = ?
        `;

        //2. Executamos a query no banco de dados passando os valores para os placeholders (?)
        const [linhas]:any = await db.query(sqlJoin, [caoId, adestradorId]);

        //3. Verificamos se o banco não retornou nenhuma linha (cão não existe ou não pertence a este adestrador)
        if (linhas.length === 0) {
            //Se não encontrou, retornamos null (vazio) para o Controller ludar com isso
            return null;
        }

        //4. Montamos a estrutura principal do objeto "dossiê" pegando os dados da primeira linha retornada (índice 0)
        const dossie = {
            id: linhas[0].cao_id,
            nome: linhas[0].cao_nome,
            raca: linhas[0].cao_raca,
            tutor: {//Cria um sub-objeto para os dados do tutor
                id: linhas[0].tutor_id,
                nome: linhas[0].tutor_nome,
                telefone: linhas[0].tutor_telefone
            },
            treinos: [] as any[] //Inicia um array vazio que vai guardar a lista de treinos
        };

        //5. Varremos (loop) todas as linhas retornadas pelo banco de dados
        linhas.forEach((linha:any) => {
            //Se a linha atual possuir um ID de treino válido (não for nulo)
            if(linha.treino_id) {
                //Adicionamos os dados deste treino no array de treinos do nosso dossiê
                if(linha.treino_id) {
                    //Adicionamos os dados deste treino no array de treinos do nosso dossiê
                    dossie.treinos.push({
                        id: linha.treino_id,
                        descricao: linha.treino_descricao,
                        data: linha.treino_data
                    });
                }
            }
        });

        //6. Retornamos o objeto completo (dossiÊ) montado de volta para quem chamou (o Controller)
        return dossie;
    }
}