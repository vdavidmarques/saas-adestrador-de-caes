import { useEffect, useMemo, useState } from 'react';
import { Activity, Check, Clock3, Dog, Plus, Users } from 'lucide-react';
import { api } from '../services/api';

const isDone = (status) => String(status).toLowerCase() === 'concluído' || String(status).toLowerCase() === 'concluido';

export default function Dashboard() {
  const [tutores, setTutores] = useState([]);
  const [caes, setCaes] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ titulo: '', cao_id: '' });

  const pending = useMemo(() => treinos.filter((training) => !isDone(training.status)).length, [treinos]);
  const completed = treinos.length - pending;

  useEffect(() => {
    Promise.all([api.getTutores(), api.getCaes(), api.getTreinos()])
      .then(([tutorData, dogData, trainingData]) => { setTutores(Array.isArray(tutorData) ? tutorData : []); setCaes(Array.isArray(dogData) ? dogData : []); setTreinos(Array.isArray(trainingData) ? trainingData : []); })
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleComplete(training) {
    try { await api.concluirTreino(training.id); setTreinos((current) => current.map((item) => item.id === training.id ? { ...item, status: 'Concluído' } : item)); }
    catch (reason) { setError(reason.message); }
  }

  async function handleSubmit(event) {
    event.preventDefault(); setFormMessage(''); setFormError('');
    if (!form.titulo.trim() || !form.cao_id) { setFormError('Informe o título e escolha um cão.'); return; }
    setSubmitting(true);
    try {
      const created = await api.cadastrarTreino({ titulo: form.titulo.trim(), cao_id: Number(form.cao_id) });
      const dog = caes.find((item) => item.id === Number(form.cao_id));
      setTreinos((current) => [{ ...created, cao_nome: dog?.nome || 'Novo cão', cao_raca: dog?.raca || '' }, ...current]);
      setForm({ titulo: '', cao_id: '' }); setFormMessage('Treino adicionado à agenda.');
    } catch (reason) { setFormError(reason.message); } finally { setSubmitting(false); }
  }

  return <>
    <div className="welcome"><div><h2>Bom dia, Marina.</h2><p>Acompanhe a evolução dos seus alunos hoje.</p></div><button className="primary-button" onClick={() => document.getElementById('training-title')?.focus()}><Plus size={16} /> Novo treino</button></div>
    {error && <div className="error-banner" role="alert">{error}</div>}
    <div className="metrics-grid">
      <Metric icon={Users} color="blue" label="Total de tutores" value={loading ? '...' : tutores.length} detail="cadastros ativos" />
      <Metric icon={Dog} color="amber" label="Cães acompanhados" value={loading ? '...' : caes.length} detail="alunos no programa" />
      <Metric icon={Activity} color="green" label="Treinos concluídos" value={loading ? '...' : completed} detail={`${pending} pendente${pending === 1 ? '' : 's'} hoje`} />
    </div>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-header"><div><h3>Treinos de hoje</h3><p>{treinos.length} sessões na agenda</p></div><a href="#treinos" className="view-all">Ver todos</a></div>{loading ? <div className="loading-state">Carregando agenda...</div> : treinos.length === 0 ? <div className="empty-state">Nenhum treino cadastrado ainda.</div> : <div className="table-wrap"><table className="training-table"><thead><tr><th>Treino</th><th>Cão</th><th>Horário</th><th>Status</th><th></th></tr></thead><tbody>{treinos.map((training) => <tr key={training.id}><td className="training-title">{training.titulo}</td><td><span className="training-dog">{training.cao_nome}</span><span className="training-breed">{training.cao_raca}</span></td><td><span className="training-breed"><Clock3 size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Hoje</span></td><td><span className={`badge ${isDone(training.status) ? 'done' : 'pending'}`}>{training.status}</span></td><td>{!isDone(training.status) && <button className="action-button" onClick={() => handleComplete(training)}><Check size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />Concluir</button>}</td></tr>)}</tbody></table></div>}</section>
      <section className="panel" id="quick-training"><div className="panel-header"><div><h3>Novo treino</h3><p>Adicione uma sessão à agenda</p></div><div className="metric-icon blue"><Plus size={18} /></div></div><form className="quick-form" onSubmit={handleSubmit}><div className="form-group"><label htmlFor="training-title">Título do treino</label><input id="training-title" value={form.titulo} onChange={(event) => setForm({ ...form, titulo: event.target.value })} placeholder="Ex.: Passeio sem puxar" /></div><div className="form-group"><label htmlFor="dog-select">Cão</label><select id="dog-select" value={form.cao_id} onChange={(event) => setForm({ ...form, cao_id: event.target.value })}><option value="">Selecione um cão</option>{caes.map((dog) => <option key={dog.id} value={dog.id}>{dog.nome} · {dog.raca}</option>)}</select></div>{formMessage && <p className="form-success" role="status">{formMessage}</p>}{formError && <p className="form-error" role="alert">{formError}</p>}<button className="primary-button form-submit" disabled={submitting}>{submitting ? 'Salvando...' : 'Adicionar treino'}</button></form></section>
    </div>
  </>;
}

function Metric({ icon: Icon, color, label, value, detail }) { return <article className="metric-card"><div><p>{label}</p><h3>{value}<small>{detail}</small></h3></div><div className={`metric-icon ${color}`}><Icon size={19} /></div></article>; }
