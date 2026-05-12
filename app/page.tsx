import { testarBanco } from './actions';
export default async function Home() {
  const dados = await testarBanco();

  return (
    <main style={{ padding: '20px' }}>
      <h1>Resultado do Banco de Dados:</h1>
      <pre>{JSON.stringify(dados, null, 2)}</pre>
    </main>
  );
}