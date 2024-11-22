const wordList = [
    {
        word: "PERRO",
        image: "/imagenes/animales/perro.png",
        hint: "Es un animal doméstico que ladra.",
        audio: "audios/perro.mp3"
    },
    {
        word: "GATO",
        image: "/imagenes/animales/gato.png",
        hint: "Es un animal doméstico que maúlla.",
        audio: "audios/gato.mp3"
    },
    {
        word: "ELEFANTE",
        image: "/imagenes/animales/elefante.png",
        hint: "Es un animal muy grande con orejas grandes.",
        audio: "audios/elefante.mp3"
    },
    {
        word: "GALLO",
        image: "/imagenes/animales/gallo.png",
        hint: "Es un ave que canta por la mañana.",
        audio: "audios/gallo.mp3"
    }
];

let currentRound = 0; // Ronda actual
let score = 0; // Puntaje
let lives = 3; // Vidas iniciales

// Función para generar los cuadros de letras
function generateLetterBoxes() {
    const letterBoxesContainer = document.getElementById("letter-boxes");
    letterBoxesContainer.innerHTML = ""; // Limpiar el contenedor

    const word = wordList[currentRound].word;

    const inputs = []; // Array para almacenar los inputs

    for (let i = 0; i < word.length; i++) {
        const box = document.createElement("div");
        box.classList.add("letter-box");

        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.classList.add("input-box");

        // Cuando se escribe una letra, enfocar el siguiente input
        input.oninput = () => {
            input.value = input.value.toUpperCase(); // Convertir a mayúsculas
            checkAllInputsFilled(inputs); // Verificar si están llenos
            // Enfocar al siguiente cuadro si se escribió una letra
            if (input.value !== "" && i < word.length - 1) {
                inputs[i + 1].focus(); // Enfocar el siguiente cuadro
            }
        };

        inputs.push(input);
        box.appendChild(input);
        letterBoxesContainer.appendChild(box);
    }
}

// Verificar si todos los cuadros están llenos
function checkAllInputsFilled(inputs) {
    let userAnswer = "";
    let allFilled = true;

    inputs.forEach(input => {
        if (input.value === "") {
            allFilled = false; // Si algún cuadro está vacío, no continuar
        }
        userAnswer += input.value.toUpperCase();
    });

    if (allFilled) {
        evaluateAnswer(userAnswer); // Evaluar respuesta automáticamente
    }
}

// Evaluar la respuesta
function evaluateAnswer(userAnswer) {
    const correctAnswer = wordList[currentRound].word;
    const messageElement = document.getElementById("message");

    if (userAnswer === correctAnswer) {
        score += 100;
        messageElement.innerText = "¡Correcto! Has adivinado la palabra.";
        messageElement.classList.remove("incorrect");
        messageElement.classList.add("correct");
    } else {
        lives--; // Restar una vida
        messageElement.innerText = `Incorrecto. Te quedan: ${lives} vidas`;
        messageElement.classList.remove("correct");
        messageElement.classList.add("incorrect");

        updateLives(); // Actualizar las vidas

        if (lives <= 0) {
            showGameOverModal();
            return; // Salir si el juego terminó
        }
    }

    // Mostrar el mensaje
    messageElement.style.display = "block";
    document.getElementById("score-container").innerText = `Puntaje: ${score}`;

    // Pasar a la siguiente ronda después de un breve retraso
    setTimeout(nextRound, 2000);
}

// Mostrar la pista y reproducir audio
function showHelp() {
    const hint = wordList[currentRound].hint;
    const audioSrc = wordList[currentRound].audio;

    document.getElementById("helpText").innerText = hint;

    const helpAudio = document.getElementById("helpAudio");
    helpAudio.src = audioSrc;

    document.getElementById("helpModal").style.display = "flex";
}

// Cerrar el modal de ayuda
function closeHelp() {
    const helpAudio = document.getElementById("helpAudio");
    helpAudio.pause();
    helpAudio.currentTime = 0; // Resetear posición del audio

    document.getElementById("helpModal").style.display = "none";
}

// Actualizar las vidas en pantalla
function updateLives() {
    const livesContainer = document.getElementById("lives-container");
    livesContainer.innerHTML = ""; // Limpiar los iconos de vida

    for (let i = 0; i < lives; i++) {
        const heart = document.createElement("i");
        heart.classList.add("fas", "fa-heart", "heart");
        livesContainer.appendChild(heart);
    }

    if (lives <= 0) {
        showGameOverModal();
    }
}

// Avanzar a la siguiente ronda o ganar el juego
function nextRound() {
    currentRound++;
    if (currentRound >= wordList.length) {
        showWinModal();
    } else {
        generateLetterBoxes();
        document.getElementById("game-image").src = wordList[currentRound].image;
        document.getElementById("message").style.display = "none"; // Ocultar el mensaje
        updateLives(); // Actualizar vidas
    }
}

// Mostrar el modal de fin de juego
function showGameOverModal() {
    document.getElementById("finalScore").innerText = `Tu puntaje fue: ${score}`;
    document.getElementById("gameOverModal").style.display = "flex";
}

// Mostrar el modal de victoria
function showWinModal() {
    document.getElementById("finalScoreWin").innerText = `Tu puntaje fue: ${score}`;
    localStorage.setItem("score", score);
    localStorage.setItem("lives", lives);

    const button = document.getElementById("winButton");
    button.innerText = "Pasar a la siguiente sección";
    button.onclick = () => {
        window.location.href = "frutas.html"; // Cambiar al archivo de la siguiente sección
    };

    document.getElementById("winModal").style.display = "flex";
}

// Reiniciar el juego
function restartGame() {
    localStorage.removeItem("score");
    localStorage.removeItem("lives");
    localStorage.removeItem("nickname");
    window.location.href = "index.html"; // Redirigir a la página de inicio
}
// Reiniciar el juego
function volverJugar() {
    // Destruir los datos de localStorage
    localStorage.removeItem("score");
    localStorage.removeItem("lives");
    window.location.href = "menu.html"; // Redirige a la página de inicio del juego
}

// Verificar si hay un nickname guardado
function checkNickname() {
    const nickname = localStorage.getItem("nickname");
    if (!nickname) {
        window.location.href = "index.html";
    }
}

// Inicializar el juego
checkNickname();
generateLetterBoxes();
updateLives(); // Mostrar vidas iniciales
