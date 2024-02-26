document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const startButton = document.getElementById('start-game');
    const highscoreDisplay = document.getElementById('highscore')
    const game_frame = document.getElementById('game-frame')

    // Sound effects
    var pop = new Audio('pop.mp3');
    var lose_sound = new Audio('lose.mp3')

    let score = 0;
    let lives = 3;
    let gridSize = 3;
    let marksRequired = 3;
    let correctClicks = 0;
    let markedIndices = [];
    let canClick = true;
    let highscore = 0;

    startButton.addEventListener('click', startGame);

    function startGame() {
        
        // Adjust the frame
        game_frame.style.height = 'auto';

        score = 0;
        lives = 3;
        gridSize = 3; // Reset grid size to initial
        marksRequired = 3;
        stagesCompleted = 0; // Reset stages completed
        correctClicks = 0;
        scoreDisplay.textContent = score;
        livesDisplay.textContent = lives;
        startButton.style.display = 'none';
        createBoard();
    }

    function createBoard() {
        board.innerHTML = ''; // Clear existing board
        const boxSize = 100 - (gridSize - 3) * 10; // Decrease box size as grid increases
        board.style.gridTemplateColumns = `repeat(${gridSize}, ${boxSize}px)`;
        const totalBoxes = gridSize * gridSize;

        for (let i = 0; i < totalBoxes; i++) {
            const button = document.createElement('button');
            button.style.width = `${boxSize}px`;
            button.style.height = `${boxSize}px`;
            button.style.transition = '0.4s';
            button.addEventListener('click', () => handleButtonClick(i, button));
            board.appendChild(button);
        }

        markRandomBoxes();
    }
    function markRandomBoxes() {
        const buttons = [...board.children];
        let toMark = marksRequired;
        markedIndices = [];

        while (toMark > 0) {
            const index = Math.floor(Math.random() * buttons.length);
            if (!markedIndices.includes(index)) {
                markedIndices.push(index);
                buttons[index].classList.add('marked');
                toMark--;
            }
        }
    }

    function handleButtonClick(index, button) {
        if (!canClick) return;

        if (markedIndices.includes(index)) {
            if (!button.classList.contains('clicked')) {
                if (correctClicks === 0)  {
                    // First correct click, remove marks except the clicked one
                    markedIndices.forEach(i => {
                        if (i !== index) {
                            board.children[i].classList.remove('marked');
                            board.children[i].classList.remove('clicked');
                        }
                    });
                }
                button.classList.add('clicked'); // Ensure it stays marked if correct
                button.classList.add('marked'); // Ensure it stays marked if correct
                correctClicks++;
                if (correctClicks === marksRequired) {
                    pop.play();
                    score++;
                    marksRequired++;
                    scoreDisplay.textContent = score;
                    if (highscore < score) {
                        highscore = score;
                        highscoreDisplay.textContent = highscore;
                    }
                    increaseDifficulty();
                }
            }
        } else {
            canClick = false; 
            // Incorrect click
            button.classList.add('incorrect'); // Add class to mark incorrect

            markedIndices.forEach(i => {
                const correctButton = board.children[i];
                if (!correctButton.classList.contains('marked')) {
                    correctButton.classList.add('temp-correct'); // Use a temporary class to highlight
                }
            });


            
            setTimeout(() => {
                button.classList.remove('incorrect'); // Remove the incorrect mark
                resetCurrentStage(); // Reset only the current stage, not the entire game
                canClick = true;
            }, 1000);
        }
    }

    function increaseDifficulty() {
        correctClicks = 0; // Reset correct clicks for next stage
        stagesCompleted++;
        if (stagesCompleted % 2 === 0) { // Every two stages
            gridSize++; // Add one column and one row
        }
        createBoard(); // Re-create board with new difficulty
    }

    function resetCurrentStage() {
        lives--;
        livesDisplay.textContent = lives;
        if (lives > 0) {
            correctClicks = 0;
            createBoard(gridSize);
        } else {
            if (highscore < score) {
                highscore = score;
                highscoreDisplay.textContent = highscore;
            }
            lose_sound.play();
            // alert('Game Over!');
            gameOver();
            startButton.style.display = 'block'; // Show start button for new game
            board.innerHTML = '';
            game_frame.style.height = '300px';
        }
    }

    function gameOver() {
        var modal = document.getElementById('gameOverModal');
        var finalScore = document.getElementById('finalScore');
        finalScore.textContent = score; // Update to match how you're storing score
        modal.style.display = "block"; // Show the modal
    }
    
    // Close the modal
    var closeButton = document.querySelector('.close-button');
    closeButton.onclick = function() {
        var modal = document.getElementById('gameOverModal');
        modal.style.display = "none";
        // Optionally reset the game or take other actions when the modal is closed
    };
});
