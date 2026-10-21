
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  buscarProdutos,
  criarProduto,
  editarProduto,
  excluirProduto,
  type DadosProduto,
} from "../service/api";
import "../styles/Produtos.css";

type Produto = DadosProduto & {
  id: number;
  criadoEm: string;
};

const formularioInicial: DadosProduto = {
  nome: "",
  descricao: "",
  codigo: "",
  quantidade: 0,
  preco: 0,
  validade: null,
};

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data: string | null | undefined) {
  if (!data) return "—";

  const dataLocal = data.slice(0, 10);
  const [ano, mes, dia] = dataLocal.split("-");

  return ano && mes && dia ? `${dia}/${mes}/${ano}` : "—";
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(
    null
  );
  const [formulario, setFormulario] =
    useState<DadosProduto>(formularioInicial);

  async function carregarProdutos() {
    setCarregando(true);
    setErro("");

    try {
      const dados = await buscarProdutos();
      setProdutos(dados as Produto[]);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os produtos."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarProdutos();
  }, []);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return produtos;

    return produtos.filter(
      (produto) =>
        produto.nome.toLowerCase().includes(termo) ||
        produto.codigo.toLowerCase().includes(termo) ||
        (produto.descricao ?? "").toLowerCase().includes(termo)
    );
  }, [produtos, busca]);

  const valorTotalEstoque = produtos.reduce(
    (total, produto) => total + produto.quantidade * produto.preco,
    0
  );

  function abrirCadastro() {
    setProdutoEditando(null);
    setFormulario({ ...formularioInicial });
    setErro("");
    setMensagem("");
    setModalAberto(true);
  }

  function abrirEdicao(produto: Produto) {
    setProdutoEditando(produto);
    setFormulario({
      nome: produto.nome,
      descricao: produto.descricao ?? "",
      codigo: produto.codigo,
      quantidade: produto.quantidade,
      preco: produto.preco,
      validade: produto.validade
        ? produto.validade.slice(0, 10)
        : null,
    });
    setErro("");
    setMensagem("");
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;

    setModalAberto(false);
    setProdutoEditando(null);
    setFormulario({ ...formularioInicial });
  }

  function atualizarCampo(
    campo: keyof DadosProduto,
    valor: string | number | null
  ) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  async function salvarProduto(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setMensagem("");

    const quantidade = Number(formulario.quantidade);
    const preco = Number(formulario.preco);

    if (!formulario.nome.trim() || !formulario.codigo.trim()) {
      setErro("Preencha o nome e o código do produto.");
      return;
    }

    if (!Number.isFinite(quantidade) || quantidade < 0 || !Number.isInteger(quantidade)) {
      setErro("A quantidade deve ser um número inteiro igual ou maior que zero.");
      return;
    }

    if (!Number.isFinite(preco) || preco < 0) {
      setErro("O preço deve ser igual ou maior que zero.");
      return;
    }

    const dados: DadosProduto = {
      nome: formulario.nome.trim(),
      descricao: formulario.descricao?.trim() || null,
      codigo: formulario.codigo.trim(),
      quantidade,
      preco,
      validade: formulario.validade || null,
    };

    setSalvando(true);

    try {
      if (produtoEditando) {
        await editarProduto(produtoEditando.id, dados);
        setMensagem("Produto atualizado com sucesso.");
      } else {
        await criarProduto(dados);
        setMensagem("Produto cadastrado com sucesso.");
      }

      setModalAberto(false);
      setProdutoEditando(null);
      setFormulario({ ...formularioInicial });
      await carregarProdutos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o produto."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function removerProduto(produto: Produto) {
    const confirmou = window.confirm(
      `Deseja realmente excluir o produto "${produto.nome}"?`
    );

    if (!confirmou) return;

    setErro("");
    setMensagem("");

    try {
      await excluirProduto(produto.id);
      setProdutos((atuais) =>
        atuais.filter((item) => item.id !== produto.id)
      );
      setMensagem(`Produto "${produto.nome}" excluído com sucesso.`);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o produto."
      );
    }
  }

  return (
    <main className="produtos-page">
      <section className="produtos-heading">
        <div>
          <span className="produtos-eyebrow">GESTÃO DE ESTOQUE</span>
          <h1>Produtos</h1>
          <p>Gerencie os produtos cadastrados no seu estoque.</p>
        </div>

        <button
          className="botao-adicionar"
          type="button"
          onClick={abrirCadastro}
        >
          <span aria-hidden="true">＋</span> Adicionar produto
        </button>
      </section>

      <section className="produtos-resumo">
        <article className="resumo-card">
          <span className="resumo-icone">▦</span>
          <div>
            <p>Produtos cadastrados</p>
            <strong>{produtos.length}</strong>
          </div>
        </article>

        <article className="resumo-card">
          <span className="resumo-icone">▤</span>
          <div>
            <p>Unidades em estoque</p>
            <strong>
              {produtos.reduce(
                (total, produto) => total + produto.quantidade,
                0
              )}
            </strong>
          </div>
        </article>

        <article className="resumo-card">
          <span className="resumo-icone">R$</span>
          <div>
            <p>Valor total do estoque</p>
            <strong>{formatarMoeda(valorTotalEstoque)}</strong>
          </div>
        </article>
      </section>

      {mensagem && (
        <div className="aviso-produtos aviso-sucesso" role="status">
          {mensagem}
          <button
            type="button"
            aria-label="Fechar mensagem"
            onClick={() => setMensagem("")}
          >
            ×
          </button>
        </div>
      )}

      {erro && !modalAberto && (
        <div className="aviso-produtos aviso-erro" role="alert">
          {erro}
          <button
            type="button"
            aria-label="Fechar mensagem"
            onClick={() => setErro("")}
          >
            ×
          </button>
        </div>
      )}

      <section className="produtos-panel">
        <div className="produtos-panel-topo">
          <div>
            <h2>Todos os produtos</h2>
            <p>Consulte e organize os itens do seu estoque.</p>
          </div>

          <label className="campo-busca">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Buscar por nome ou código..."
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </label>
        </div>

        <div className="tabela-container">
          <table className="tabela-produtos">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Código</th>
                <th>Quantidade</th>
                <th>Preço unitário</th>
                <th>Validade</th>
                <th className="coluna-acoes">Ações</th>
              </tr>
            </thead>

            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan={6} className="estado-tabela">
                    Carregando produtos...
                  </td>
                </tr>
              ) : produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="estado-tabela">
                    {busca
                      ? "Nenhum produto encontrado para essa busca."
                      : "Seu estoque ainda está vazio. Adicione o primeiro produto!"}
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((produto) => (
                  <tr key={produto.id}>
                    <td>
                      <div className="produto-identificacao">
                        <span className="produto-avatar">
                          {produto.nome.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <strong>{produto.nome}</strong>
                          <small>{produto.descricao || "Sem descrição"}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="produto-codigo">{produto.codigo}</span>
                    </td>

                    <td>
                      <span
                        className={`estoque-status ${
                          produto.quantidade === 0
                            ? "estoque-vazio"
                            : produto.quantidade <= 5
                              ? "estoque-baixo"
                              : "estoque-normal"
                        }`}
                      >
                        {produto.quantidade} un.
                      </span>
                    </td>

                    <td className="preco-produto">
                      {formatarMoeda(produto.preco)}
                    </td>

                    <td>{formatarData(produto.validade)}</td>

                    <td>
                      <div className="acoes-produto">
                        <button
                          className="botao-acao botao-editar"
                          type="button"
                          title="Editar produto"
                          aria-label={`Editar ${produto.nome}`}
                          onClick={() => abrirEdicao(produto)}
                        >
                          ✎
                        </button>

                        <button
                          className="botao-acao botao-excluir"
                          type="button"
                          title="Excluir produto"
                          aria-label={`Excluir ${produto.nome}`}
                          onClick={() => void removerProduto(produto)}
                        >
                          ×
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="produtos-panel-rodape">
          Exibindo {produtosFiltrados.length} de {produtos.length} produto(s)
        </footer>
      </section>

      {modalAberto && (
        <div
          className="modal-fundo"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) fecharModal();
          }}
        >
          <section
            className="modal-produto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-produto"
          >
            <div className="modal-cabecalho">
              <div>
                <span className="produtos-eyebrow">
                  {produtoEditando ? "ATUALIZAÇÃO" : "NOVO REGISTRO"}
                </span>
                <h2 id="titulo-modal-produto">
                  {produtoEditando ? "Editar produto" : "Adicionar produto"}
                </h2>
                <p>Preencha as informações do produto abaixo.</p>
              </div>

              <button
                className="modal-fechar"
                type="button"
                onClick={fecharModal}
                disabled={salvando}
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={salvarProduto}>
              <div className="formulario-grid">
                <label className="campo-produto campo-largo">
                  Nome do produto *
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={formulario.nome}
                    onChange={(evento) =>
                      atualizarCampo("nome", evento.target.value)
                    }
                    placeholder="Ex.: Teclado mecânico"
                  />
                </label>

                <label className="campo-produto">
                  Código *
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={formulario.codigo}
                    onChange={(evento) =>
                      atualizarCampo("codigo", evento.target.value)
                    }
                    placeholder="Ex.: TEC-001"
                  />
                </label>

                <label className="campo-produto">
                  Quantidade *
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formulario.quantidade}
                    onChange={(evento) =>
                      atualizarCampo(
                        "quantidade",
                        evento.target.value === ""
                          ? 0
                          : Number(evento.target.value)
                      )
                    }
                  />
                </label>

                <label className="campo-produto">
                  Preço unitário (R$) *
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formulario.preco}
                    onChange={(evento) =>
                      atualizarCampo(
                        "preco",
                        evento.target.value === ""
                          ? 0
                          : Number(evento.target.value)
                      )
                    }
                  />
                </label>

                <label className="campo-produto">
                  Data de validade
                  <input
                    type="date"
                    value={formulario.validade ?? ""}
                    onChange={(evento) =>
                      atualizarCampo("validade", evento.target.value || null)
                    }
                  />
                </label>

                <label className="campo-produto campo-largo">
                  Descrição
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={formulario.descricao ?? ""}
                    onChange={(evento) =>
                      atualizarCampo("descricao", evento.target.value)
                    }
                    placeholder="Informações adicionais sobre o produto..."
                  />
                </label>
              </div>

              {produtoEditando && (
                <p className="modal-info">
                  ID do produto: {produtoEditando.id} · Cadastrado em{" "}
                  {formatarData(produtoEditando.criadoEm)}
                </p>
              )}

              {erro && (
                <div className="aviso-produtos aviso-erro" role="alert">
                  {erro}
                </div>
              )}

              <div className="modal-acoes">
                <button
                  className="botao-cancelar"
                  type="button"
                  onClick={fecharModal}
                  disabled={salvando}
                >
                  Cancelar
                </button>

                <button
                  className="botao-adicionar"
                  type="submit"
                  disabled={salvando}
                >
                  {salvando
                    ? "Salvando..."
                    : produtoEditando
                      ? "Salvar alterações"
                      : "Cadastrar produto"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
