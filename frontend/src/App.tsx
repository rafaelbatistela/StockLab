
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Produtos from "./pages/Produtos";
import { buscarProdutos } from "./service/api";
import "./styles/App.css";

type Produto = {
  id: number;
  nome: string;
  descricao: string | null;
  codigo: string;
  quantidade: number;
  preco: number;
  criadoEm: string;
  validade: string | null;
};

function Dashboard() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        setProdutos(await buscarProdutos());
      } catch (error) {
        console.error(error);
        setErro("Não foi possível conectar à API.");
      } finally {
        setCarregando(false);
      }
    }

    void carregar();
  }, []);

  const totalUnidades = produtos.reduce(
    (total, produto) => total + produto.quantidade,
    0
  );

  const valorEstoque = produtos.reduce(
    (total, produto) =>
      total + produto.quantidade * Number(produto.preco),
    0
  );

  return (
    <main className="dashboard">
      <section className="dashboard-heading">
        <div>
          <p className="eyebrow">PAINEL DE CONTROLE</p>
          <h1>Visão geral</h1>
          <p>Acompanhe os indicadores do seu estoque.</p>
        </div>
      </section>

      {erro && <p className="state-message">{erro}</p>}

      <section className="stats-grid">
        <article className="stat-card">
          <p>Produtos cadastrados</p>
          <h2>{carregando ? "..." : produtos.length}</h2>
        </article>

        <article className="stat-card">
          <p>Unidades em estoque</p>
          <h2>{carregando ? "..." : totalUnidades}</h2>
        </article>

        <article className="stat-card">
          <p>Valor do estoque</p>
          <h2>
            {carregando
              ? "..."
              : valorEstoque.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
          </h2>
        </article>
      </section>

      <section className="dashboard-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">INVENTÁRIO</p>
            <h2>Produtos recentes</h2>
          </div>
        </div>

        {carregando && <p>Carregando produtos...</p>}

        {!carregando && !erro && produtos.length === 0 && (
          <p>Nenhum produto cadastrado.</p>
        )}

        {!carregando && !erro && produtos.length > 0 && (
          <div className="product-grid">
            {produtos.slice(0, 4).map((produto) => (
              <article className="product-card" key={produto.id}>
                <div className="product-card-top">
                  <span className="product-icon">S</span>
                  <span className="product-code">{produto.codigo}</span>
                </div>

                <h3>{produto.nome}</h3>
                <p>{produto.descricao || "Sem descrição"}</p>

                <div className="product-details">
                  <p>
                    <span>Quantidade</span>
                    <strong>{produto.quantidade}</strong>
                  </p>
                  <p>
                    <span>Preço unitário</span>
                    <strong>
                      {Number(produto.preco).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </strong>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route
            path="*"
            element={
              <main className="dashboard">
                <h1>Página não encontrada</h1>
                <p>Confira o endereço e tente novamente.</p>
              </main>
            }
          />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
