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

function moveCharacter() {
    if (moveLeft) {
        characterRight += characterSpeed;
        character.style.right = characterRight + 'px';
    }
    if (moveRight) {
        characterRight -= characterSpeed;
        character.style.right = characterRight + 'px';
    }
    let maxBottom = groundBottom + 100; // for example, the character can go down 50px below the ground

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
                    jumpCount = 0; // Reset jump count
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
    image.src = randomImagePath; // Replace 'path_to_your_image.jpg' with the actual path to your image
    image.style.position = 'absolute';
    image.style.width = 'fixed'; // Adjust width as needed
    image.style.height = '230px'; // Adjust height as needed
    image.style.marginRight = '-65px';
    image.style.righdwt = obstacleRight + 'px'; // Adjust position as needed
    image.style.bottom = obstacleBottom + 'px'; // Adjust position as needed
    obstacles.appendChild(image);

    function moveObstacle(){
        obstacleRight += 5;
        obstacle.style.right = obstacleRight + 'px';
        obstacle.style.bottom = obstacleBottom + 'px';
        obstacle.style.width = obstacleWidth + 'px';
        obstacle.style.height = obstacleHeight + 'px';
        image.style.right = obstacleRight + 'px'; // Update image position
        image.style.bottom = obstacleBottom + 'px'; // Update image position

        

        if(characterRight >= obstacleRight - characterWidth && characterRight <= obstacleRight + obstacleWidth && characterBottom <= obstacleBottom + obstacleHeight){
            alert('Game Over! Your score is: ' +score);
            clearInterval(obstacleInterval);
            clearTimeout(obstacleTimeout);
            location.reload();
        }

        
    }

    let obstacleInterval = setInterval(moveObstacle, 20);
    let obstacleTimeout = setTimeout(function() {
        generateObstacle(imagePaths);
    }, randomTimeout);
}
generateObstacle(
    ['assets/obstacles/obstacle-1.gif', 
    'assets/obstacles/obstacle-2.gif', 
    'assets/obstacles/obstacle-3.gif', 
    'assets/obstacles/obstacle-4.gif', 
    'assets/obstacles/obstacle-5.gif', 
    'assets/obstacles/obstacle-6.gif', 
    'assets/obstacles/obstacle-7.gif', 
    'assets/obstacles/obstacle-8.gif']);


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
