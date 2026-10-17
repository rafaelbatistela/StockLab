import { Router } from "express";

import {
    listarProdutos,
    buscarProdutoPorId,
    cadastrarProduto,
    atualizarProduto,
    buscarProdutoPorNome,
    excluirProduto
} from "../controllers/produto.Controller.js";

const router = Router();

// Listar todos os produtos
router.get("/", listarProdutos);

// Buscar um produto pelo ID
router.get("/:id", buscarProdutoPorId);
// Buscar um produto pelo Nome
router.get("/nome", buscarProdutoPorNome);

// Cadastrar um produto
router.post("/", cadastrarProduto);

// Atualizar um produto
router.put("/:id", atualizarProduto);

// Excluir um produto
router.delete("/:id", excluirProduto);

export default router;