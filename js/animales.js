const wordList = [{
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
let audioElement = null; // Variable global para controlar el audio

// Función para generar los cuadros de letras
function generateLetterBoxes() {
    const letterBoxesContainer = document.getElementById("letter-boxes");
    letterBoxesContainer.innerHTML = ""; // Limpiar el contenedor

    const word = wordList[currentRound].word;
    for (let i = 0; i < word.length; i++) {
        const box = document.createElement("div");
        box.classList.add("letter-box");

        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.classList.add("input-box");
        input.oninput = () => input.value = input.value.toUpperCase(); // Convertir a mayúsculas
        box.appendChild(input);

        letterBoxesContainer.appendChild(box);
    }
}

// Función para mostrar la pista en el modal y cargar el audio correspondiente
function showHelp() {
    const hint = wordList[currentRound].hint;
    const audioSrc = wordList[currentRound].audio;

    // Mostrar la pista
    document.getElementById("helpText").innerText = hint;

    // Crear un nuevo elemento de audio y no reproducirlo automáticamente
    const helpAudio = document.getElementById("helpAudio");
    helpAudio.src = audioSrc;

    // Mostrar el modal de ayuda
    document.getElementById("helpModal").style.display = "flex";
}

// Función para cerrar el modal de ayuda
function closeHelp() {
    // Detener el audio al cerrar el modal
    const helpAudio = document.getElementById("helpAudio");
    helpAudio.pause();
    helpAudio.currentTime = 0; // Resetear la posición del audio

    // Ocultar el modal de ayuda
    document.getElementById("helpModal").style.display = "none";
}

// Verificar la respuesta
function checkAnswer() {
    const inputs = document.querySelectorAll(".input-box");
    let userAnswer = "";

    inputs.forEach(input => {
        userAnswer += input.value.toUpperCase();
    });

    const correctAnswer = wordList[currentRound].word;
    const messageElement = document.getElementById("message");

    if (userAnswer === correctAnswer) {
        score += 100;
        messageElement.innerText = "¡Correcto! Has adivinado la palabra.";
        messageElement.classList.remove("incorrect");
        messageElement.classList.add("correct");
    } else {
        lives--; // Restar una vida
        messageElement.innerText = `Incorrecto. Te quedan : ${lives} vidas`;
        messageElement.classList.remove("correct");
        messageElement.classList.add("incorrect");

        // Actualizar las vidas en pantalla
        updateLives();
    }

    // Mostrar el mensaje y las vidas restantes
    messageElement.style.display = "block";
    document.getElementById("score-container").innerText = `Puntaje: ${score}`;

    // Si no hay vidas restantes, termina el juego
    if (lives <= 0) {
        showGameOverModal();
    } else {
        // Pasar automáticamente a la siguiente ronda después de 2 segundos
        setTimeout(nextRound, 2000);
    }
}

// Función para actualizar los iconos de vidas
function updateLives() {
    const livesContainer = document.getElementById("lives-container");
    livesContainer.innerHTML = ""; // Limpiar los iconos de vida antes de agregarlos

    for (let i = 0; i < lives; i++) {
        const heart = document.createElement("i");
        heart.classList.add("fas", "fa-heart", "heart");
        livesContainer.appendChild(heart);
    }

    if (lives <= 0) {
        showGameOverModal();
    }
}

// Avanzar a la siguiente ronda o terminar el juego
function nextRound() {
    currentRound++;
    if (currentRound >= wordList.length) {
        showWinModal();
    } else {
        generateLetterBoxes();
        document.getElementById("game-image").src = wordList[currentRound].image;
        document.getElementById("message").style.display = "none"; // Ocultar el mensaje
        updateLives(); // Actualizar las vidas
    }
}

// Mostrar el modal de fin de juego
function showGameOverModal() {
    const finalScoreElement = document.getElementById("finalScore");
    finalScoreElement.innerText = `Tu puntaje fue: ${score}`;
    document.getElementById("gameOverModal").style.display = "flex";
}

function showWinModal() {
    const finalScoreElement = document.getElementById("finalScoreWin");
    finalScoreElement.innerText = `Tu puntaje fue: ${score}`;

    // Guardar el puntaje y las vidas en localStorage
    localStorage.setItem("score", score);
    localStorage.setItem("lives", lives);

    // Cambiar el botón del modal para "Pasar a la siguiente sección"
    const button = document.getElementById("winButton");
    button.innerText = "Pasar a la siguiente sección";
    button.onclick = () => {
        // Redirigir a otro archivo HTML
        window.location.href = "frutas.html"; // Cambia este nombre por el archivo de la siguiente sección
    };

    document.getElementById("winModal").style.display = "flex";
}


// Reiniciar el juego
function restartGame() {
    //Destruir los localStorage
    localStorage.removeItem("score");
    localStorage.removeItem("lives");
    localStorage.removeItem("nickname");
    window.location.href = "index.html"; // Redirige a la página de inicio del juego
}


//Verificar si hay un nickname guardado en localStorage
function checkNickname() {
    const nickname = localStorage.getItem("nickname");
    //Si no existe volver al login
    if (!nickname) {
        window.location.href = "index.html";
    }
}
// Inicializar el juego
checkNickname();
generateLetterBoxes();
updateLives(); // Mostrar las vidas iniciales