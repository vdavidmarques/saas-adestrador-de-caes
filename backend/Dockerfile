# 1. Imagem base: Um Linux leve já contendo o Node.js instalado
FROM node:20-alpine

# 2. Define a pasta de trabalho dentro do container
WORKDIR /usr/src/app

# 3. Copia os arquivos de dependência primeiro (para aproveitar o cache)
COPY package*.json ./

# 4. Instala as dependências dentro do container
RUN npm install --include=dev

# 5. Copia o restante do código da nossa aplicação para o container
COPY . .

# 6. Expõe a porta que o Express está escutando
EXPOSE 3000

# 7. Comando padrão para iniciar a aplicação em modo desenvolvimento
CMD ["npm", "run", "dev"]