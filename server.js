
import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.json({
        mensagem: "StockLab API está funcionando!",
        status: "online"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
