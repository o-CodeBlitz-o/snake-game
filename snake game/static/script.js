// Access the canvas element and its drawing context
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// Access the high score and current score display elements
const highScoreDisplay = document.getElementById('highScore');
const scoreDisplay = document.getElementById('score');

// Define constants for the game grid and initialize a counter for controlling the game loop speed
const grid = 16;
let count = 0;

// Initialize the snake object with properties for position, direction, cells, and maximum length
let snake = {
    x: 160,
    y: 160,
    dx: grid,  // Velocity in x-direction
    dy: 0,     // Velocity in y-direction
    cells: [], // Array to store the cells that make up the snake
    maxCells: 3 // Initial length of the snake
};

// Initialize the apple's position
let apple = { x: 320, y: 320 };

// Fetch the high score when the game starts
getHighScore();

// Function to fetch the high score from the server
function getHighScore() {
    fetch("/GetHighScore", { method: "GET" })
        .then(response => response.json())
        .then(data => {
            highScoreDisplay.textContent = data['data'];
        });
}

// Function to update the high score on the server
function updateHighScore(highscoreValue) {
    fetch("/HighScore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "highscore": highscoreValue })
    })
        .then(response => response.text())
        .then(data => console.log(data));
}

// Function to generate a random integer between min and max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Main game loop
function loop() {
    requestAnimationFrame(loop);

    // Control the frame rate
    if (++count < 5) return;
    count = 0;

    // Clear the canvas for redrawing
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw game elements
    moveSnake();
    wrapSnakePosition();
    updateSnakeCells();
    drawApple();
    drawSnake();
    checkCollision();
}

// Function to move the snake
function moveSnake() {
    snake.x += snake.dx;
    snake.y += snake.dy;
}

// Function to wrap the snake around the edges of the canvas
function wrapSnakePosition() {
    snake.x = snake.x < 0 ? canvas.width - grid : snake.x >= canvas.width ? 0 : snake.x;
    snake.y = snake.y < 0 ? canvas.height - grid : snake.y >= canvas.height ? 0 : snake.y;
}

// Function to update the position of the snake cells
function updateSnakeCells() {
    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) snake.cells.pop();
}

// Function to draw the apple on the canvas
function drawApple() {
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(apple.x + grid / 2, apple.y + grid / 2, grid / 2 - 2, 0, 2 * Math.PI);
    context.fill();
    context.fillStyle = 'brown';
    context.fillRect(apple.x + grid / 2 - 2, apple.y - grid / 4, 4, grid / 4);
}

// Function to draw the snake
function drawSnake() {
    snake.cells.forEach((cell, index) => {
        if (index === 0) {
            // Draw the head
            context.fillStyle = 'darkgreen';
            context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

            // Add eyes
            context.fillStyle = 'white'; // Eye color
            context.fillRect(cell.x + 4, cell.y + 4, 2, 2); // Left eye
            context.fillRect(cell.x + grid - 6, cell.y + 4, 2, 2); // Right eye
        } else {
            // Draw the body with scales
            let gradient = context.createLinearGradient(cell.x, cell.y, cell.x + grid, cell.y + grid);
            gradient.addColorStop(0, 'green');
            gradient.addColorStop(1, 'limegreen');
            context.fillStyle = gradient;
            context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

            // Add scales
            context.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Scale color with some transparency
            for (let i = 3; i < grid - 3; i += 3) {
                for (let j = 3; j < grid - 3; j += 3) {
                    context.fillRect(cell.x + i, cell.y + j, 1, 1); // Draw each scale
                }
            }
        }
    });
}



// Function to handle collisions
function checkCollision() {
    snake.cells.forEach((cell, index) => {
        if (cell.x === apple.x && cell.y === apple.y) {
            scoreDisplay.textContent++;
            snake.maxCells++;
            apple = { x: getRandomInt(0, 25) * grid, y: getRandomInt(0, 25) * grid };
        }

        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                updateHighScore(scoreDisplay.textContent);
                window.location.reload();
            }
        }
    });
}

// Event Listeners
document.addEventListener('keydown', e => {
    if (e.code === "ArrowLeft" && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
    else if (e.code === "ArrowUp" && snake.dy === 0) { snake.dy = -grid; snake.dx = 0; }
    else if (e.code === "ArrowRight" && snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
    else if (e.code === "ArrowDown" && snake.dy === 0) { snake.dy = grid; snake.dx = 0; }
});

// Start the game
requestAnimationFrame(loop);
