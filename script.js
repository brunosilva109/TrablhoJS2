const bird = document.getElementById("bird");
const pipe1 = document.getElementById("pipe1");
const pipe2 = document.getElementById("pipe2");
const scoreDisplay = document.getElementById("score");

let birdY = 250;
let velocity = 0;
const gravity = 0.3;
const lift = -7;
let isGameOver = false;
let isGameStarted = false;
const alturaMaxima = window.innerHeight;
const alturaDoBird = 50;
const gap = alturaDoBird * 2.5;
const pipeWidth = 60;
let pipe1Pos = 400;
let pipe2Pos = 400;
let score = 0; // Inicializa a pontuação
let bestScore = localStorage.getItem("bestScore") || 0; // Recupera a melhor pontuação do localStorage

// Função para pular
function jump() {
    if (isGameOver || !isGameStarted) return;
    velocity = lift;
}

// Função para a queda
function fall() {
    if (!isGameOver && isGameStarted) {
        velocity += gravity;
        birdY += velocity;

        // Limites do pássaro
        if (birdY < 0) birdY = 0;
        if (birdY > 560) {
            birdY = 560;
            endGame();
        }

        bird.style.top = birdY + "px";
        checkCollision();
        requestAnimationFrame(fall);
    }
}

// Função para verificar colisão
function checkCollision() {
    const birdRect = bird.getBoundingClientRect();
    const pipe1Rect = pipe1.getBoundingClientRect();
    const pipe2Rect = pipe2.getBoundingClientRect();

    if (
        (birdRect.right > pipe2Rect.left && birdRect.left < pipe2Rect.right - 10 &&
         birdRect.bottom > pipe2Rect.top + 10) ||
        (birdRect.right > pipe1Rect.left && birdRect.left < pipe1Rect.right - 10 &&
         birdRect.top < pipe1Rect.bottom - 10)
    ) {
        endGame();
    }
}

// Função para gerar a altura dos canos
function gerarAlturaCano() {
    return Math.random() * (580 - 175);
}

// Função para mover os canos
function movePipes() {
    const pipeSpeed = 3;

    function animatePipes() {
        if (!isGameOver && isGameStarted) {
            pipe1Pos -= pipeSpeed;
            pipe2Pos -= pipeSpeed;

            // Reinicia a posição dos canos e ajusta as alturas
            if (pipe2Pos < -pipeWidth) {
                pipe2Pos = 400;
                pipe1Pos = 400;
                const pipe2Height = gerarAlturaCano();
                pipe2.style.top = (pipe2Height + 75) + 'px';
                pipe1.style.top = (pipe2Height - 675) + 'px';
                score++;
                updateScore();
            }

            pipe1.style.left = pipe1Pos + 'px';
            pipe2.style.left = pipe2Pos + 'px';

            requestAnimationFrame(animatePipes);
        }
    }

    animatePipes();
}

// Função de fim de jogo
function endGame() {
    isGameOver = true;
    
    // Atualiza a melhor pontuação
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
    }

    // Exibe a tela de Game Over
    showGameOverScreen();
}

// Função para exibir a tela de Game Over
function showGameOverScreen() {
    const gameOverScreen = document.createElement("div");
    gameOverScreen.id = "gameOverScreen";
    gameOverScreen.style.position = "absolute";
    gameOverScreen.style.top = "0";
    gameOverScreen.style.left = "0";
    gameOverScreen.style.width = "100%";
    gameOverScreen.style.height = "75%";
    gameOverScreen.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    gameOverScreen.style.color = "white";
    gameOverScreen.style.textAlign = "center";
    gameOverScreen.style.paddingTop = "200px";
    gameOverScreen.style.fontSize = "30px";
    gameOverScreen.innerHTML = `
        <p>GAME OVER</p>
        <p>Pontuação: ${score}</p>
        <p>Melhor Pontuação: ${bestScore}</p>
        <button onclick="restartGame()">Reiniciar</button>
    `;

    document.body.appendChild(gameOverScreen);
}

// Função para reiniciar o jogo
function restartGame() {
    location.reload();
}

// Função para atualizar a pontuação na tela
function updateScore() {
    scoreDisplay.textContent = "Pontuação: " + score;
}

// Função para mostrar a tela inicial
function showStartScreen() {
    const startScreen = document.createElement("div");
    startScreen.id = "startScreen";
    startScreen.style.position = "absolute";
    startScreen.style.top = "0";
    startScreen.style.left = "0";
    startScreen.style.width = "100%";
    startScreen.style.height = "75%";
    startScreen.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    startScreen.style.color = "white";
    startScreen.style.textAlign = "center";
    startScreen.style.paddingTop = "200px";
    startScreen.style.fontSize = "30px";
    startScreen.innerHTML = `
        <p>Bem-vindo ao Jogo do Pássaro!</p>
        <p>Pressione "Espaço" ou </p>
        <p>clique para começar.</p>
        <button onclick="startGame()">Iniciar Jogo</button>
    `;
    
    document.body.appendChild(startScreen);
}

// Função para iniciar o jogo
function startGame() {
    if (isGameStarted) return; // Não permite iniciar o jogo duas vezes
    isGameStarted = true;
    document.getElementById("startScreen").remove(); // Remove a tela inicial
    fall(); // Começa a queda do pássaro
    movePipes(); // Começa o movimento dos canos
}

// Adiciona o evento de pular
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        jump();
        if (!isGameStarted) startGame();
    }
});
document.addEventListener("click", () => {
    jump();
    if (!isGameStarted) startGame();
});

// Exibe a tela inicial quando o script for carregado
if (!isGameStarted) {
    showStartScreen();
}
