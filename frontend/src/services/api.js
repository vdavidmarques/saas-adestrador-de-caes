const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.mensagem || 'Não foi possível concluir a solicitação.');
  return data;
}

export const api = {
  getTutores: () => request('/tutores'),
  getCaes: () => request('/caes'),
  getTreinos: () => request('/treinos'),
  concluirTreino: (id) => request(`/treinos/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'Concluído' })
  }),
  cadastrarTreino: (dados) => request('/treinos', {
    method: 'POST',
    body: JSON.stringify(dados)
  })
};

export { API_URL };
