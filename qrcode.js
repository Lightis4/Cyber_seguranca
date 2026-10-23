
const qrSite = document.getElementById("qr-site");

const qrPersonalizado =
    document.getElementById("qr-personalizado");

const linkSite =
    document.getElementById("link-site");

const inputUrl =
    document.getElementById("url-personalizada");

const btnGerar =
    document.getElementById("btn-gerar");

const btnBaixarSite =
    document.getElementById("btn-baixar-site");

const btnBaixarPersonalizado =
    document.getElementById("btn-baixar-personalizado");

const mensagemQR =
    document.getElementById("mensagem-qr");

// Substitua pelo endereço público do seu projeto.
const URL_SITE =
    "https://lightis4.github.io/CyberSeguranca2.0/cyber.html";

function gerarQRCode(elemento, texto) {
    elemento.innerHTML = "";

    if (typeof QRCode === "undefined") {
        throw new Error(
            "A biblioteca QRCode.js não foi carregada."
        );
    }

    new QRCode(elemento, {
        text: texto,
        width: 220,
        height: 220,
        colorDark: "#07131f",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

function baixarQRCode(elemento, nomeArquivo) {
    const imagem = elemento.querySelector("img");
    const canvas = elemento.querySelector("canvas");

    let enderecoImagem = "";

    if (canvas) {
        enderecoImagem = canvas.toDataURL("image/png");
    } else if (imagem) {
        enderecoImagem = imagem.src;
    }

    if (!enderecoImagem) {
        alert("Não foi possível encontrar o QR Code.");
        return;
    }

    const link = document.createElement("a");

    link.href = enderecoImagem;
    link.download = nomeArquivo;

    document.body.appendChild(link);
    link.click();
    link.remove();
}

function gerarQRCodePersonalizado() {
    const texto = inputUrl.value.trim();

    if (!texto) {
        mensagemQR.textContent =
            "Digite um endereço para gerar o QR Code.";
        return;
    }

    let url;

    try {
        url = new URL(texto);

        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("Protocolo inválido");
        }
    } catch {
        mensagemQR.textContent =
            "Digite uma URL válida começando com https://";
        return;
    }

    try {
        gerarQRCode(qrPersonalizado, url.href);

        mensagemQR.textContent =
            "QR Code gerado com sucesso!";

        btnBaixarPersonalizado.classList.remove("oculto");
    } catch (erro) {
        mensagemQR.textContent = erro.message;
    }
}

function iniciarQRCode() {
    try {
        gerarQRCode(qrSite, URL_SITE);
        linkSite.textContent = URL_SITE;
    } catch (erro) {
        mensagemQR.textContent = erro.message;
    }
}

btnGerar.addEventListener(
    "click",
    gerarQRCodePersonalizado
);

btnBaixarSite.addEventListener("click", () => {
    baixarQRCode(qrSite, "qrcode-cyber-seguranca.png");
});

btnBaixarPersonalizado.addEventListener("click", () => {
    baixarQRCode(
        qrPersonalizado,
        "qrcode-personalizado.png"
    );
});

iniciarQRCode();
