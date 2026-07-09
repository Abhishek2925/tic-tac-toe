// 1. Grab Screens
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const winnerScreen = document.getElementById('winner-screen');

// 2. Grab Interactable Elements
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const winnerMessage = document.getElementById('winner-message');

// 3. Grab Buttons
const startBtn = document.getElementById('start-btn');
const abortBtn = document.getElementById('abort-btn');
const playAgainBtn = document.getElementById('play-again-btn');

// 4. Sound Effect
const popSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');

// 5. Variables
let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
let isGameActive = false;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// 6. Navigation / Screen Switching Functions
function showScreen(screenToShow) {
    // Hide all screens first
    startScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    winnerScreen.classList.add('hidden');
    
    // Show selected screen
    screenToShow.classList.remove('hidden');
}

function startGame() {
    resetGameData();
    isGameActive = true;
    showScreen(gameScreen);
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !isGameActive) {
        return;
    }

    // Sound Playback
    popSound.currentTime = 0;
    popSound.play();

    // Map move to state and UI
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    checkForWinner();
}

function checkForWinner() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') continue;
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        isGameActive = false;
        winnerMessage.textContent = `Player ${currentPlayer} Wins! 🎉`;
        setTimeout(() => showScreen(winnerScreen), 600); // Small clean delay before screen change
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        isGameActive = false;
        winnerMessage.textContent = "It's a Draw! 🤝";
        setTimeout(() => showScreen(winnerScreen), 600);
        return;
    }

    // Toggle turn
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGameData() {
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = "Player X's turn";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.className = "cell"; 
    });
}

// 7. Event Listeners
startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', () => showScreen(startScreen)); // Takes you back to choice screen
abortBtn.addEventListener('click', () => showScreen(startScreen));
board.addEventListener('click', handleCellClick);