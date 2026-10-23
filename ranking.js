"use strict";

// ==========================================
// CONFIGURAÇÕES DA API
// ==========================================

const API_URL = "http://localhost:3000";

// ==========================================
// ELEMENTOS DO HTML
// ==========================================

const corpoRanking =
    document.getElementById("corpo-ranking");

const mensagemRanking =
    document.getElementById("mensagem-ranking");

const totalJogadores =
    document.getElementById("total-jogadores");

const maiorPontuacao =
    document.getElementById("maior-pontuacao");

const melhorJogador =
    document.getElementById("melhor-jogador");

const btnAtualizar =
    document.getElementById("btn-atualizar");

// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(dataOriginal) {

    if (!dataOriginal) {
        return "-";
    }

    const data = new Date(dataOriginal);

    if (Number.isNaN(data.getTime())) {
        return "-";
    }

    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

// ==========================================
// LIMPAR RANKING
// ==========================================

function limparRanking() {

    corpoRanking.innerHTML = "";

    totalJogadores.textContent = "0";

    maiorPontuacao.textContent = "0";

    melhorJogador.textContent = "---";
}

// ==========================================
// ATUALIZAR ESTATÍSTICAS
// ==========================================

function atualizarEstatisticas(ranking) {

    totalJogadores.textContent = ranking.length;

    if (ranking.length === 0) {

        maiorPontuacao.textContent = "0";

        melhorJogador.textContent = "---";

        return;
    }

    const melhor = ranking.reduce(
        (atual, participante) => {

            return Number(participante.pontuacao) >
                Number(atual.pontuacao)
                ? participante
                : atual;

        },
        ranking[0]
    );

    maiorPontuacao.textContent =
        melhor.pontuacao;

    melhorJogador.textContent =
        melhor.nome;
}

// ==========================================
// CRIAR CÉLULA DA TABELA
// ==========================================

function criarCelula(linha, valor) {

    const celula = document.createElement("td");

    celula.textContent = String(valor);

    linha.appendChild(celula);
}

// ==========================================
// PREENCHER TABELA
// ==========================================

function preencherTabela(ranking) {

    corpoRanking.innerHTML = "";

    ranking.forEach((participante, indice) => {

        const linha = document.createElement("tr");

        const posicao =
            participante.posicao ?? indice + 1;

        const nome =
            participante.nome ?? "Participante";

        const pontos =
            participante.pontuacao ?? 0;

        const acertos =
            participante.acertos ?? 0;

        const totalPerguntas =
            participante.total_perguntas ?? 10;

        const tempo =
            participante.tempo_total ?? 0;

        const data =
            formatarData(participante.criado_em);

        // POSIÇÃO

        criarCelula(
            linha,
            `${posicao}º`
        );

        // NOME

        criarCelula(
            linha,
            nome
        );

        // PONTUAÇÃO

        criarCelula(
            linha,
            pontos
        );

        // ACERTOS

        criarCelula(
            linha,
            `${acertos} de ${totalPerguntas}`
        );

        // TEMPO

        criarCelula(
            linha,
            `${tempo}s`
        );

        // DATA

        criarCelula(
            linha,
            data
        );

        corpoRanking.appendChild(linha);

    });
}

// ==========================================
// CONSULTAR API DO NEON
// ==========================================

async function buscarRanking() {

    let resposta;

    try {

        resposta = await fetch(
            `${API_URL}/api/ranking`,
            {
                method: "GET",
                cache: "no-store"
            }
        );

    } catch (erro) {

        throw new Error(
            "Não foi possível conectar ao backend. " +
            "Verifique se o Node.js está funcionando."
        );
    }

    if (!resposta.ok) {

        throw new Error(
            `Erro HTTP ${resposta.status} ao consultar ranking.`
        );
    }

    const tipoConteudo =
        resposta.headers.get("content-type") || "";

    if (!tipoConteudo.includes("application/json")) {

        throw new Error(
            "A API não retornou JSON. " +
            "Verifique o endereço do backend."
        );
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados.ranking)) {

        throw new Error(
            "O servidor retornou um ranking inválido."
        );
    }

    return dados.ranking;
}

// ==========================================
// CARREGAR RANKING
// ==========================================

async function carregarRanking() {

    btnAtualizar.disabled = true;

    btnAtualizar.textContent =
        "Atualizando...";

    mensagemRanking.textContent =
        "Carregando ranking...";

    try {

        const ranking = await buscarRanking();

        limparRanking();

        if (ranking.length === 0) {

            mensagemRanking.textContent =
                "Ainda não há participantes. " +
                "Seja o primeiro a jogar!";

            return;
        }

        preencherTabela(ranking);

        atualizarEstatisticas(ranking);

        mensagemRanking.textContent =
            `${ranking.length} participação(ões) exibida(s).`;

        console.log(
            "Ranking carregado com sucesso:",
            ranking
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar ranking:",
            erro
        );

        limparRanking();

        mensagemRanking.textContent =
            erro.message;

    } finally {

        btnAtualizar.disabled = false;

        btnAtualizar.textContent =
            "Atualizar ranking";
    }
}

// ==========================================
// EVENTOS
// ==========================================

btnAtualizar.addEventListener(
    "click",
    carregarRanking
);

// Carrega automaticamente ao abrir a página

carregarRanking();
