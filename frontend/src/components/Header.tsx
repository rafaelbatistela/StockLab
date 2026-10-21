
import "../styles/HeaderFooter.css";

function Header() {
  return (
    <header className="glass header">
      <a className="brand" href="/" aria-label="StockLab - Início">
        <span className="brand-icon">
          <span className="brand-symbol">S</span>
        </span>

        <span className="brand-name">StockLab</span>
      </a>

      <nav className="navigation" aria-label="Navegação principal">
        <a className="nav-link active" href="/">
          Início
        </a>

        <a className="nav-link" href="/produtos">
          Produtos
        </a>

        <a className="nav-link" href="/configuracoes">
          Configurações
        </a>
      </nav>
    </header>
  );
}

export default Header;
