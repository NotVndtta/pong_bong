const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paddleWidth = 18,
    paddleHeight = 120,
    paddleSpeed = 8,
    ballRadius = 12,
    initialBallSpeed = 8,
    maxBallSpeed = 40,
    netWidth = 5,
    netColor = "WHITE";

function drawNet() {
    for (let i=0; i<=canvas.height; i+=15) {
        drawRect(canvas.width / 2  - netWidth / 2, i, netWidth, 10, netColor);
    }
}

function drawRect (x,y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height); // ебашит ебуный прямокутник с этими координатами и шириной, высотой
}

function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath(); // объект контекста рисования, кароче открывает новый путь для рисования фигуры и сбрасывает старый
    context.arc(x, y, radius, 0, Math.PI * 2, false); // рисует окружность, треш
    context.closePath();
    context.fill(); // заливка
}

// Функция для отображения текста
function drawText (text, x, y, color, fontSize = 60, fontWeight = 'bold', font = 'Courier New') {
    context.fillStyle = color;
    context.font = `${fontWeight} ${fontSize}px ${font}`; // стилизация шрифтов, нахуя css придумали...
    context.textAlign = "center";
    context.fillText(text, x, y);
}

function createPaddle(x, y, width, height, color) {
    return {x, y, width, height, color, score: 0}; // устанавливаем счет 0
}

function createBall(x, y, radius, velocityX, velocityY, color){
    return { x, y, radius, velocityX, velocityY, color, speed: initialBallSpeed};
}

const user = createPaddle(0, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "WHITE");

const com = createPaddle(canvas.width - paddleWidth, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "WHITE");

const ball = createBall(canvas.width / 2, canvas.height / 2, ballRadius, initialBallSpeed, initialBallSpeed, "WHITE");

canvas.addEventListener('mousemove', movePaddle);

function movePaddle(event) {
    const rect = canvas.getBoundingClientRect(); // получение размеров и положения элемента canvas на странице
    user.y = event.clientY - rect.top - user.height / 2; //изменение положения платформы от положения курсора
}

// функция, которая опрделяет происодит ли столкновение между шаром(b) и прямоугольником(p), если корды пересекаются
// функция выводит true, иначе false
function collision(b,p) {
    return (
    b.x + b.radius > p.x && b.x - b.radius < p.x + p.width && b.y + b.radius > p.y && b.y - b.radius < p.
    y + p.height
    );
}


// функция сброса шара на дефолтные значения
function resetBall() {
    ball.x = canvas.width / 2; // установка шара по середине, по x
    ball.y = Math.random() * (canvas.height - ball.radius * 2) + ball.radius; // установка в рандомной позиции по вертикали
    ball.velocityX = -ball.velocityX; // изменение направления шара 
    ball.speed = initialBallSpeed; // дефолтная скорость шара
}

function update() {
    if (ball.x - ball.radius < 0) { // усли шар выходит за левую границу, то счет +1 и сброс шара на центр
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {  // аналогично для правой границы
        user.score++;
        resetBall();
    }

    ball.x += ball.velocityX; // задаем скорость короче
    ball.y += ball.velocityY; 

    com.y += (ball.y - (com.y + com.height / 2)) * 0.075; // обновление положения компа относительно шара
    // вычисляет разницу между текущим положением шара и текущим положением компьютерного игрока, а затем изменяет положение компьютерного игрока на 10% этой разницы

    if (ball.y - ball.radius <0 || ball.y + ball.radius > canvas.height){ // проверка на выход шара за верхнюю и нижнюю границы
        ball.velocityY = -ball.velocityY; // изменение траектории
    }

    let player = ball.x + ball.radius < canvas.width / 2 ? 
    user : com;
    if (collision(ball, player)) { // проверка на столкновение шара с игроком или ботом
        const collidePoint = ball.y - (player.y + player.height / 2); // вычисление точки столкновения
        const collisionAngle = (Math.PI / 4) * (collidePoint / (player.height / 2 )); // угол столкновения
        const direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1; // определение направления движения
        ball.velocityX = direction * ball.speed * Math.cos(collisionAngle); // изменение скорости шара (вычисление новой скорости на основе угла столкновения и направления)
        ball.velocityY = ball.speed * Math.sin(collisionAngle); // та же херня, но по y
        
            ball.speed += 0.2; // увеличение скорости на 0.2
            if (ball.speed > maxBallSpeed) {
                ball.speed = maxBallSpeed; // если скорость больше максимальной, то ставит максимальую
            }
    }
} 

function render() {
    drawRect(0, 0, canvas.width, canvas.height, "BLACK"); // очистка короч
    drawNet();
    drawText(user.score, canvas.width / 4, canvas.height / 2, "GRAY", 120, 'bold'); // отображение счета пользователя
    drawText(com.score, (3 * canvas.width) / 4, canvas.height / 2, "GRAY", 120, 'bold'); // отображение счета компа

    // отображение объектов
    drawRect(user.x, user.y, user.width, user.height, user.color); 
    drawRect(com.x, com.y, com.width, com.height, com.color);

    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function gameLoop() {
    update();
    render();

}

const framePerSec = 60;
setInterval(gameLoop, 1000 / framePerSec); // функция для обновления игровой логики и отрисовки нового кадра.




