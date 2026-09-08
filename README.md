# 🐾 AdestraSaaS API - Node.js & TypeScript Study Hub
Um projeto prático construído com o objetivo principal de estudar e aplicar desenvolvimento Back-end moderno utilizando Node.js e TypeScript. Todo o domínio da aplicação é baseado em um cenário real: uma plataforma de gestão para adestradores profissionais de cães (gerenciando tutores, cães e treinos).

Para recrutadores e engenheiros de software: este repositório serve como um portfólio prático de arquitetura limpa, conteinerização e boas práticas na construção de APIs RESTful.

## 🚀 Tecnologias e Habilidades Demonstradas
Este projeto foi construído sem o uso de ORMs complexos na camada de dados inicial para demonstrar o domínio sobre SQL puro e arquitetura de software.

Node.js & Express: Construção da API RESTful com roteamento e middlewares.

TypeScript: Tipagem estática rigorosa para maior segurança e escalabilidade.

Arquitetura Limpa (Clean Architecture): Separação clara de responsabilidades em Routes, Controllers, Services e Repositories.

MySQL: Banco de dados relacional utilizando mysql2/promise para queries assíncronas, modelagem de tabelas com FOREIGN KEY, JOINs e agregação de dados.

Zod: Validação rigorosa de esquemas de dados (Data Validation) nas entradas da API.

Tratamento Global de Erros: Middleware centralizado para captura e formatação de erros de negócio e de sistema (evitando vazamento de stack traces).

Docker & Docker Compose: Ambiente de desenvolvimento 100% conteinerizado (API e Banco de Dados) utilizando volumes para Hot-Reload com tsx.

## 🛠️ Requisitos
A principal vantagem desta arquitetura é que você não precisa ter o Node.js ou o MySQL instalados na sua máquina local para testar o projeto. Você precisará apenas de:

Docker (versão 20+ recomendada)

Docker Compose

Git

## 📦 Como rodar o projeto localmente
Siga os passos abaixo para replicar e testar o sistema na sua máquina:

0. Clone o repositório

git clone https://github.com/vdavidmarques/saas-adestrador-de-caes
cd adestra-saas-api/backend

1. Configure as variáveis de ambiente
Crie um arquivo .env na raiz da pasta backend (você pode basear-se no .env.example se houver) com as credenciais do banco:

```js
DB_HOST=db
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=adestramento_db
```

2. Suba a infraestrutura com Docker
Execute o comando abaixo para construir as imagens e subir os containers da API e do MySQL simultaneamente:

```js
docker compose up --build`
```
Aguarde até visualizar a mensagem no terminal: 🐾 Servidor de Adestramento rodando na porta 3000!

3. Inicialize as Tabelas (Migrations Manuais)
Como o banco de dados sobe limpo, utilize um cliente HTTP (Postman, Insomnia ou cURL) para disparar as requisições de criação das tabelas na seguinte ordem:

Criar Tutores: POST http://localhost:3000/tutores/setup-tabela

Criar Cães: POST http://localhost:3000/caes/setup-tabela

Criar Treinos: POST http://localhost:3000/treinos/setup-tabela

4. Teste a API
Agora você pode realizar requisições para a API. Exemplo para cadastrar um novo tutor:

```js
curl -X POST http://localhost:3000/tutores \
-H "Content-Type: application/json" \
-d '{"nome": "João Silva", "email": "joao@email.com", "telefone": "11999999999"}'
```