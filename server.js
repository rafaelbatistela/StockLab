
import express from "express";
import cors from "cors";
import "dotenv/config";
import produtoRoutes from "./src/routes/produto.Routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota raiz
app.get("/", (req, res) => {
    res.json({
        mensagem: "StockLab API está funcionando!",
        status: "online"
    });
});

// Rotas da aplicação
app.use("/produtos", produtoRoutes);

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: "Rota não encontrada."
    });
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
