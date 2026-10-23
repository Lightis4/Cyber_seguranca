
"use strict";

// ==========================================
// CONFIGURAÇÕES
// ==========================================

const API_URL = "https://cyber-seguranca-api.onrender.com";
const TEMPO_LIMITE = 20;

// ==========================================
// ELEMENTOS DO HTML
// ==========================================

const telaInicial = document.getElementById("tela-inicial");
const telaQuiz = document.getElementById("tela-quiz");
const telaResultado = document.getElementById("tela-resultado");

const inputNome = document.getElementById("nome");

const btnIniciar = document.getElementById("btn-iniciar");
const btnProxima = document.getElementById("btn-proxima");
const btnReiniciar = document.getElementById("btn-reiniciar");

const numeroPergunta = document.getElementById("numero-pergunta");
const elementoPontuacao = document.getElementById("pontuacao");

const elementoTempo = document.getElementById("tempo");
const progressoTempo = document.getElementById("progresso-tempo");

const elementoPergunta = document.getElementById("pergunta");
const elementoAlternativas = document.getElementById("alternativas");
const elementoMensagem = document.getElementById("mensagem");

const resultadoNome = document.getElementById("resultado-nome");
const resultadoPontos = document.getElementById("resultado-pontos");
const resultadoAcertos = document.getElementById("resultado-acertos");
const resultadoTempo = document.getElementById("resultado-tempo");
const resultadoStatus = document.getElementById("resultado-status");

// ==========================================
// ESTADO DO QUIZ
// ==========================================

let partidaId = null;
let nomeParticipante = "";
let perguntaAtual = null;

let pontuacao = 0;
let tempoRestante = TEMPO_LIMITE;
let intervalo = null;

let respondida = false;
let requisicaoPendente = false;
let respostaPendente = null;

// ==========================================
// COMUNICAÇÃO COM A API PÚBLICA
// ==========================================

async function chamarAPI(rota, dados = null) {
    const opcoes = dados === null
        ? {}
        : {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        };

    let resposta;

    try {
        resposta = await fetch(
            `${API_URL}${rota}`,
            opcoes
        );
    } catch (erro) {
        console.error("Erro de conexão:", erro);

        throw new Error(
            "Não foi possível conectar ao servidor online. " +
            "Aguarde alguns instantes e tente novamente."
        );
    }

    const tipoConteudo =
        resposta.headers.get("content-type") || "";

    if (!tipoConteudo.includes("application/json")) {
        const texto = await resposta.text();

        console.error(
            "Resposta inesperada:",
            texto.slice(0, 300)
        );

        throw new Error(
            "O servidor retornou um conteúdo inesperado. " +
            "Verifique a configuração da API."
        );
    }

    let resultado;

    try {
        resultado = await resposta.json();
    } catch (erro) {
        throw new Error(
            "O servidor enviou uma resposta JSON inválida."
        );
    }

    if (!resposta.ok) {
        throw new Error(
            resultado.mensagem ||
            `Erro HTTP ${resposta.status}.`
        );
    }

    return resultado;
}

// ==========================================
// CONTROLE DAS TELAS
// ==========================================

function mostrarTela(tela) {
    telaInicial.classList.add("oculto");
    telaQuiz.classList.add("oculto");
    telaResultado.classList.add("oculto");

    tela.classList.remove("oculto");
}

// ==========================================
// CRONÔMETRO
// ==========================================

function atualizarTempo() {
    elementoTempo.textContent = tempoRestante;

    const porcentagem =
        (tempoRestante / TEMPO_LIMITE) * 100;

    progressoTempo.style.width = `${porcentagem}%`;

    progressoTempo.classList.toggle(
        "tempo-critico",
        tempoRestante <= 5
    );
}

function pararCronometro() {
    if (intervalo !== null) {
        clearInterval(intervalo);
        intervalo = null;
    }
}

function iniciarCronometro() {
    pararCronometro();

    const inicio = performance.now();

    intervalo = setInterval(() => {
        const segundosPassados = Math.floor(
            (performance.now() - inicio) / 1000
        );

        tempoRestante = Math.max(
            0,
            TEMPO_LIMITE - segundosPassados
        );

        atualizarTempo();

        if (tempoRestante <= 0) {
            pararCronometro();
            responder(null);
        }
    }, 100);
}

// ==========================================
// INICIAR QUIZ
// ==========================================

async function iniciarQuiz() {
    if (requisicaoPendente) return;

    const nome = inputNome.value.trim();

    if (nome.length < 2 || nome.length > 30) {
        alert("Digite um nome entre 2 e 30 caracteres.");
        inputNome.focus();
        return;
    }

    requisicaoPendente = true;

    btnIniciar.disabled = true;
    btnIniciar.textContent = "Iniciando...";

    try {
        const dados = await chamarAPI(
            "/api/quiz/iniciar",
            { nome }
        );

        if (!dados.partidaId || !dados.pergunta) {
            throw new Error(
                "O backend não retornou os dados da partida."
            );
        }

        partidaId = dados.partidaId;
        nomeParticipante = nome;
        pontuacao = dados.pontuacao || 0;

        mostrarTela(telaQuiz);
        carregarPergunta(dados.pergunta);
    } catch (erro) {
        console.error("Erro ao iniciar quiz:", erro);
        alert(erro.message);
    } finally {
        requisicaoPendente = false;
        btnIniciar.disabled = false;
        btnIniciar.textContent = "Iniciar Quiz";
    }
}

// ==========================================
// CARREGAR PERGUNTA
// ==========================================

function carregarPergunta(pergunta) {
    pararCronometro();

    perguntaAtual = pergunta;

    respondida = false;
    requisicaoPendente = false;
    respostaPendente = null;

    tempoRestante = TEMPO_LIMITE;

    numeroPergunta.textContent =
        `Pergunta ${pergunta.numero} de ${pergunta.total}`;

    elementoPontuacao.textContent =
        `Pontos: ${pontuacao}`;

    elementoPergunta.textContent = pergunta.pergunta;

    elementoMensagem.textContent = "";
    elementoMensagem.className = "";

    btnProxima.classList.add("oculto");
    btnProxima.disabled = false;

    elementoAlternativas.innerHTML = "";

    pergunta.alternativas.forEach((alternativa, indice) => {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "alternativa";
        botao.textContent = alternativa;

        botao.addEventListener("click", () => {
            responder(indice);
        });

        elementoAlternativas.appendChild(botao);
    });

    atualizarTempo();
    iniciarCronometro();
}

// ==========================================
// ENVIAR RESPOSTA AO BACKEND
// ==========================================

async function responder(indiceEscolhido) {
    if (respondida || requisicaoPendente) return;

    requisicaoPendente = true;
    respostaPendente = indiceEscolhido;

    pararCronometro();

    const botoes =
        elementoAlternativas.querySelectorAll(
            "button.alternativa"
        );

    botoes.forEach(botao => {
        botao.disabled = true;
    });

    elementoMensagem.textContent =
        "Verificando resposta...";

    try {
        const resultado = await chamarAPI(
            "/api/quiz/responder",
            {
                partidaId,
                resposta: indiceEscolhido
            }
        );

        respondida = true;
        pontuacao = resultado.pontuacao;

        elementoPontuacao.textContent =
            `Pontos: ${pontuacao}`;

        if (resultado.correta) {
            elementoMensagem.textContent =
                `Resposta correta! +${resultado.pontosGanhos} pontos.`;

            elementoMensagem.className =
                "mensagem-correta";
        } else if (
            resultado.tempoEsgotado ||
            indiceEscolhido === null
        ) {
            elementoMensagem.textContent =
                "Tempo esgotado!";

            elementoMensagem.className =
                "mensagem-errada";
        } else {
            elementoMensagem.textContent =
                "Resposta incorreta!";

            elementoMensagem.className =
                "mensagem-errada";
        }

        botoes.forEach((botao, indice) => {
            if (indice === resultado.corretaIndice) {
                botao.classList.add("correta");
            } else if (indice === indiceEscolhido) {
                botao.classList.add("errada");
            }
        });

        btnProxima.textContent = resultado.ultima
            ? "Finalizar Quiz"
            : "Próxima pergunta";

        btnProxima.classList.remove("oculto");
        respostaPendente = null;
    } catch (erro) {
        console.error(
            "Erro ao enviar resposta:",
            erro
        );

        elementoMensagem.textContent =
            `Erro: ${erro.message}`;

        elementoMensagem.className =
            "mensagem-errada";

        // Mantém a possibilidade de tentar novamente.
        const botaoTentar = document.createElement("button");

        botaoTentar.type = "button";
        botaoTentar.className = "botao";
        botaoTentar.textContent =
            "Tentar enviar novamente";

        botaoTentar.addEventListener("click", () => {
            botaoTentar.remove();
            responder(respostaPendente);
        });

        elementoAlternativas.appendChild(botaoTentar);
    } finally {
        requisicaoPendente = false;
    }
}

// ==========================================
// PRÓXIMA PERGUNTA
// ==========================================

async function proximaPergunta() {
    if (!respondida || requisicaoPendente) return;

    requisicaoPendente = true;
    btnProxima.disabled = true;

    const ultimaPergunta =
        perguntaAtual.numero === perguntaAtual.total;

    try {
        if (ultimaPergunta) {
            await finalizarQuiz();
        } else {
            const dados = await chamarAPI(
                "/api/quiz/proxima",
                { partidaId }
            );

            pontuacao = dados.pontuacao;
            carregarPergunta(dados.pergunta);
        }
    } catch (erro) {
        console.error("Erro ao avançar:", erro);

        elementoMensagem.textContent =
            `Erro: ${erro.message}`;

        elementoMensagem.className =
            "mensagem-errada";

        btnProxima.disabled = false;

        btnProxima.textContent = ultimaPergunta
            ? "Tentar salvar novamente"
            : "Tentar próxima pergunta";
    } finally {
        requisicaoPendente = false;
    }
}

// ==========================================
// FINALIZAR E SALVAR NO NEON
// ==========================================

async function finalizarQuiz() {
    pararCronometro();

    btnProxima.textContent =
        "Salvando resultado...";

    const resultado = await chamarAPI(
        "/api/quiz/finalizar",
        { partidaId }
    );

    mostrarTela(telaResultado);

    resultadoNome.textContent =
        `Participante: ${resultado.nome}`;

    resultadoPontos.textContent =
        resultado.pontuacao;

    resultadoAcertos.textContent =
        `Acertos: ${resultado.acertos} de ${resultado.totalPerguntas}`;

    resultadoTempo.textContent =
        `Tempo total: ${resultado.tempoTotal} segundos`;

    resultadoStatus.textContent =
        "Resultado salvo no Neon PostgreSQL!";

    partidaId = null;
}

// ==========================================
// REINICIAR QUIZ
// ==========================================

function reiniciarQuiz() {
    pararCronometro();

    partidaId = null;
    nomeParticipante = "";
    perguntaAtual = null;

    pontuacao = 0;
    tempoRestante = TEMPO_LIMITE;

    respondida = false;
    requisicaoPendente = false;
    respostaPendente = null;

    btnProxima.disabled = false;
    btnProxima.textContent = "Próxima pergunta";

    elementoMensagem.textContent = "";

    mostrarTela(telaInicial);
}

// ==========================================
// EVENTOS
// ==========================================

btnIniciar.addEventListener(
    "click",
    iniciarQuiz
);

btnProxima.addEventListener(
    "click",
    proximaPergunta
);

btnReiniciar.addEventListener(
    "click",
    reiniciarQuiz
);
