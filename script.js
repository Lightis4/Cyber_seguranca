/* ===== MENU DE NAVEGAÇÃO ===== */

const menu = document.createElement("nav");

menu.id = "menu-navegacao";
menu.setAttribute("aria-label", "Menu principal");

menu.innerHTML = `
    <a href="#definicao" class="logo-menu">
        CYBER<span>SECURITY</span>
    </a>

    <button
        class="menu-toggle"
        aria-label="Abrir menu"
        aria-expanded="false"
        aria-controls="links-menu"
    >
        ☰
    </button>

    <div class="links-menu" id="links-menu">
        <a href="#definicao">Início</a>
        <a href="#carreiras">Carreiras</a>
        <a href="#golpes">Golpes cibernéticos</a>
        <a href="#senha-forte">Senhas fortes</a>
        <a href="#quiz-final">Quiz final</a>
    </div>
`;

document.body.prepend(menu);

const estiloMenu = document.createElement("style");

estiloMenu.textContent = `
    html {
        scroll-behavior: smooth;
        scroll-padding-top: 90px;
    }

    #menu-navegacao {
        position: sticky;
        top: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding: 16px 5%;
        background: #0b132b;
        border-bottom: 1px solid #1e3a5f;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.2);
    }

    .logo-menu {
        color: #ffffff;
        font-size: 1.1rem;
        font-weight: 800;
        text-decoration: none;
        white-space: nowrap;
    }

    .logo-menu span {
        color: #00ffdd;
    }

    .links-menu {
        display: flex;
        align-items: center;
        gap: 22px;
    }

    .links-menu a {
        color: #cbd5e1;
        text-decoration: none;
        font-size: 0.92rem;
        transition: color 0.2s ease;
    }

    .links-menu a {
    padding: 9px 12px;
    border: 1px solid transparent;
    border-radius: 8px;
    transition: color 0.2s ease,
                background 0.2s ease,
                border-color 0.2s ease;
}

.links-menu a:hover,
.links-menu a.ativo {
    color: #00ffdd;
    background: rgba(0, 255, 221, 0.08);
    border-color: #00ffdd;
}

/* Botão especial do quiz */
.links-menu a.botao-quiz {
    color: #0b132b;
    background: #00ffdd;
    border: 1px solid #00ffdd;
    border-radius: 8px;
    font-weight: 700;
    padding: 10px 16px;
}

.links-menu a.botao-quiz:hover {
    color: #ffffff;
    background: transparent;
}

    .menu-toggle {
        display: none;
        color: #00ffdd;
        background: transparent;
        border: 1px solid #1e3a5f;
        border-radius: 8px;
        padding: 6px 12px;
        font-size: 1.5rem;
        cursor: pointer;
    }

    @media (max-width: 850px) {
        #menu-navegacao {
            flex-wrap: wrap;
            padding: 14px 18px;
        }

        .menu-toggle {
            display: block;
        }

        .links-menu {
            display: none;
            flex-direction: column;
            align-items: stretch;
            width: 100%;
            gap: 0;
        }

        .links-menu.aberto {
            display: flex;
        }

        .links-menu a {
            padding: 12px 4px;
            border-top: 1px solid #1e3a5f;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        html {
            scroll-behavior: auto;
        }
    }
`;

document.head.appendChild(estiloMenu);

const botaoMenu = menu.querySelector(".menu-toggle");
const linksMenu = menu.querySelector(".links-menu");

botaoMenu.addEventListener("click", () => {
    const aberto = linksMenu.classList.toggle("aberto");

    botaoMenu.setAttribute("aria-expanded", aberto);
    botaoMenu.setAttribute(
        "aria-label",
        aberto ? "Fechar menu" : "Abrir menu"
    );

    botaoMenu.textContent = aberto ? "✕" : "☰";
});

linksMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        linksMenu.classList.remove("aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");
        botaoMenu.textContent = "☰";
    });
});

const linksNavegacao = linksMenu.querySelectorAll("a");

const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            linksNavegacao.forEach((link) => {
                const selecionado =
                    link.getAttribute("href") ===
                    "#" + entrada.target.id;

                link.classList.toggle("ativo", selecionado);
            });
        }
    });
}, {
    rootMargin: "-20% 0px -65% 0px"
});

document.querySelectorAll(
    "#definicao, #carreiras, #golpes, #senha-forte, #quiz-final"
).forEach((secao) => {
    observador.observe(secao);
});

/* ===== BOTÃO VOLTAR AO TOPO ===== */

const voltarTopo = document.createElement("button");

voltarTopo.id = "voltar-topo";
voltarTopo.textContent = "↑ Voltar ao topo";
voltarTopo.setAttribute("aria-label", "Voltar ao topo da página");

document.body.appendChild(voltarTopo);

const estiloTopo = document.createElement("style");

estiloTopo.textContent = `
    #voltar-topo {
        position: fixed;
        right: 22px;
        bottom: 22px;
        z-index: 2000;

        background: transparent;
        color: #00ffdd;
        border: 1px solid #00ffdd;
        border-radius: 8px;
        padding: 12px 18px;

        font-size: 0.95rem;
        font-weight: 700;
        cursor: pointer;

        opacity: 0;
        visibility: hidden;
        transition: all 0.25s ease;
    }

    #voltar-topo:hover {
        background: #0b132b;
        color: #00ffdd;
        transform: translateY(-3px);
    }

    #voltar-topo.visivel {
        opacity: 1;
        visibility: visible;
    }
`;

document.head.appendChild(estiloTopo);

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        voltarTopo.classList.add("visivel");
    } else {
        voltarTopo.classList.remove("visivel");
    }
});

voltarTopo.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/* ===== INTERAÇÃO DAS TAGS DE CIBERSEGURANÇA ===== */

document.querySelectorAll(".tags li[data-info]").forEach((tag) => {
    let explicacao = null;

    function fecharExplicacao() {
        if (explicacao) {
            explicacao.remove();
            explicacao = null;
            tag.setAttribute("aria-expanded", "false");
        }
    }

    function abrirExplicacao() {
        if (explicacao) {
            fecharExplicacao();
            return;
        }

        explicacao = document.createElement("span");
        explicacao.className = "tag-explicacao";
        explicacao.textContent = tag.dataset.info;

        tag.appendChild(explicacao);
        tag.setAttribute("aria-expanded", "true");
    }

    tag.addEventListener("click", abrirExplicacao);

    tag.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            abrirExplicacao();
        }

        if (evento.key === "Escape") {
            fecharExplicacao();
        }
    });

    tag.addEventListener("mouseleave", () => {
        fecharExplicacao();
    });

    tag.addEventListener("focusout", () => {
        fecharExplicacao();
    });
});


/* ===== ESTILO DAS EXPLICAÇÕES ===== */

const estiloTags = document.createElement("style");

estiloTags.textContent = `
    .tags li[data-info] {
        position: relative;
        cursor: pointer;
        transition: border-color 0.2s ease,
                    color 0.2s ease,
                    background 0.2s ease;
    }

    .tags li[data-info]:hover,
    .tags li[data-info]:focus-visible,
    .tags li[data-info][aria-expanded="true"] {
        border-color: #00ffdd;
        color: #00ffdd;
        outline: none;
    }

    .tag-explicacao {
        display: block;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid #1e3a5f;
        color: #cbd5e1;
        font-size: 0.8rem;
        font-weight: 400;
        line-height: 1.5;
        white-space: normal;
        animation: aparecerTag 0.2s ease;
    }

    @keyframes aparecerTag {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(estiloTags);

/* ===== VERIFICADOR DE SENHAS ===== */

const campoSenha = document.querySelector("#senha-teste");
const botaoMostrar = document.querySelector("#mostrar-senha");
const botaoLimpar = document.querySelector("#limpar-senha");

const nivelSenha = document.querySelector("#nivel-senha");
const mensagemSenha = document.querySelector("#mensagem-senha");
const progressoSenha = document.querySelector("#progresso-senha");
const preenchimentoSenha = document.querySelector("#preenchimento-senha");

const criterios = [
    {
        id: "criterio-tamanho",
        verificar: senha => senha.length >= 12
    },
    {
        id: "criterio-maiuscula",
        verificar: senha => /[A-Z]/.test(senha)
    },
    {
        id: "criterio-minuscula",
        verificar: senha => /[a-z]/.test(senha)
    },
    {
        id: "criterio-numero",
        verificar: senha => /[0-9]/.test(senha)
    },
    {
        id: "criterio-simbolo",
        verificar: senha => /[^A-Za-z0-9]/.test(senha)
    }
];

function verificarSenha() {
    const senha = campoSenha.value;

    if (senha.length === 0) {
        nivelSenha.textContent = "Aguardando teste";
        mensagemSenha.textContent =
            "Digite uma senha fictícia para começar.";

        preenchimentoSenha.style.width = "0%";
        preenchimentoSenha.style.backgroundColor = "#ef4444";

        progressoSenha.setAttribute("aria-valuenow", "0");

        criterios.forEach(criterio => {
            const item = document.getElementById(criterio.id);

            item.classList.remove("atendido");
            item.querySelector("span").textContent = "○";
        });

        return;
    }

    let pontos = 0;

    criterios.forEach(criterio => {
        const item = document.getElementById(criterio.id);
        const atendido = criterio.verificar(senha);
        const simbolo = item.querySelector("span");

        if (atendido) {
            pontos++;
            item.classList.add("atendido");
            simbolo.textContent = "✓";
        } else {
            item.classList.remove("atendido");
            simbolo.textContent = "○";
        }
    });

    preenchimentoSenha.style.width = `${pontos * 20}%`;

    progressoSenha.setAttribute("aria-valuenow", String(pontos));

    let nivel;
    let mensagem;
    let cor;

    if (pontos <= 1) {
        nivel = "Muito fraca";
        mensagem = "A senha atende a poucos critérios. Tente torná-la mais longa e menos previsível.";
        cor = "#ef4444";
    } else if (pontos === 2) {
        nivel = "Fraca";
        mensagem = "Ainda faltam critérios importantes para melhorar a senha.";
        cor = "#f97316";
    } else if (pontos === 3) {
        nivel = "Razoável";
        mensagem = "Você já atende a alguns critérios, mas ainda pode melhorar.";
        cor = "#eab308";
    } else if (pontos === 4) {
        nivel = "Boa";
        mensagem = "A senha atende a quase todos os critérios desta demonstração.";
        cor = "#22c55e";
    } else {
        nivel = "Todos os critérios atendidos";
        mensagem = "Ótimo! Lembre-se: cumprir estes critérios não garante que uma senha seja impossível de adivinhar.";
        cor = "#00ffdd";
    }

    nivelSenha.textContent = nivel;
    mensagemSenha.textContent = mensagem;
    preenchimentoSenha.style.backgroundColor = cor;
}

botaoMostrar.addEventListener("click", () => {
    const estaOculta = campoSenha.type === "password";

    campoSenha.type = estaOculta ? "text" : "password";
    botaoMostrar.textContent = estaOculta ? "Ocultar" : "Mostrar";

    botaoMostrar.setAttribute(
        "aria-pressed",
        String(estaOculta)
    );
});

campoSenha.addEventListener("input", verificarSenha);

botaoLimpar.addEventListener("click", () => {
    campoSenha.value = "";
    campoSenha.type = "password";

    botaoMostrar.textContent = "Mostrar";
    botaoMostrar.setAttribute("aria-pressed", "false");

    verificarSenha();
    campoSenha.focus();
});

/* ===== DEMONSTRACAO DE PHISHING ===== */

const areaPhishing = document.querySelector("#demonstracao-phishing");

if (areaPhishing) {
    const exemplosPhishing = [
        {
            assunto: "Problema com seu pagamento",
            remetente: "Netflix — Central de cobrança",
            mensagem: "Detectamos um problema no seu pagamento. Sua conta será suspensa hoje. Confirme seus dados imediatamente para continuar assistindo.",
            link: "netflix-pagamento.example",
            resposta: "golpe",
            explicacao: "A mensagem cria urgência, ameaça suspender a conta e pede que você resolva o problema por um link suspeito. O domínio exibido não é um endereço oficial da Netflix. Não clique nem informe dados."
        },
        {
            assunto: "Uma novidade para você",
            remetente: "Remetente não verificado",
            mensagem: "Tem novidade no seu catálogo! Abra o aplicativo oficial da Netflix para conferir os lançamentos disponíveis.",
            link: "",
            resposta: "sem-sinais",
            explicacao: "O texto não apresenta uma ameaça, não exige dados e orienta a pessoa a abrir o aplicativo oficial. Isso não prova quem enviou a mensagem, mas não há sinais claros de phishing no conteúdo apresentado."
        },
        {
            assunto: "Sua conta será bloqueada",
            remetente: "Netflix — Atendimento",
            mensagem: "Sua assinatura está em risco. Para evitar o bloqueio, atualize seu cadastro pelo link abaixo.",
            link: "atualizacao-netflix.example",
            resposta: "golpe",
            explicacao: "A ameaça de bloqueio e a solicitação para atualizar o cadastro por um link são sinais de alerta. O nome do remetente pode ser falsificado. Verifique sua conta diretamente no aplicativo ou digitando o endereço oficial."
        },
        {
            assunto: "Aviso sobre sua assinatura",
            remetente: "Nome exibido: Netflix",
            mensagem: "Recebemos uma solicitação relacionada à sua assinatura. Se você não reconhece essa atividade, confira sua conta pelo aplicativo oficial.",
            link: "",
            resposta: "incerto",
            explicacao: "O texto, sozinho, não permite confirmar se a mensagem é verdadeira. O nome exibido pode ser falsificado. Não responda nem use links recebidos: abra o aplicativo oficial por conta própria para verificar."
        }
    ];

    let indiceAtual = 0;
    let pontuacao = 0;
    let respondido = false;

    areaPhishing.innerHTML = `
        <div class="phishing-container">
            <h2>Você consegue identificar um golpe?</h2>

            <p class="phishing-intro">
                Analise cada mensagem fictícia inspirada em situações
                de phishing. Escolha a opção que melhor representa
                sua avaliação e descubra os sinais de alerta.
            </p>

            <p id="phishing-contador" aria-live="polite"></p>

            <div class="phishing-email">
                <div class="phishing-email-topo">
                    <span class="phishing-logo">NETFLIX</span>
                    <span class="phishing-etiqueta">
                        SIMULAÇÃO EDUCATIVA
                    </span>
                </div>

                <p><strong>Remetente:</strong>
                    <span id="phishing-remetente"></span>
                </p>

                <div class="phishing-assunto"
                    id="phishing-assunto"></div>

                <p class="phishing-mensagem"
                    id="phishing-mensagem"></p>

                <div id="phishing-link"
                    class="phishing-link-falso"
                    hidden></div>
            </div>

            <p><strong>Qual é a sua avaliação?</strong></p>

            <div class="phishing-opcoes">
                <button type="button" data-resposta="golpe">
                    É golpe
                </button>

                <button type="button" data-resposta="sem-sinais">
                    Não há sinais claros de golpe
                </button>

                <button type="button" data-resposta="incerto">
                    Não tenho certeza
                </button>
            </div>

            <div id="phishing-feedback"
                class="phishing-feedback"
                aria-live="polite"
                hidden>
                <h3 id="phishing-resultado"></h3>
                <p id="phishing-explicacao"></p>
            </div>

            <div class="phishing-rodape">
                <span id="phishing-pontuacao"
                    class="phishing-pontuacao">
                    Pontuação: 0
                </span>

                <button type="button"
                    id="phishing-proximo"
                    class="phishing-proximo"
                    disabled>
                    Próxima mensagem
                </button>
            </div>

            <p class="phishing-aviso">
                Esta é uma simulação fictícia. Nenhum dado é enviado
                ou armazenado. Na vida real, não é possível confirmar
                a legitimidade de uma mensagem apenas pela aparência.
                Verifique sempre sua conta pelo aplicativo ou site
                oficial acessado diretamente.
            </p>
        </div>
    `;

    const contadorPhishing =
        areaPhishing.querySelector("#phishing-contador");
    const remetentePhishing =
        areaPhishing.querySelector("#phishing-remetente");
    const assuntoPhishing =
        areaPhishing.querySelector("#phishing-assunto");
    const mensagemPhishing =
        areaPhishing.querySelector("#phishing-mensagem");
    const linkPhishing =
        areaPhishing.querySelector("#phishing-link");
    const feedbackPhishing =
        areaPhishing.querySelector("#phishing-feedback");
    const resultadoPhishing =
        areaPhishing.querySelector("#phishing-resultado");
    const explicacaoPhishing =
        areaPhishing.querySelector("#phishing-explicacao");
    const pontuacaoPhishing =
        areaPhishing.querySelector("#phishing-pontuacao");
    const botaoProximoPhishing =
        areaPhishing.querySelector("#phishing-proximo");
    const botoesResposta =
        areaPhishing.querySelectorAll("[data-resposta]");

    function mostrarExemplo() {
        const exemplo = exemplosPhishing[indiceAtual];

        respondido = false;

        contadorPhishing.textContent =
            `Mensagem ${indiceAtual + 1} de ${exemplosPhishing.length}`;

        remetentePhishing.textContent = exemplo.remetente;
        assuntoPhishing.textContent = exemplo.assunto;
        mensagemPhishing.textContent = exemplo.mensagem;

        linkPhishing.hidden = !exemplo.link;
        linkPhishing.textContent = exemplo.link
            ? `Link apresentado: ${exemplo.link}`
            : "";

        feedbackPhishing.hidden = true;
        botaoProximoPhishing.disabled = true;
        botaoProximoPhishing.textContent =
            indiceAtual === exemplosPhishing.length - 1
                ? "Ver resultado final"
                : "Próxima mensagem";

        botoesResposta.forEach(botao => {
            botao.disabled = false;
        });
    }

    function responderPhishing(respostaEscolhida) {
        if (respondido) return;

        respondido = true;

        const exemplo = exemplosPhishing[indiceAtual];
        const acertou = respostaEscolhida === exemplo.resposta;

        if (acertou) {
            pontuacao++;
        }

        resultadoPhishing.textContent = acertou
            ? "Boa análise!"
            : "Vamos aprender com esta mensagem";

        explicacaoPhishing.textContent = exemplo.explicacao;

        feedbackPhishing.hidden = false;
        pontuacaoPhishing.textContent =
            `Pontuação: ${pontuacao} de ${indiceAtual + 1}`;

        botoesResposta.forEach(botao => {
            botao.disabled = true;
        });

        botaoProximoPhishing.disabled = false;
    }

    botoesResposta.forEach(botao => {
        botao.addEventListener("click", () => {
            responderPhishing(botao.dataset.resposta);
        });
    });

    botaoProximoPhishing.addEventListener("click", () => {
        if (!respondido) return;

        if (indiceAtual < exemplosPhishing.length - 1) {
            indiceAtual++;
            mostrarExemplo();
            return;
        }

        areaPhishing.innerHTML = `
            <div class="phishing-container">
                <h2>Simulação concluída!</h2>

                <p>Você acertou ${pontuacao} de
                    ${exemplosPhishing.length} mensagens.</p>

                <p>
                    ${pontuacao === exemplosPhishing.length
                        ? "Excelente análise! Continue desconfiando de mensagens inesperadas e verificando as informações por canais oficiais."
                        : "Continue praticando! Observe a urgência, os pedidos de dados e os links. Quando não tiver certeza, verifique pelo aplicativo ou site oficial."}
                </p>

                <button type="button"
                    id="phishing-reiniciar"
                    class="phishing-proximo">
                    Tentar novamente
                </button>
            </div>
        `;

        areaPhishing
            .querySelector("#phishing-reiniciar")
            .addEventListener("click", () => {
                indiceAtual = 0;
                pontuacao = 0;
                mostrarInterfaceInicial();
            });
    });

    function mostrarInterfaceInicial() {
        location.reload();
    }

    mostrarExemplo();
}