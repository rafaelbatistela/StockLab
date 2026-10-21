
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

async function requisicao(
  url: string,
  opcoes?: RequestInit
): Promise<any> {
  const resposta = await fetch(url, opcoes);

  if (!resposta.ok) {
    const detalhe = await resposta.text();

    throw new Error(
      `Erro na API (${resposta.status}): ${detalhe}`
    );
  }

  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

export async function buscarProdutos() {
  const resultado = await requisicao(`${API_URL}/produtos`);

  if (!Array.isArray(resultado?.dados)) {
    throw new Error(
      "A API não retornou uma lista válida de produtos."
    );
  }

  return resultado.dados;
}

export type DadosProduto = {
  nome: string;
  descricao: string | null;
  codigo: string;
  quantidade: number;
  preco: number;
  validade: string | null;
};

export async function criarProduto(produto: DadosProduto) {
  return requisicao(`${API_URL}/produtos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(produto),
  });
}

export async function editarProduto(
  id: number,
  produto: DadosProduto
) {
  return requisicao(`${API_URL}/produtos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(produto),
  });
}

export async function excluirProduto(id: number) {
  return requisicao(`${API_URL}/produtos/${id}`, {
    method: "DELETE",
  });
}
