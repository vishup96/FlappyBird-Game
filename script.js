const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
// Declearing some variable--------
var frames = 0;
// fatching the image with imge object
const sprite = new Image();
sprite.src = "sprite.png";

// loding sound file 
let flap = new Audio();
flap.src = "flap.wav";



let hit = new Audio();
hit.src = "hit.wav";

let die = new Audio();
die.src = "die.wav";

let swooshing = new Audio();
swooshing.src = "swooshing.wav";

// state object

const state = {
    current: 0,
    getreadystate: 0,
    game: 1,
    gameover: 2

}

// ading click event to the cvs
cvs.addEventListener("click", function (event) {
    switch (state.current) {
        case state.getreadystate:
            state.current = state.game;
            swooshing.play();
            break;
        case state.game:
            bird.move();
            flap.play();
            break;
        case state.gameover:
            let cvsPosition = cvs.getBoundingClientRect();
            let clickX = event.clientX - cvsPosition.left;// This line will be return our x axis position on where  mouse will be click click 
            let clickY = event.clientY - cvsPosition.top;// This line will be return our x axis position on where  mouse will be click click 
            console.log(clickX, clickY);
            if (clickX > startBtn.x && clickX < startBtn.x + startBtn.w && clickY > startBtn.y
                && clickY < startBtn.y + startBtn.h) {
                state.current = state.getreadystate;
                pipes.reset();
                score.reset();
                setTimeout(function () {
                    window.location.reload();
                }, 1000)
                break;
            }
    }
})

// start button object
const startBtn = {
    x: 169,
    y: 254,
    w: 83,
    h: 29,

}
// get ready section-------------------------
const getready = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    y: 80,
    x: cvs.width / 2 - (173) / 2,
    draw: function () {
        if (state.current == state.getreadystate) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

// game over section--------------

const gameover = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    y: 80,
    x: cvs.width / 2 - (225) / 2,
    draw: function () {
        if (state.current == state.gameover) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        }
    }
}
// Score object to display score

const score = {
    value: 0,
    best: parseInt(localStorage.getItem("best")) || 0,
    draw: function () {
        if (state.current == state.game) {
            ctx.fillStyle = "black";
            ctx.font = "50px teko";
            ctx.fillText(this.value, cvs.width / 2, 100);
        }
        else if (state.current == state.gameover) {
            ctx.fillStyle = "black";
            ctx.font = "30px teko";
            ctx.fillText(this.value, cvs.width / 2 + 65, 180);
            ctx.fillText(this.best, cvs.width / 2 + 65, 220);
        }
    }, reset: function () {
        this.value = 0;
    }
}

// cloud object------------------------------------------------
const bg = {
    sX: 0,
    sY: 0,
    w: 274,
    h: 220,
    x: 0,
    dx: 2,
    y: cvs.height - 220,
    draw: function () {


        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + (2 * this.w), this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + (3 * this.w), this.y, this.w, this.h);
    }, update: function () {
        if (state.current == state.game) {
            this.x -= this.dx;
            if (this.x % 137 == 0) {
                this.x = 0;
            }
        }
    }
}
// ground object--------------------------------------
const gd = {

    sX: 280,
    sY: 0,
    w: 220,
    h: 110,
    x: 0,
    y: cvs.height - 110,
    dx: 3,
    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + (2 * this.w), this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + (3 * this.w), this.y, this.w, this.h);
    },
    update: function () {
        if (state.current == state.game) {
            this.x -= this.dx;
            if (this.x % 112 == 0) {
                this.x = 0;
            }
        }
    }
}

// bird object--------------------------------------------
var bird = {

    animation: [
        { sX: 276, sY: 112 },
        { sX: 276, sY: 139 },
        { sX: 276, sY: 164 },
        { sX: 276, sY: 139 }
    ],
    w: 34,
    h: 26,
    x: 50,
    y: 150,
    speed: 0,
    gravity: 0.2,
    jump: 2,
    frame: 0,
    period: 7,
    radius: 8,
    draw: function () {
        let brd = this.animation[this.frame];
        ctx.drawImage(sprite, brd.sX, brd.sY, this.w, this.h, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);

    }, update: function () {
        this.frame += frames % this.period == 0 ? 1 : 0;
        // to reset the frame
        this.frame = this.frame % this.animation.length;
        //gravity
        if (state.current == state.game) {
            this.y = this.y + this.speed;
            this.speed += this.gravity;
        }
        // detecting collision b/w bird and ground
        if (this.y + this.h / 2 >= cvs.height - gd.h) {
            this.speed = 0;
            this.frame = 0;
            if (state.current == state.game) {
                state.current = state.gameover;
                die.play();
            }
        }


    }, move: function () {
        this.speed = -this.jump;
        this.frame = 3;

    }

}

// pipes object------------------
const pipes = {
    position: [],
    top: {
        sX: 553,
        sY: 0,
    },
    bottom: {
        sX: 500,
        sY: 0,
    },
    w: 53,
    h: 410,
    gap: 30,
    maxYPos: -150,
    dx: 2,
    draw: function () {

        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            let bothXPos = p.x;
            let topYpos = p.y;
            let bottomYpos = p.y + this.h + this.gap;
            // top pipes
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, bothXPos, topYpos, this.w - 10, this.h - 100);
            // bottom pipes
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, bothXPos, bottomYpos, this.w - 10, this.h - 100);
        }
    }, update: function () {
        if (state.current !== state.game) {
            return;
        }
        // adding all x,y value or Position in to aarray
        if (frames % 100 == 0) {
            this.position.push({
                x: cvs.width,
                y: this.maxYPos * (Math.random() + 1),
            });
        }
        // decreasing x value for moving the pipes
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            p.x -= this.dx;
            // for removing the pipes from the arayy

            if (p.x + this.w <= 0) {
                // to increase score

                score.value += 1;
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
                //removing the pipes
                this.position.shift();
            }

            // collision b/w pipes and bird
            // for top pipes
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w - 10 &&
                bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h - 100) {
                hit.play();
                state.current = state.gameover;

            }

            // for bottom pipes
            let tobp = p.y + this.h + this.gap;
            let bobp = p.y + this.h + this.gap + this.h;
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w - 10 && bird.y + bird.radius > tobp && bird.y - bird.radius < bobp) {
                hit.play();
                state.current = state.gameover;
            }
        }
    }, reset: function () {
        this.position = [];
    }
}




// single function to call every draw function

function draw() {
    // setting the background
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, cvs.clientWidth, cvs.height);
    bg.draw();
    pipes.draw();
    gd.draw();
    bird.draw();
    gameover.draw();
    getready.draw();
    score.draw();


}



// update for ground animation and other things

function update() {
    pipes.update();
    gd.update();
    bg.update();
    bird.update();

}



//loop function
function loop() {
    frames++;
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
