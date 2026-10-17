
import { prisma } from "../lib/prisma.js";

export async function listarProdutos(req, res) {
    try {
        // Busca todos os produtos cadastrados no banco de dados
        const produtos = await prisma.produto.findMany();

        // Retorna a lista com sucesso
        return res.status(200).json({
            sucesso: true,
            quantidade: produtos.length,
            dados: produtos
        });
    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno ao tentar listar os produtos.",
            erro: error.message
        });
    }
}

export async function buscarProdutoPorId(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID inválido."
            });
        }

        // Busca o produto pelo ID
        const produto = await prisma.produto.findUnique({
            where: { id }
        });

        if (!produto) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado."
            });
        }

        return res.status(200).json({
            sucesso: true,
            dados: produto
        });
    } catch (error) {
        console.error("Erro ao buscar produto:", error);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno ao tentar buscar o produto.",
            erro: error.message
        });
    }
}


export async function cadastrarProduto(req, res) {
    const { nome, descricao, preco, codigo, quantidade } = req.body;

    try {
        // Cria um novo produto no banco de dados
        const novoProduto = await prisma.produto.create({
            data: {
                nome,
                descricao,
                preco,
                codigo,
                quantidade
            }
        });

        return res.status(201).json({
            sucesso: true,
            mensagem: "Produto cadastrado com sucesso!",
            dados: novoProduto
        });

    } catch (error) {
        console.error("Erro ao cadastrar produto:", error);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno ao tentar cadastrar o produto.",
            erro: error.message
        });
    }
}

export async function atualizarProduto(req, res) {
    const { id } = req.params;
    const { nome, descricao, preco, codigo, quantidade } = req.body;
    try {
        // Atualiza o produto no banco de dados
        const produtoAtualizado = await prisma.produto.update({
            where: { id: parseInt(id) },
            data: {
                nome,
                descricao,
                preco,
                codigo,
                quantidade
            }
        });
        return res.status(200).json({
            sucesso: true,
            dados: produtoAtualizado
        });
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno ao tentar atualizar o produto.",
            erro: error.message
        });
    }
}
export async function excluirProduto(req, res) {
    const { id } = req.params; 
    try {
        // Exclui o produto do banco de dados
        const produtoExcluido = await prisma.produto.delete({
            where: { id: parseInt(id) }
        });
        return res.status(200).json({
            sucesso: true,
            dados: produtoExcluido
        });
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno ao tentar excluir o produto.",
            erro: error.message
        });
    }
}
export async function buscarProdutoPorNome(req, res) {
    const { nome } = req.query;
    try {
        // Busca produtos pelo nome no banco de dados
        const produtos = await prisma.produto.findMany({
            where: {
                nome: {
                    contains: nome,
                    mode: "insensitive"
                }
            }
        });
    } catch (error) {
        console.error("Erro ao buscar produtos por nome:", error);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno ao tentar buscar produtos por nome.",
            erro: error.message
        });
    }
}