const wordList = [{
        word: "MANZANA",
        image: "/imagenes/frutas/manzana.png",
        hint: "Es una fruta roja o verde que crece en los manzanos."
    },
    {
        word: "PLATANO",
        image: "/imagenes/frutas/banana.png",
        hint: "Es una fruta amarilla y alargada, rica en potasio."
    },
    {
        word: "FRESA",
        image: "/imagenes/frutas/fresa.png",
        hint: "Es una fruta pequeña, roja, con semillas en su superficie."
    },
    {
        word: "NARANJA",
        image: "/imagenes/frutas/naranja.png",
        hint: "Es una fruta cítrica de color naranja, muy jugosa."
    },
];

// Recuperar el puntaje y las vidas desde localStorage o asignar valores predeterminados
let currentRound = 0; // Ronda actual
let score = parseInt(localStorage.getItem("score")) || 0; // Si no hay puntaje, empieza en 0
let lives = parseInt(localStorage.getItem("lives")) || 3; // Si no hay vidas, empieza en 3

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

// Función para mostrar la pista en el modal
function showHelp() {
    const hint = wordList[currentRound].hint;

    // Mostrar la pista
    document.getElementById("helpText").innerText = hint;

    // Mostrar el modal de ayuda
    document.getElementById("helpModal").style.display = "flex";
}

// Función para cerrar el modal de ayuda
function closeHelp() {
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
        localStorage.setItem("score", score); // Guardar el puntaje en localStorage
        messageElement.innerText = "¡Correcto! Has adivinado la palabra.";
        messageElement.classList.remove("incorrect");
        messageElement.classList.add("correct");
    } else {
        lives--; // Restar una vida
        localStorage.setItem("lives", lives); // Guardar las vidas en localStorage
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

    localStorage.setItem("lives", lives); // Guardar las vidas en localStorage

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
        window.location.href = "Alimentos.html"; // Cambia este nombre por el archivo de la siguiente sección
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

// Función para actualizar el puntaje en la interfaz
function updateScoreDisplay() {
    document.getElementById("score-container").innerText = `Puntaje: ${score}`;
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
updateScoreDisplay(); // Mostrar el puntaje inicial