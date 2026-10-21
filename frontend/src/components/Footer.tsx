
import "../styles/HeaderFooter.css";

function Footer() {
  const anoAtual = new Date().getFullYear();
  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <footer className="glass footer">
      <p className="footer-copyright">
        © Rafael batistela {anoAtual} {dataAtual}
      </p>

      <div className="footer-links">
        <a
          href="https://github.com/rafaelbatistela"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>

        <a
          href="https://www.instagram.com/batis_rafael/"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
}

export default Footer;
