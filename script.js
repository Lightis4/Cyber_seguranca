
"use strict";

/* =====================================================
   CYBER SEGURANÇA - INTERAÇÕES DA PÁGINA PRINCIPAL
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ================================================
       1. MENU RESPONSIVO
       ================================================ */

    const menu = document.createElement("nav");

    menu.id = "menu-navegacao";
    menu.setAttribute("aria-label", "Menu principal");

    menu.innerHTML = `
        <a href="cyber.html" class="logo-menu">
            CYBER<span>SECURITY</span>
        </a>

        <button
            type="button"
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
            <a href="#quiz-final">Sobre o quiz</a>
            <a href="quiz.html" class="botao-quiz">Jogar Quiz</a>
            <a href="ranking.html">Ranking</a>
            <a href="qrcode.html">QR Code</a>
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
            gap: 20px;
            padding: 16px 5%;
            background: #0b132b;
            border-bottom: 1px solid #1e3a5f;
            box-shadow: 0 4px 18px rgba(0,0,0,.2);
        }

        .logo-menu {
            color: white;
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
            flex-wrap: wrap;
            gap: 8px;
        }

        .links-menu a {
            color: #cbd5e1;
            text-decoration: none;
            font-size: .9rem;
            padding: 9px 12px;
            border: 1px solid transparent;
            border-radius: 8px;
            transition: .2s ease;
        }

        .links-menu a:hover,
        .links-menu a.ativo {
            color: #00ffdd;
            background: rgba(0,255,221,.08);
            border-color: #00ffdd;
        }

        .links-menu a.botao-quiz {
            color: #0b132b;
            background: #00ffdd;
            border: 1px solid #00ffdd;
            font-weight: 700;
        }

        .links-menu a.botao-quiz:hover {
            color: #00ffdd;
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

        @media (max-width: 1050px) {
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
                padding: 12px;
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

    function fecharMenu() {
        linksMenu.classList.remove("aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");
        botaoMenu.textContent = "☰";
    }

    botaoMenu.addEventListener("click", () => {
        const aberto = linksMenu.classList.toggle("aberto");

        botaoMenu.setAttribute("aria-expanded", String(aberto));
        botaoMenu.setAttribute(
            "aria-label",
            aberto ? "Fechar menu" : "Abrir menu"
        );

        botaoMenu.textContent = aberto ? "✕" : "☰";
    });

    linksMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", fecharMenu);
    });

    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape") {
            fecharMenu();
        }
    });

    /* ================================================
       2. DESTACAR SEÇÃO ATIVA
       ================================================ */

    const secoes = document.querySelectorAll(
        "#definicao, #carreiras, #golpes, #senha-forte, #quiz-final"
    );

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(entradas => {
            entradas.forEach(entrada => {
                if (!entrada.isIntersecting) return;

                linksMenu.querySelectorAll('a[href^="#"]').forEach(link => {
                    const ativo =
                        link.getAttribute("href") ===
                        "#" + entrada.target.id;

                    link.classList.toggle("ativo", ativo);
                });
            });
        }, {
            rootMargin: "-20% 0px -65% 0px"
        });

        secoes.forEach(secao => observador.observe(secao));
    }

    /* ================================================
       3. BOTÃO VOLTAR AO TOPO
       ================================================ */

    const voltarTopo = document.createElement("button");

    voltarTopo.type = "button";
    voltarTopo.id = "voltar-topo";
    voltarTopo.textContent = "↑ Voltar ao topo";
    voltarTopo.setAttribute(
        "aria-label",
        "Voltar ao topo da página"
    );

    document.body.appendChild(voltarTopo);

    const estiloTopo = document.createElement("style");

    estiloTopo.textContent = `
        #voltar-topo {
            position: fixed;
            right: 22px;
            bottom: 22px;
            z-index: 2000;
            background: #0b132b;
            color: #00ffdd;
            border: 1px solid #00ffdd;
            border-radius: 8px;
            padding: 12px 18px;
            font-size: .95rem;
            font-weight: 700;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: opacity .25s ease,
                        visibility .25s ease,
                        transform .25s ease;
        }

        #voltar-topo:hover {
            transform: translateY(-3px);
        }

        #voltar-topo.visivel {
            opacity: 1;
            visibility: visible;
        }
    `;

    document.head.appendChild(estiloTopo);

    function atualizarBotaoTopo() {
        voltarTopo.classList.toggle(
            "visivel",
            window.scrollY > 300
        );
    }

    window.addEventListener("scroll", atualizarBotaoTopo, {
        passive: true
    });

    atualizarBotaoTopo();

    voltarTopo.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth"
        });
    });

    /* ================================================
       4. ÁREAS INTERATIVAS DE CIBERSEGURANÇA
       ================================================ */

    const tags = document.querySelectorAll(
        ".tags li[data-info]"
    );

    const estiloTags = document.createElement("style");

    estiloTags.textContent = `
        .tags li[data-info] {
            position: relative;
            cursor: pointer;
            transition: .2s ease;
        }

        .tags li[data-info]:hover,
        .tags li[data-info]:focus-visible,
        .tags li[data-info][aria-expanded="true"] {
            border-color: #00ffdd;
            color: #00ffdd;
        }

        .tag-explicacao {
            display: block;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #1e3a5f;
            color: #cbd5e1;
            font-size: .85rem;
            font-weight: 400;
            line-height: 1.5;
            white-space: normal;
        }
    `;

    document.head.appendChild(estiloTags);

    tags.forEach(tag => {
        let explicacao = null;

        function fecharExplicacao() {
            if (!explicacao) return;

            explicacao.remove();
            explicacao = null;
            tag.setAttribute("aria-expanded", "false");
        }

        function alternarExplicacao() {
            if (explicacao) {
                fecharExplicacao();
                return;
            }

            explicacao = document.createElement("span");
            explicacao.className = "tag-explicacao";
            explicacao.textContent = tag.dataset.info || "";

            tag.appendChild(explicacao);
            tag.setAttribute("aria-expanded", "true");
        }

        tag.addEventListener("click", alternarExplicacao);

        tag.addEventListener("keydown", evento => {
            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {
                evento.preventDefault();
                alternarExplicacao();
            }

            if (evento.key === "Escape") {
                fecharExplicacao();
            }
        });

        tag.addEventListener("mouseleave", fecharExplicacao);

        tag.addEventListener("focusout", evento => {
            if (!tag.contains(evento.relatedTarget)) {
                fecharExplicacao();
            }
        });
    });

    /* ================================================
       5. VERIFICADOR EDUCATIVO DE SENHAS
       ================================================ */

    const campoSenha = document.getElementById("senha-teste");
    const botaoMostrar = document.getElementById("mostrar-senha");
    const botaoLimpar = document.getElementById("limpar-senha");

    const nivelSenha = document.getElementById("nivel-senha");
    const mensagemSenha = document.getElementById("mensagem-senha");

    const progressoSenha = document.getElementById(
        "progresso-senha"
    );

    const preenchimentoSenha = document.getElementById(
        "preenchimento-senha"
    );

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

    if (
        campoSenha &&
        botaoMostrar &&
        botaoLimpar &&
        nivelSenha &&
        mensagemSenha &&
        progressoSenha &&
        preenchimentoSenha
    ) {

        function verificarSenha() {
            const senha = campoSenha.value;
            let pontos = 0;

            criterios.forEach(criterio => {
                const item = document.getElementById(
                    criterio.id
                );

                if (!item) return;

                const simbolo = item.querySelector("span");
                const atendido =
                    senha.length > 0 &&
                    criterio.verificar(senha);

                if (atendido) pontos++;

                item.classList.toggle(
                    "atendido",
                    atendido
                );

                if (simbolo) {
                    simbolo.textContent = atendido
                        ? "✓"
                        : "○";
                }
            });

            progressoSenha.setAttribute(
                "aria-valuenow",
                String(pontos)
            );

            preenchimentoSenha.style.width =
                `${pontos * 20}%`;

            if (!senha) {
                nivelSenha.textContent =
                    "Aguardando teste";

                mensagemSenha.textContent =
                    "Digite uma senha fictícia para começar.";

                preenchimentoSenha.style.backgroundColor =
                    "#ef4444";

                return;
            }

            let nivel = "";
            let mensagem = "";
            let cor = "";

            if (pontos <= 1) {
                nivel = "Muito fraca";
                mensagem =
                    "A senha atende a poucos critérios. " +
                    "Tente torná-la mais longa e menos previsível.";
                cor = "#ef4444";

            } else if (pontos === 2) {
                nivel = "Fraca";
                mensagem =
                    "Ainda faltam critérios importantes " +
                    "para melhorar sua senha.";
                cor = "#f97316";

            } else if (pontos === 3) {
                nivel = "Razoável";
                mensagem =
                    "Você atende a alguns critérios, " +
                    "mas ainda pode melhorar.";
                cor = "#eab308";

            } else if (pontos === 4) {
                nivel = "Boa";
                mensagem =
                    "A senha atende a quase todos os " +
                    "critérios desta demonstração.";
                cor = "#22c55e";

            } else {
                nivel = "Todos os critérios atendidos";
                mensagem =
                    "Ótimo! Mas isso não garante que a " +
                    "senha seja impossível de adivinhar.";
                cor = "#00ffdd";
            }

            nivelSenha.textContent = nivel;
            mensagemSenha.textContent = mensagem;

            preenchimentoSenha.style.backgroundColor = cor;
        }

        botaoMostrar.addEventListener("click", () => {
            const oculta = campoSenha.type === "password";

            campoSenha.type = oculta
                ? "text"
                : "password";

            botaoMostrar.textContent = oculta
                ? "Ocultar"
                : "Mostrar";

            botaoMostrar.setAttribute(
                "aria-pressed",
                String(oculta)
            );
        });

        campoSenha.addEventListener(
            "input",
            verificarSenha
        );

        botaoLimpar.addEventListener("click", () => {
            campoSenha.value = "";
            campoSenha.type = "password";

            botaoMostrar.textContent = "Mostrar";
            botaoMostrar.setAttribute(
                "aria-pressed",
                "false"
            );

            verificarSenha();
            campoSenha.focus();
        });

        verificarSenha();
    }

    /* ================================================
       6. SIMULAÇÃO EDUCATIVA DE PHISHING
       ================================================ */

    const areaPhishing = document.getElementById(
        "demonstracao-phishing"
    );

    if (areaPhishing) {

        const exemplosPhishing = [
            {
                assunto: "Problema com seu pagamento",
                remetente: "Netflix — Central de cobrança",
                mensagem:
                    "Detectamos um problema no seu pagamento. " +
                    "Sua conta será suspensa hoje. " +
                    "Confirme seus dados imediatamente " +
                    "para continuar assistindo.",
                link: "netflix-pagamento.example",
                resposta: "golpe",
                explicacao:
                    "A mensagem cria urgência, ameaça " +
                    "suspender a conta e solicita dados " +
                    "por um link suspeito. " +
                    "O domínio exibido não é oficial."
            },
            {
                assunto: "Uma novidade para você",
                remetente: "Remetente não verificado",
                mensagem:
                    "Tem novidade no seu catálogo! " +
                    "Abra o aplicativo oficial da Netflix " +
                    "para conferir os lançamentos disponíveis.",
                link: "",
                resposta: "sem-sinais",
                explicacao:
                    "O texto não exige dados nem apresenta " +
                    "uma ameaça. Isso não confirma a " +
                    "autenticidade do remetente, mas " +
                    "não há sinais claros de phishing " +
                    "no conteúdo apresentado."
            },
            {
                assunto: "Sua conta será bloqueada",
                remetente: "Netflix — Atendimento",
                mensagem:
                    "Sua assinatura está em risco. " +
                    "Para evitar o bloqueio, atualize " +
                    "seu cadastro pelo link abaixo.",
                link: "atualizacao-netflix.example",
                resposta: "golpe",
                explicacao:
                    "A ameaça de bloqueio e o pedido " +
                    "de atualização por link são " +
                    "sinais de alerta. " +
                    "Verifique sua conta diretamente " +
                    "no aplicativo oficial."
            },
            {
                assunto: "Aviso sobre sua assinatura",
                remetente: "Nome exibido: Netflix",
                mensagem:
                    "Recebemos uma solicitação relacionada " +
                    "à sua assinatura. Se você não " +
                    "reconhece essa atividade, confira " +
                    "sua conta pelo aplicativo oficial.",
                link: "",
                resposta: "incerto",
                explicacao:
                    "O conteúdo não permite confirmar " +
                    "se a mensagem é verdadeira. " +
                    "O nome do remetente pode ser " +
                    "falsificado. Verifique a informação " +
                    "diretamente pelo canal oficial."
            }
        ];

        let indiceAtual = 0;
        let pontuacao = 0;
        let respondido = false;

        function montarInterfacePhishing() {

            areaPhishing.innerHTML = `
                <div class="phishing-container">

                    <h2>
                        Você consegue identificar um golpe?
                    </h2>

                    <p class="phishing-intro">
                        Analise cada mensagem fictícia
                        e identifique os sinais de phishing.
                    </p>

                    <p
                        id="phishing-contador"
                        aria-live="polite"
                    ></p>

                    <div class="phishing-email">

                        <div class="phishing-email-topo">
                            <span class="phishing-logo">
                                NETFLIX
                            </span>

                            <span class="phishing-etiqueta">
                                SIMULAÇÃO EDUCATIVA
                            </span>
                        </div>

                        <p>
                            <strong>Remetente:</strong>
                            <span
                                id="phishing-remetente"
                            ></span>
                        </p>

                        <div
                            class="phishing-assunto"
                            id="phishing-assunto"
                        ></div>

                        <p
                            class="phishing-mensagem"
                            id="phishing-mensagem"
                        ></p>

                        <div
                            class="phishing-link-falso"
                            id="phishing-link"
                            hidden
                        ></div>

                    </div>

                    <p>
                        <strong>
                            Qual é a sua avaliação?
                        </strong>
                    </p>

                    <div class="phishing-opcoes">

                        <button
                            type="button"
                            data-resposta="golpe"
                        >
                            É golpe
                        </button>

                        <button
                            type="button"
                            data-resposta="sem-sinais"
                        >
                            Não há sinais claros de golpe
                        </button>

                        <button
                            type="button"
                            data-resposta="incerto"
                        >
                            Não tenho certeza
                        </button>

                    </div>

                    <div
                        class="phishing-feedback"
                        id="phishing-feedback"
                        aria-live="polite"
                        hidden
                    >
                        <h3
                            id="phishing-resultado"
                        ></h3>

                        <p
                            id="phishing-explicacao"
                        ></p>
                    </div>

                    <div class="phishing-rodape">

                        <span
                            class="phishing-pontuacao"
                            id="phishing-pontuacao"
                        >
                            Pontuação: 0
                        </span>

                        <button
                            type="button"
                            class="phishing-proximo"
                            id="phishing-proximo"
                            disabled
                        >
                            Próxima mensagem
                        </button>

                    </div>

                    <p class="phishing-aviso">
                        Esta é uma simulação educativa.
                        Não informe senhas reais.
                        Na vida real, confirme mensagens
                        diretamente no site ou aplicativo
                        oficial.
                    </p>

                </div>
            `;

            const contador = areaPhishing.querySelector(
                "#phishing-contador"
            );

            const remetente = areaPhishing.querySelector(
                "#phishing-remetente"
            );

            const assunto = areaPhishing.querySelector(
                "#phishing-assunto"
            );

            const mensagem = areaPhishing.querySelector(
                "#phishing-mensagem"
            );

            const link = areaPhishing.querySelector(
                "#phishing-link"
            );

            const feedback = areaPhishing.querySelector(
                "#phishing-feedback"
            );

            const resultado = areaPhishing.querySelector(
                "#phishing-resultado"
            );

            const explicacao = areaPhishing.querySelector(
                "#phishing-explicacao"
            );

            const placar = areaPhishing.querySelector(
                "#phishing-pontuacao"
            );

            const botaoProximo = areaPhishing.querySelector(
                "#phishing-proximo"
            );

            const botoesResposta = areaPhishing.querySelectorAll(
                "[data-resposta]"
            );

            function mostrarExemplo() {
                const exemplo = exemplosPhishing[indiceAtual];

                respondido = false;

                contador.textContent =
                    `Mensagem ${indiceAtual + 1} de ` +
                    exemplosPhishing.length;

                remetente.textContent = exemplo.remetente;
                assunto.textContent = exemplo.assunto;
                mensagem.textContent = exemplo.mensagem;

                link.hidden = !exemplo.link;

                link.textContent = exemplo.link
                    ? `Link apresentado: ${exemplo.link}`
                    : "";

                feedback.hidden = true;

                botaoProximo.disabled = true;

                botaoProximo.textContent =
                    indiceAtual === exemplosPhishing.length - 1
                        ? "Ver resultado final"
                        : "Próxima mensagem";

                botoesResposta.forEach(botao => {
                    botao.disabled = false;
                });

                placar.textContent =
                    `Pontuação: ${pontuacao}`;
            }

            function responder(respostaEscolhida) {
                if (respondido) return;

                respondido = true;

                const exemplo = exemplosPhishing[indiceAtual];

                const acertou =
                    respostaEscolhida === exemplo.resposta;

                if (acertou) {
                    pontuacao++;
                }

                resultado.textContent = acertou
                    ? "Boa análise!"
                    : "Vamos aprender com esta mensagem";

                explicacao.textContent = exemplo.explicacao;

                feedback.hidden = false;

                placar.textContent =
                    `Pontuação: ${pontuacao} de ` +
                    `${indiceAtual + 1}`;

                botoesResposta.forEach(botao => {
                    botao.disabled = true;
                });

                botaoProximo.disabled = false;
            }

            botoesResposta.forEach(botao => {
                botao.addEventListener("click", () => {
                    responder(botao.dataset.resposta);
                });
            });

            botaoProximo.addEventListener("click", () => {
                if (!respondido) return;

                if (
                    indiceAtual <
                    exemplosPhishing.length - 1
                ) {
                    indiceAtual++;
                    mostrarExemplo();
                    return;
                }

                mostrarResultadoFinal();
            });

            mostrarExemplo();
        }

        function mostrarResultadoFinal() {
            areaPhishing.innerHTML = `
                <div class="phishing-container">

                    <h2>Simulação concluída!</h2>

                    <p>
                        Você acertou
                        <strong>${pontuacao}</strong>
                        de
                        <strong>${exemplosPhishing.length}</strong>
                        mensagens.
                    </p>

                    <p>
                        ${
                            pontuacao === exemplosPhishing.length
                                ? "Excelente análise! Continue verificando mensagens por canais oficiais."
                                : "Continue praticando! Observe pedidos de dados, links e mensagens urgentes."
                        }
                    </p>

                    <button
                        type="button"
                        id="phishing-reiniciar"
                        class="phishing-proximo"
                    >
                        Tentar novamente
                    </button>

                </div>
            `;

            const botaoReiniciar = areaPhishing.querySelector(
                "#phishing-reiniciar"
            );

            botaoReiniciar.addEventListener("click", () => {
                indiceAtual = 0;
                pontuacao = 0;
                respondido = false;

                montarInterfacePhishing();
            });
        }

        montarInterfacePhishing();
    }

    /* ================================================
       7. FINALIZAÇÃO
       ================================================ */

    console.log(
        "Cyber Segurança: interações carregadas com sucesso."
    );

});
