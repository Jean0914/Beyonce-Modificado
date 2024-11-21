const gameArea = document.getElementById("game-area");
const player = document.querySelector("#player");
const beyonce = document.querySelector("#beyonce");
const audio = document.getElementById("game-audio");
const pauseBtn = document.getElementById("pause-btn");
const startBtn = document.getElementById("start-btn");
const difficultySelect = document.getElementById("difficulty");
const backgroundColorInput = document.getElementById("background-color");
const playerCharacterSelect = document.getElementById("player-character");
const enemyCharacterSelect = document.getElementById("enemy-character");
const musicTrackSelect = document.getElementById("music-track");
const darkModeCheckbox = document.getElementById("dark-mode");

let playerSpeed = 35;
let beyonceSpeed = 2;
let isPlaying = false;
let isPaused = false;

let playerPosition = { x: 0, y: 0 };
// Ajustar la posición inicial de Beyoncé para evitar superposición
let beyoncePosition = { x: gameArea.clientWidth - 100, y: gameArea.clientHeight - 150 };

/**
 * Actualiza la posición visual de los elementos en pantalla.
 */
function updatePosition() {
    player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
    beyonce.style.transform = `translate(${beyoncePosition.x}px, ${beyoncePosition.y}px)`;
}

/**
 * Resetea los valores iniciales del juego.
 */
function resetGame() {
    playerPosition = { x: 0, y: 0 };
    // Nueva posición de Beyoncé, para asegurarse que no se superponga con el jugador
    beyoncePosition = { x: gameArea.clientWidth - 100, y: gameArea.clientHeight - 150 }; 
    updatePosition();
    audio.pause();
    audio.currentTime = 0; // Resetea la música al iniciar un nuevo juego.
    audio.play();  // Inicia la música al volver a jugar
}

/**
 * Ajusta la velocidad según la dificultad seleccionada.
 */
function adjustDifficulty() {
    const difficulty = parseInt(difficultySelect.value);
    playerSpeed = 35 - (difficulty - 1) * 5; // Disminuye la velocidad del jugador en dificultades más altas.

    // Cambia la velocidad de Beyoncé según la dificultad
    if (difficulty === 1) {
        beyonceSpeed = 1; // Fácil, más lento
    } else if (difficulty === 2) {
        beyonceSpeed = 2; // Normal, velocidad media
    } else if (difficulty === 3) {
        beyonceSpeed = 5; // Heroico, más rápido
    }
}

/**
 * Cambia la imagen del jugador.
 */
playerCharacterSelect.addEventListener("change", () => {
    const character = playerCharacterSelect.value;
    if (character.endsWith(".jpg") || character.endsWith(".png")) {
        player.style.backgroundImage = `url('${character}')`;
        player.style.backgroundColor = "transparent";
    } else {
        player.style.backgroundColor = character;
        player.style.backgroundImage = "none";
    }
});

/**
 * Cambia el personaje enemigo.
 */
enemyCharacterSelect.addEventListener("change", () => {
    const enemy = enemyCharacterSelect.value;
    beyonce.style.backgroundImage = `url('${enemy}')`;
});

/**
 * Cambia la pista de música.
 */
musicTrackSelect.addEventListener("change", () => {
    const track = musicTrackSelect.value;
    audio.src = track;
    if (isPlaying && !isPaused) {
        audio.play();
    }
});

/**
 * Cambia el color de fondo del área del juego.
 */
backgroundColorInput.addEventListener("input", (event) => {
    gameArea.style.backgroundColor = event.target.value; // Cambia el fondo de juego según el color seleccionado
});

/**
 * Activa o pausa el juego.
 */
pauseBtn.addEventListener("click", () => {
    if (!isPlaying) return; // Evita pausar si el juego no ha iniciado.
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Reanudar" : "Pausa";
    if (isPaused) {
        audio.pause();
    } else {
        audio.play();
        gameLoop();
    }
});

/**
 * Lógica del juego.
 */
function gameLoop() {
    if (isPaused || !isPlaying) return;

    moveBeyonce();
    requestAnimationFrame(gameLoop);
}

/**
 * Mueve a Beyoncé hacia el jugador.
 */
function moveBeyonce() {
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;
    const characterSize = 50;  // Tamaño del personaje (50px x 50px)

    // Movimiento de Beyoncé hacia el jugador con restricciones en el contenedor
    if (beyoncePosition.x < playerPosition.x && beyoncePosition.x < gameAreaWidth - characterSize) {
        beyoncePosition.x += beyonceSpeed;
    } else if (beyoncePosition.x > playerPosition.x && beyoncePosition.x > 0) {
        beyoncePosition.x -= beyonceSpeed;
    }

    if (beyoncePosition.y < playerPosition.y && beyoncePosition.y < gameAreaHeight - characterSize) {
        beyoncePosition.y += beyonceSpeed;
    } else if (beyoncePosition.y > playerPosition.y && beyoncePosition.y > 0) {
        beyoncePosition.y -= beyonceSpeed;
    }

    updatePosition();
    detectCollision();
}

/**
 * Detecta si Beyoncé alcanza al jugador.
 */
function detectCollision() {
    const deltaX = Math.abs(playerPosition.x - beyoncePosition.x);
    const deltaY = Math.abs(playerPosition.y - beyoncePosition.y);

    if (deltaX <= 50 && deltaY <= 50) {
        if (confirm("¡Te atraparon! ¿Quieres intentarlo de nuevo?")) {
            resetGame();
        } else {
            isPlaying = false;
            audio.pause();
        }
    }
}

/**
 * Mueve al jugador según las teclas presionadas.
 */
function movePlayer(event) {
    if (!isPlaying || isPaused) return;

    // Evita el comportamiento predeterminado del navegador (scroll del cursor)
    event.preventDefault();

    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;

    switch (event.key) {
        case "ArrowUp":
            if (playerPosition.y >= 25) playerPosition.y -= playerSpeed;
            break;
        case "ArrowDown":
            if (playerPosition.y < gameAreaHeight - 70) playerPosition.y += playerSpeed;
            break;
        case "ArrowLeft":
            if (playerPosition.x >= 25) playerPosition.x -= playerSpeed;
            break;
        case "ArrowRight":
            if (playerPosition.x < gameAreaWidth - 70) playerPosition.x += playerSpeed;
            break;
    }

    updatePosition();
}

/**
 * Inicia el juego al presionar el botón.
 */
startBtn.addEventListener("click", () => {
    if (isPlaying) return;

    adjustDifficulty();
    resetGame();
    isPlaying = true;
    isPaused = false;
    audio.play();
    gameLoop();
});

/**
 * Activa el modo oscuro.
 */
darkModeCheckbox.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", darkModeCheckbox.checked);
});

/**
 * Inicialización de eventos.
 */
window.addEventListener("keydown", movePlayer);
