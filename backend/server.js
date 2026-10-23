
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("node:crypto");

const pool = require("./db");
const perguntas = require("./perguntas");

const app = express();
const PORT = process.env.PORT || 3000;

const TEMPO_LIMITE = 20;
const PONTOS_ACERTO = 100;
const BONUS_SEGUNDO = 5;
const DURACAO_MAXIMA = 60 * 60 * 1000;

const partidas = new Map();

app.use(cors({
    origin: [
        process.env.FRONTEND_ORIGIN,
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://lightis4.github.io"
    ].filter(Boolean)
}));

app.use(express.json({ limit: "20kb" }));

function embaralhar(lista) {
    const copia = [...lista];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = crypto.randomInt(i + 1);
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

function perguntaPublica(partida) {
    const indice = partida.ordem[partida.atual];
    const p = perguntas[indice];

    return {
        numero: partida.atual + 1,
        total: partida.ordem.length,
        pergunta: p.pergunta,
        alternativas: p.alternativas,
        tempoLimite: TEMPO_LIMITE
    };
}

function buscarPartida(req, res) {
    const id = req.body?.partidaId;

    if (typeof id !== "string") {
        res.status(400).json({
            mensagem: "Identificador inválido."
        });
        return null;
    }

    const partida = partidas.get(id);

    if (!partida) {
        res.status(404).json({
            mensagem: "Partida não encontrada ou expirada."
        });
        return null;
    }

    if (Date.now() - partida.criadaEm > DURACAO_MAXIMA) {
        partidas.delete(id);
        res.status(410).json({
            mensagem: "Partida expirada. Inicie novamente."
        });
        return null;
    }

    return partida;
}

// Limpeza de partidas antigas
setInterval(() => {
    const agora = Date.now();

    for (const [id, partida] of partidas) {
        if (agora - partida.criadaEm > DURACAO_MAXIMA) {
            partidas.delete(id);
        }
    }
}, 10 * 60 * 1000).unref();

app.get("/", (req, res) => {
    res.json({
        mensagem: "API Cyber Segurança funcionando!"
    });
});

app.get("/api/status", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            status: "online",
            banco: "Neon PostgreSQL conectado"
        });
    } catch (erro) {
        console.error(erro);

        res.status(503).json({
            mensagem: "Banco indisponível."
        });
    }
});

app.get("/api/ranking", async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                posicao,
                nome,
                pontuacao,
                acertos,
                total_perguntas,
                tempo_total,
                criado_em
            FROM ranking_classificacao
            ORDER BY posicao ASC
            LIMIT 100
        `);

        res.json({
            ranking: resultado.rows
        });
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao consultar ranking."
        });
    }
});

// Iniciar partida
app.post("/api/quiz/iniciar", (req, res) => {
    const nome = req.body?.nome;

    if (
        typeof nome !== "string" ||
        nome.trim().length < 2 ||
        nome.trim().length > 30
    ) {
        return res.status(400).json({
            mensagem: "Digite um nome entre 2 e 30 caracteres."
        });
    }

    const id = crypto.randomUUID();

    const partida = {
        id,
        nome: nome.trim(),
        ordem: embaralhar(
            perguntas.map((_, indice) => indice)
        ),
        atual: 0,
        pontos: 0,
        acertos: 0,
        tempoTotal: 0,
        criadaEm: Date.now(),
        inicioPergunta: Date.now(),
        respondida: false,
        respostaAtual: null,
        finalizando: false
    };

    partidas.set(id, partida);

    res.status(201).json({
        partidaId: id,
        pergunta: perguntaPublica(partida),
        pontuacao: 0
    });
});

// Receber uma resposta
app.post("/api/quiz/responder", (req, res) => {
    const partida = buscarPartida(req, res);
    if (!partida) return;

    if (partida.respondida) {
        return res.json(partida.respostaAtual);
    }

    const escolha = req.body?.resposta;

    if (
        escolha !== null &&
        (!Number.isInteger(escolha) ||
         escolha < 0 ||
         escolha > 3)
    ) {
        return res.status(400).json({
            mensagem: "Resposta inválida."
        });
    }

    const indice = partida.ordem[partida.atual];
    const pergunta = perguntas[indice];

    const decorrido = Math.max(
        0,
        Date.now() - partida.inicioPergunta
    );

    const tempoGasto = Math.min(
        TEMPO_LIMITE,
        Math.ceil(decorrido / 1000)
    );

    const tempoRestante = Math.max(
        0,
        TEMPO_LIMITE - tempoGasto
    );

    const dentroDoPrazo = decorrido < TEMPO_LIMITE * 1000;

    const correta =
        dentroDoPrazo &&
        escolha === pergunta.correta;

    const pontosGanhos = correta
        ? PONTOS_ACERTO + tempoRestante * BONUS_SEGUNDO
        : 0;

    partida.pontos += pontosGanhos;
    partida.acertos += correta ? 1 : 0;
    partida.tempoTotal += tempoGasto;
    partida.respondida = true;

    partida.respostaAtual = {
        correta,
        corretaIndice: pergunta.correta,
        tempoEsgotado: !dentroDoPrazo,
        pontosGanhos,
        pontuacao: partida.pontos,
        acertos: partida.acertos,
        tempoTotal: partida.tempoTotal,
        ultima: partida.atual === partida.ordem.length - 1
    };

    res.json(partida.respostaAtual);
});

// Avançar para próxima pergunta
app.post("/api/quiz/proxima", (req, res) => {
    const partida = buscarPartida(req, res);
    if (!partida) return;

    if (!partida.respondida) {
        return res.status(409).json({
            mensagem: "Responda à pergunta atual primeiro."
        });
    }

    if (partida.atual >= partida.ordem.length - 1) {
        return res.status(409).json({
            mensagem: "Use a rota de finalização."
        });
    }

    partida.atual++;
    partida.respondida = false;
    partida.respostaAtual = null;
    partida.inicioPergunta = Date.now();

    res.json({
        pergunta: perguntaPublica(partida),
        pontuacao: partida.pontos
    });
});

// Finalizar e salvar no Neon
app.post("/api/quiz/finalizar", async (req, res) => {
    const partida = buscarPartida(req, res);
    if (!partida) return;

    if (
        partida.atual !== partida.ordem.length - 1 ||
        !partida.respondida
    ) {
        return res.status(409).json({
            mensagem: "O quiz ainda não foi concluído."
        });
    }

    if (partida.finalizando) {
        return res.status(409).json({
            mensagem: "Finalização em andamento."
        });
    }

    partida.finalizando = true;

    try {
        const resultado = await pool.query(`
            INSERT INTO ranking (
                nome,
                pontuacao,
                acertos,
                total_perguntas,
                tempo_total
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, criado_em
        `, [
            partida.nome,
            partida.pontos,
            partida.acertos,
            partida.ordem.length,
            partida.tempoTotal
        ]);

        partidas.delete(partida.id);

        res.status(201).json({
            mensagem: "Resultado salvo no Neon!",
            id: resultado.rows[0].id,
            nome: partida.nome,
            pontuacao: partida.pontos,
            acertos: partida.acertos,
            totalPerguntas: partida.ordem.length,
            tempoTotal: partida.tempoTotal,
            data: resultado.rows[0].criado_em
        });

    } catch (erro) {
        partida.finalizando = false;
        console.error("Erro ao salvar:", erro);

        res.status(500).json({
            mensagem: "Não foi possível salvar o resultado."
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `Servidor rodando em http://localhost:${PORT}`
    );
});
