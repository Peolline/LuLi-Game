// const body = document.getElementById("game");
// const ctx = body.getContext ("2d");
// const GAME_WIDTH = 500;
// const GAME_HEIGHT = 400;

var gameOver = false;

let charcter = document.getElementById('character');
let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
let characterRight = parseInt(window.getComputedStyle(character).getPropertyValue('right'));
let characterWidth = parseInt(window.getComputedStyle(character).getPropertyValue('width'));
let ground = document.getElementById('ground');
let groundBottom = parseInt(window.getComputedStyle(ground).getPropertyValue('bottom'));
let groundHeight = parseInt(window.getComputedStyle(ground).getPropertyValue('height'));

let characterSpeed = 5;
let moveLeft = false;
let moveRight = false;
let moveDown = false;
let isJumping = false;
let jumpCount = 0;
let upTime;
let downTime;
let displayScore = document.getElementById('score');
let score = 0;

// let scaleRatio = null;

// function setScreen(){
//     scaleRatio = getScaleRatio();
//     body.width = GAME_WIDTH * scaleRatio;
//     body.height = GAME_HEIGHT * scaleRatio;
// }

// function getScaleRatio(){
//     const screenHeight = Math.min(
//         window.innerHeight,
//         document.documentElement.clientHeight
//     );

//     const screenWidth = Math.min(
//         window.innerWidth,
//         document.documentElement.clientWidth
//     );

//     if(screenWidth/ screenHeight < GAME_WIDTH/GAME_HEIGHT){
//         return screenWidth/GAME_WIDTH;
//     } else{
//         return screenHeight/GAME_HEIGHT;
//     }
// }

// setScreen();
// window.addEventListener("resize", () => setTimeout(setScreen, 500));

// if(screen.orientation){
//     screen.orientation.addEventListener("change", setScreen);
// }

function moveCharacter() {
    if (moveLeft) {
        characterRight += characterSpeed;
        character.style.right = characterRight + 'px';
    }
    if (moveRight) {
        characterRight -= characterSpeed;
        character.style.right = characterRight + 'px';
    }
    let maxBottom = groundBottom + 100; 

    if (moveDown && characterBottom > maxBottom) {
        characterBottom -= characterSpeed;
        character.style.bottom = characterBottom + 'px';
    }
}



function jump(){
    if (isJumping) {
        // Double jump
        if (jumpCount === 0) {
            clearInterval(upTime);
            clearInterval(downTime);
            isJumping = false;
            jumpCount++;
            characterBottom += 50; // Increase jump height for the second jump
            jump();
        }
        return;
    }

    let jumpHeight = (jumpCount === 0) ? 260 : 500; // Adjust jump height based on jump count

    upTime = setInterval(() => {
        if (characterBottom >= groundHeight + jumpHeight) {
            clearInterval(upTime);
            downTime = setInterval(() =>{
                if (characterBottom <= groundHeight + 10){
                    clearInterval(downTime);
                    isJumping = false;
                    jumpCount = 0; 
                }
                characterBottom -= 8;
                character.style.bottom = characterBottom + 'px';
            },15);
        }
        characterBottom += 10;
        character.style.bottom = characterBottom + 'px';
        isJumping = true;
    },15);
}

function showScore(){
    score++;
    displayScore.innerText = score;
}

setInterval(showScore,100);


function generateObstacle(imagePaths){
    let obstacles = document.querySelector('.obstacles');
    let obstacle = document.createElement('div');
    obstacle.setAttribute('class', 'obstacle');
    obstacles.appendChild(obstacle);

    let randomTimeout = (Math.random() * 1000) + 1500;
    let obstacleRight = -30;
    let obstacleBottom = 100;
    let obstacleWidth = 45;
    let obstacleHeight = 100;
    obstacle.style.backgroundColor = `none`;

    let randomImagePath = imagePaths[Math.floor(Math.random() * imagePaths.length)];

    // Create and position the image
    let image = document.createElement('img');
    image.src = randomImagePath; 
    image.style.position = 'absolute';
    image.style.width = 'fixed'; 
    image.style.height = '230px'; 
    image.style.marginRight = '-65px';
    image.style.righdwt = obstacleRight + 'px';
    image.style.bottom = obstacleBottom + 'px'; 
    obstacles.appendChild(image);

    function moveObstacle(){

        if (gameOver) return;

        obstacleRight += 5;
        obstacle.style.right = obstacleRight + 'px';
        obstacle.style.bottom = obstacleBottom + 'px';
        obstacle.style.width = obstacleWidth + 'px';
        obstacle.style.height = obstacleHeight + 'px';
        image.style.right = obstacleRight + 'px'; 
        image.style.bottom = obstacleBottom + 'px'; 


        if (characterRight >= obstacleRight - characterWidth && characterRight <= obstacleRight + obstacleWidth && characterBottom <= obstacleBottom + obstacleHeight) {
            gameOver = true;
            // Pause the game
            clearInterval(obstacleInterval);
            clearTimeout(obstacleTimeout);
        
            // Create a div element for the Game Over message
            var gameOverDiv = document.createElement("div");
            gameOverDiv.id = "gameOverDiv";
            gameOverDiv.innerHTML = "Game Over! Your score is: " + score;
            gameOverDiv.style.position = "absolute";
            gameOverDiv.style.top = "50%";
            gameOverDiv.style.left = "50%";
            gameOverDiv.style.transform = "translate(-50%, -50%)";
            gameOverDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            gameOverDiv.style.color = "white";
            gameOverDiv.style.padding = "20px";
            gameOverDiv.style.borderRadius = "10px";
            gameOverDiv.style.zIndex = "1000";
        
            // Append the Game Over div to the game container
            document.getElementById("gameContainer").appendChild(gameOverDiv);
    
        }
        
        

        // if(characterRight >= obstacleRight - characterWidth && characterRight <= obstacleRight + obstacleWidth && characterBottom <= obstacleBottom + obstacleHeight){
        //     alert('Game Over! Your score is: ' +score);
        //     clearInterval(obstacleInterval);
        //     clearTimeout(obstacleTimeout);
        //     location.reload();
        // }

        
    }

    let obstacleInterval = setInterval(moveObstacle, 20);
    let obstacleTimeout = setTimeout(function() {
        generateObstacle(imagePaths);
    }, randomTimeout);
}

//Obstacles GIF
generateObstacle(
    ['assets/obstacles/obstacle-1.gif', 
    'assets/obstacles/obstacle-2.gif', 
    'assets/obstacles/obstacle-3.gif', 
    'assets/obstacles/obstacle-4.gif', 
    'assets/obstacles/obstacle-5.gif', 
    'assets/obstacles/obstacle-6.gif', 
    'assets/obstacles/obstacle-7.gif', 
    'assets/obstacles/obstacle-8.gif']);




//CONTROL WASD
function control(e) {
    console.log("Key pressed:", e.key);
    if (e.key === 'w' || e.key === 'W') {
        jump();
    }
    if (e.key === 'a' || e.key === 'A') {
        moveLeft = true;
    }
    if (e.key === 'd' || e.key === 'D') {
        moveRight = true;
    }
    if (e.key === 's' || e.key === 'S') {
        moveDown = true;
    }
}


function releaseControl(e) {
    if (e.key === 'a') {
        moveLeft = false;
    }
    if (e.key === 'd') {
        moveRight = false;
    }
    if (e.key === 's') {
        moveDown = false;
    }
}




document.addEventListener('keydown', control);
document.addEventListener('keyup', releaseControl);
document.addEventListener('click', jump);

setInterval(moveCharacter, 20);

