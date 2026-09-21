import app from './app';

const PORT = process.env.PORT || 3000;

// Apenas sobe o servidor físico
app.listen(PORT, () => {
  console.log(`🐾 Servidor de Adestramento rodando na porta ${PORT}!`);
});