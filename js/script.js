// Author: Matthew Harrison-Jones

// Array Remove - By John Resig (MIT Licensed)
Array.remove = function (array, from, to) {

    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};

Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            break;
        }
    }
};
$(document).ready(function () {

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

    // requestAnimationFrame polyfill by Erik Möller
    // fixes from Paul Irish and Tino Zijdel

    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    }());

    /* FPS monitoring
     *
     * The higher the 'fpsFilter' value, the less the FPS will be affected by quick changes
     * Setting this to 1 will show you the FPS of the last sampled frame only
     */

    // stats.js r9 - http://github.com/mrdoob/stats.js
    var Stats=function(){var h,a,r=0,s=0,i=Date.now(),u=i,t=i,l=0,n=1E3,o=0,e,j,f,b=[[16,16,48],[0,255,255]],m=0,p=1E3,q=0,d,k,g,c=[[16,48,16],[0,255,0]];h=document.createElement("div");h.style.cursor="pointer";h.style.width="80px";h.style.opacity="0.9";h.style.zIndex="10001";h.addEventListener("mousedown",function(a){a.preventDefault();r=(r+1)%2;0==r?(e.style.display="block",d.style.display="none"):(e.style.display="none",d.style.display="block")},!1);e=document.createElement("div");e.style.textAlign=
        "left";e.style.lineHeight="1.2em";e.style.backgroundColor="rgb("+Math.floor(b[0][0]/2)+","+Math.floor(b[0][1]/2)+","+Math.floor(b[0][2]/2)+")";e.style.padding="0 0 3px 3px";h.appendChild(e);j=document.createElement("div");j.style.fontFamily="Helvetica, Arial, sans-serif";j.style.fontSize="9px";j.style.color="rgb("+b[1][0]+","+b[1][1]+","+b[1][2]+")";j.style.fontWeight="bold";j.innerHTML="FPS";e.appendChild(j);f=document.createElement("div");f.style.position="relative";f.style.width="74px";f.style.height=
        "30px";f.style.backgroundColor="rgb("+b[1][0]+","+b[1][1]+","+b[1][2]+")";for(e.appendChild(f);74>f.children.length;)a=document.createElement("span"),a.style.width="1px",a.style.height="30px",a.style.cssFloat="left",a.style.backgroundColor="rgb("+b[0][0]+","+b[0][1]+","+b[0][2]+")",f.appendChild(a);d=document.createElement("div");d.style.textAlign="left";d.style.lineHeight="1.2em";d.style.backgroundColor="rgb("+Math.floor(c[0][0]/2)+","+Math.floor(c[0][1]/2)+","+Math.floor(c[0][2]/2)+")";d.style.padding=
        "0 0 3px 3px";d.style.display="none";h.appendChild(d);k=document.createElement("div");k.style.fontFamily="Helvetica, Arial, sans-serif";k.style.fontSize="9px";k.style.color="rgb("+c[1][0]+","+c[1][1]+","+c[1][2]+")";k.style.fontWeight="bold";k.innerHTML="MS";d.appendChild(k);g=document.createElement("div");g.style.position="relative";g.style.width="74px";g.style.height="30px";g.style.backgroundColor="rgb("+c[1][0]+","+c[1][1]+","+c[1][2]+")";for(d.appendChild(g);74>g.children.length;)a=document.createElement("span"),
        a.style.width="1px",a.style.height=30*Math.random()+"px",a.style.cssFloat="left",a.style.backgroundColor="rgb("+c[0][0]+","+c[0][1]+","+c[0][2]+")",g.appendChild(a);return{getDomElement:function(){return h},getFps:function(){return l},getFpsMin:function(){return n},getFpsMax:function(){return o},getMs:function(){return m},getMsMin:function(){return p},getMsMax:function(){return q},update:function(){i=Date.now();m=i-u;p=Math.min(p,m);q=Math.max(q,m);k.textContent=m+" MS ("+p+"-"+q+")";var a=Math.min(30,
        30-30*(m/200));g.appendChild(g.firstChild).style.height=a+"px";u=i;s++;if(i>t+1E3)l=Math.round(1E3*s/(i-t)),n=Math.min(n,l),o=Math.max(o,l),j.textContent=l+" FPS ("+n+"-"+o+")",a=Math.min(30,30-30*(l/100)),f.appendChild(f.firstChild).style.height=a+"px",t=i,s=0}}};

    /**
     * Canvas settings
     */
    var canvas = $("#myCanvas");
    var context = canvas.get(0).getContext("2d");
    var canvasWidth = 800;
    var canvasHeight = 600;
    if(touchable){
        canvasWidth = $(window).get(0).innerWidth;
        canvasHeight = $(window).get(0).innerHeight;
    }
    canvas.attr("width", canvasWidth);
    canvas.attr("height", canvasHeight);

    /**
     * Movement settings
     */
        // Initialise controls
    var touchable = 'ontouchstart' in window || 'createTouch' in document;
    //if(touchable) refreshRate = 35;
    if (touchable) muted = true;
    var touches = [], rightKey = false, leftKey = false, upKey = false, downKey = false, space = false;

    /**
     * Game settings
     */
    var playGame = false, pause = false, gameOver = false, muted = false, debug = false;


    /**
     * Game Stats
     */
    var playTime = 0;
    var distance = 0;
    var score = 0, highScore = 0, level = 1;
    var globalHigh  = $(".meters").first().text();
    var personalHigh = highScore;
    terminalAppend(globalHigh);

    /**
     * UI Elements
     */
    var uiStart = $(".start"),
        uiPause = $(".paused"),
        uiOver = $(".gameOver"),
        playButton = $(".playGame"),
        continueButton = $(".continueGame"),
        exitButton = $(".exitGame"),
        debugUI = $(".debug");
    var stats;
    var scoreOut = $("#score"),
        overScoreOut = $(".scored"),
        highScoreOut = $(".highScore"),
        newhighScore = $(".newHighScore"),
        updatingScores = $(".updatingScores"),
        highList = $(".highList");
    /**
     * Sounds
     */
    var jumpSound = $("#jumpSound").get(0),
        coinSound = $("#coinSound").get(0),
        levelupSound = $("#levelupSound").get(0),
        hitSound = $("#hitSound").get(0),
        backgroundSound = $("#backgroundSound").get(0);


    /**
     * Game UI Settings
     */
    // Avoids blurring of edges
    if ("mozImageSmoothingEnabled" in context){
        context.mozImageSmoothingEnabled = false;
    }
    updateHighScore();
    var structures = [];
    var structureCount = 4;
    var blocks = [];
    var coins = [];
    var items = [];
    var moveSpeed = 4;
    var blockSize = 32;
    var structureSpacing = 30;
    // Set spacing to max for now so first structure is sent straight in.
    var spacing = 30;
    var floorHeight = canvasHeight - 49;
    var initialPlayerLocation = canvasWidth - (canvasWidth / 4);

    /**
     * Objects
     */

    var Sprites, Player, Coin, Heart, Item, Cloud, Structure, Block;

    /**
     * Load in images / sprites
     */
    Sprites = function (src){
        var sprite = [new Image(), false];

        sprite[0].src = src;
        sprite[0].onload = function (){
            sprite[1] = true;
        };

        var draw = function (sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight){
            if (sprite[1]){
                context.drawImage(sprite[0], sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                if (debug){
                    context.beginPath();
                    context.strokeRect(dx, dy, dWidth, dHeight);
                    context.lineWidth = 1;
                    context.strokeStyle = "#ff00d7";
                    context.closePath();
                }
            }
        };

        return {
            draw:draw
        };
    };


    /**
     * Status: Still = 0
     *         Running = 1
     *         Jump = 2
     *         Slide = 3
     * @param x
     * @param y
     */
    Player = function (x, y){
        var imageStill = {x:96, y:0, w:17, h:42};
        var imageRunning = {x:96, y:0, w:30, h:40, stage:1, timeout:0, maxTimeout:8};
        var imageJump = {x:96, y:44, w:29, h:40};
        var imageSlide = {x:96, y:96, w:48, h:16};
        var pos = {x:x, y:y, offsetY:0, offsetX:0};
        var settings = {width:34, height:88, coins:0, health:100, energy:100, energyRegen:5, status:0, lives:3, jumpHeight:0, maxJumpHeight:40, jumpSpeed:4};
        var movement = {jumping:false, sliding:false};
        var draw = function (){
            switch (settings.status){
                case 0:
                    settings.width = imageStill.w * 2;
                    settings.height = imageStill.h * 2;
                    sprite.draw(imageStill.x, imageStill.y, imageStill.w, imageStill.h, pos.x - settings.width + pos.offsetX, pos.y - settings.height - pos.offsetY, settings.width, settings.height);
                    break;
                case 1:
                    settings.width = imageRunning.w * 2;
                    settings.height = imageStill.h * 2;
                    switch (imageRunning.stage){
                        case 1:
                            sprite.draw(imageRunning.x, 112, imageRunning.w, imageRunning.h, pos.x - settings.width + pos.offsetX, pos.y - settings.height - pos.offsetY, settings.width, settings.height);
                            if (imageRunning.timeout == imageRunning.maxTimeout){
                                imageRunning.stage = 2;
                                imageRunning.timeout = 0;
                            } else{
                                imageRunning.timeout++;
                            }
                            break;
                        case 2:
                            sprite.draw(imageRunning.x, 152, imageRunning.w, imageRunning.h, pos.x - settings.width + pos.offsetX, pos.y - settings.height - pos.offsetY, settings.width, settings.height);
                            if (imageRunning.timeout == imageRunning.maxTimeout){
                                imageRunning.stage = 3;
                                imageRunning.timeout = 0;
                            } else{
                                imageRunning.timeout++;
                            }
                            break;
                        case 3:
                            sprite.draw(imageRunning.x, 192, imageRunning.w, imageRunning.h, pos.x - settings.width + pos.offsetX, pos.y - settings.height - pos.offsetY, settings.width, settings.height);
                            if (imageRunning.timeout == imageRunning.maxTimeout){
                                imageRunning.stage = 4;
                                imageRunning.timeout = 0;
                            } else{
                                imageRunning.timeout++;
                            }
                            break;
                        case 4:
                            sprite.draw(imageRunning.x, 152, imageRunning.w, imageRunning.h, pos.x - settings.width + pos.offsetX, pos.y - settings.height - pos.offsetY, settings.width, settings.height);
                            if (imageRunning.timeout == imageRunning.maxTimeout){
                                imageRunning.stage = 1;
                                imageRunning.timeout = 0;
                            } else{
                                imageRunning.timeout++;
                            }
                            break;

                        default:
                            break;
                    }
                    break;
                case 2:
                    settings.width = imageJump.w * 2;
                    settings.height = imageStill.h * 2;
                    sprite.draw(imageJump.x, imageJump.y, imageJump.w, imageJump.h, pos.x - settings.width + pos.offsetX, pos.y - settings.height - pos.offsetY, settings.width, settings.height);
                    break;
                case 3:
                    settings.width = imageSlide.w * 2;
                    settings.height = imageSlide.h * 2;
                    sprite.draw(imageSlide.x, imageSlide.y, imageSlide.w, imageSlide.h, pos.x - settings.width + pos.offsetX, pos.y - settings.height - pos.offsetY, settings.width, settings.height);
                    break;
                default:
                    settings.width = imageStill.w * 2;
                    settings.height = imageStill.h * 2;
                    sprite.draw(imageStill.x, imageStill.y, imageStill.w, imageStill.h, pos.x - settings.width + pos.offsetX, pos.y - settings.height - pos.offsetY, settings.width, settings.height);
            }
        };
        var drawStats = function (){

            context.font = "20px SilkscreenBold";
            coin.draw();
            context.fillText("x " + settings.coins, 58, 40);

            heart.draw();
            context.fillText("x " + settings.lives, 58, 80);

            distance = bitwiseRound((moveSpeed / 8) * playTime);
            context.fillText(distance + " M", 20, 110);

            // Draw in health(?) and energy when debugging
            if (debug){
                context.translate(-10, 0);
                context.strokeStyle = "rgba(76, 76, 76, 0.500)";
                context.font = "11px SilkscreenNormal";

                //Labels
                context.fillText("Health", player.pos.x + pos.offsetX - 50, player.pos.y - settings.height - (pos.offsetY + 25));
                context.fillText("Energy", player.pos.x + pos.offsetX - 50, player.pos.y - settings.height - (pos.offsetY + 15));

                //Health
                context.fillStyle = "#41b75f";
                context.fillRect(player.pos.x + pos.offsetX, player.pos.y - settings.height - (pos.offsetY + 30), player.settings.health / 2, 5);
                context.strokeRect(player.pos.x + pos.offsetX, player.pos.y - settings.height - (pos.offsetY + 30), 50, 5);

                //Energy
                context.fillStyle = "#3b7afa";
                context.fillRect(player.pos.x + pos.offsetX, player.pos.y - settings.height - (pos.offsetY + 20), player.settings.energy / 2, 5);
                context.strokeRect(player.pos.x + pos.offsetX, player.pos.y - settings.height - (pos.offsetY + 20), 50, 5);
            }

        };
        var checkBlockEdge = function (edge){
            var connect = 0;
            switch (edge){
                case 1:
                    // Top
                    for (var i = 0; i < blocks.length; i++){
                        var block = blocks[i];
                        if ((pos.y - pos.offsetY) == block.pos.y &&
                            (pos.x + pos.offsetX) >= block.pos.x &&
                            block.pos.x - pos.x - settings.width + pos.offsetX < settings.width &&
                            block.pos.x + block.settings.width > pos.x - settings.width + pos.offsetX){
                            connect = 1;
                        }
                    }
                    break;
                case 2:
                    // Left edge
                    for (var i = 0; i < blocks.length; i++){
                        var block = blocks[i];
                        if ((pos.x + pos.offsetX) == block.pos.x &&
                            block.pos.y + block.settings.height > pos.y - settings.height - pos.offsetY &&
                            block.pos.y - (pos.y - settings.height - pos.offsetY) < settings.height - 4){
                            connect = 2;
                        }
                    }
                    break;
                case 3:
                    // Bottom
                    for (var i = 0; i < blocks.length; i++){
                        var block = blocks[i];
                        if ((pos.y - settings.height - pos.offsetY) == block.pos.y + block.settings.height
                            && (pos.x + pos.offsetX) >= block.pos.x
                            && block.pos.x - pos.x - settings.width + pos.offsetX < settings.width
                            && block.pos.x + block.settings.width > pos.x - settings.width + pos.offsetX){
                            connect = 3;
                        }
                    }
                    break;
                case 4:
                    //Coins
                    for (var i = 0; i < coins.length; i++){
                        var coinBlock = coins[i];
                        if ((pos.x + pos.offsetX - settings.width) <= coinBlock.pos.x + coinBlock.settings.width &&
                            (pos.x + pos.offsetX) >= coinBlock.pos.x &&
                            (pos.y - settings.height - pos.offsetY) <= coinBlock.pos.y + coinBlock.settings.height &&
                            (pos.y + pos.offsetY) >= coinBlock.pos.y){
                            settings.coins++;
                            coinBlock.settings.owner.blockCount--;
                            coins.removeByValue(coinBlock);
                            coinSound.play();

                        }
                    }
                    break;
                default:
                    connect = 0;
            }
            return connect;

        };
        var move = function (){
            if (movement.jumping && settings.energy > 70){
                // Jumping
                if (settings.jumpHeight < settings.maxJumpHeight){
                    pos.offsetY += settings.jumpSpeed;
                    settings.jumpHeight += settings.jumpSpeed;
                    settings.status = 2;
                    playSound("jump");
                } else{
                    movement.jumping = false;
                    if (settings.energy > 0) settings.energy -= 50;
                }
            } else if (pos.offsetY > 0 && checkBlockEdge(1) == 1){
                // On top of block
                settings.jumpHeight = 0;
                settings.status = 1;
                if (settings.energy < 100) settings.energy += settings.energyRegen;
            }
            else if (pos.offsetY > 0 && checkBlockEdge(1) == 0){
                // Falling
                pos.offsetY -= settings.jumpSpeed * 2;
                settings.jumpHeight -= settings.jumpSpeed * 2;
            } else if (pos.offsetY == 0){
                // Standing
                movement.jumping = false;
                settings.jumpHeight = 0;
                settings.status = 1;
                if (settings.energy < 100) settings.energy += settings.energyRegen;
            }
            if (movement.sliding){
                // Sliding
                if (pos.offsetY == 0){
                    settings.status = 3;
                }
            }
            if (checkBlockEdge(2) == 2){
                // Pushed
                if (pos.x + pos.offsetX > 4){
                    pos.offsetX -= moveSpeed;
                    playSound("hit");
                }
                else{
                    pos.offsetX = 0;
                    life("dec");
                }
            }
        };
        var life = function (opt){
            switch (opt){
                case "dec":
                    if (settings.lives > 0)settings.lives--;
                    else{
                        endGame();
                    }
                    if (debug){
                        terminalAppend("-1 Life");
                    }
                    break;
                case "inc":
                    settings.lives++;
                    if (debug){
                        terminalAppend("+1 Life");
                    }
                    break;
            }
        };
        var reset = function (){
            pos.offsetY = 0;
            settings.lifes = 3;
            settings.status = 1;
            settings.coins = 0;
        };
        return {
            imageStill:imageStill,
            imageRunning:imageRunning,
            imageJump:imageJump,
            imageSlide:imageSlide,
            settings:settings,
            movement:movement,
            pos:pos,
            draw:draw,
            drawStats:drawStats,
            check:checkBlockEdge,
            move:move,
            life:life,
            reset:reset
        };
    };

    /**
     *
     * @param x
     * @param y
     * @param owner
     */
    Coin = function (x, y, owner){
        var image = {x:16, y:0, w:16, h:16};
        var pos = {x:x, y:y};
        var settings = {width:32, height:32, owner:owner};
        var draw = function (){
            sprite.draw(image.x, image.y, image.w, image.h, pos.x, pos.y, settings.width, settings.height);
        };
        var checkEdge = function (){
            return !(pos.x <= 0 - settings.width || pos.y <= 0 - settings.height);
        };
        var move = function (){
            pos.x -= moveSpeed;
        };
        return {
            image:image,
            settings:settings,
            pos:pos,
            draw:draw,
            check:checkEdge,
            move:move
        };
    };

    /**
     *
     * @param x
     * @param y
     */
    Heart = function (x, y){
        var image = {x:16, y:17, w:16, h:14};
        var pos = {x:x, y:y};
        var settings = {width:32, height:28};
        var draw = function (){
            sprite.draw(image.x, image.y, image.w, image.h, pos.x, pos.y, settings.width, settings.height);
        };
        return {
            image:image,
            settings:settings,
            pos:pos,
            draw:draw
        };
    };

    /**
     * Types:
     *  1 :: Global sign
     *  2 :: Personal sign
     *
     * @param x
     * @param y
     * @param type
     */
    Item = function (x, y, type){
        var image = {x:16, y:48, w:48, h:32};
        var pos = {x:x, y:y};
        var settings = {width:image.w*2, height:image.h*2, type: type};
        var checkEdge = function (){
            return !(pos.x <= 0 - settings.width || pos.y <= 0 - settings.height);
        };
        var draw = function (){
            switch(settings.type){
                case 1:
                    sprite.draw(image.x, image.y, image.w, image.h, pos.x, pos.y, settings.width, settings.height);
                    break;
                case 2:
                    sprite.draw(image.x, 80, image.w, image.h, pos.x, pos.y, settings.width, settings.height);
                    break;
                default:
                    break;
            }
        };
        var move = function (){
            pos.x -= moveSpeed;
        };
        return {
            image:image,
            settings:settings,
            pos:pos,
            draw:draw,
            check:checkEdge,
            move:move
        };
    };


    /**
     * Type: 1 = Brick
     *       2 = Metal
     *       3 = Glass
     * Layout:
     *      1 = Single Block
     *      2 = Solid Block
     *      3 = Stairs Both Sides
     *      4 = Stair Left
     *      5 = Stair Right
     * @param x
     * @param y
     * @param type
     * @param layout
     * @param nW
     * @param nH
     */
    Structure = function (x, y, type, layout, nW, nH){
        var ID = function (blockCount){
            var blockCount = blockCount;
            return {
                blockCount:blockCount
            };
        };
        var pos = {x:x, y:y};
        var layout = {layout:layout, type:type, width:blockSize * nW, height:blockSize * nH, blockCount:0};
        var id = new ID(1);
        var offset = 0;
        switch (layout.layout){
            case 1:
                // Single Block
                blocks.push(new Block(pos.x, pos.y, layout.type, id));
                layout.blockCount++;
                break;
            case 2:
                // Block Custom Solid
                var numWide = nW;
                var numHigh = nH;
                for (var i = 0; i < numWide; i++){
                    // ADD ROWS
                    for (var j = 0; j < numHigh; j++){
                        // ADD COLS
                        if (nH >= 2){
                            offset = blockSize
                        }
                        blocks.push(new Block(pos.x + (i * blockSize), pos.y - ((j * blockSize) + offset), layout.type, id));
                        layout.blockCount++;
                    }
                }
                id.blockCount = layout.blockCount;
                break;
            case 3:
                // Block Custom Steps Both
                var numWide = nW;
                var numHigh = nH;
                var step = 0;
                for (var j = 0; j < numHigh; j++){
                    // ADD ROWS
                    if (j > 0) step++;
                    if (j > 0) numWide--;
                    for (var i = 0; i < numWide; i++){
                        // ADD COLS
                        if (i > step){
                            blocks.push(new Block(pos.x + (i * blockSize), pos.y - (j * blockSize), layout.type, id));
                            layout.blockCount++;
                        }

                    }
                }
                id.blockCount = layout.blockCount;
                break;
            case 4:
                // Block Custom Steps Left
                var numWide = nW;
                var numHigh = nH;
                var step = 0;
                for (var j = 0; j < numHigh; j++){
                    // ADD ROWS
                    if (j > 0) step++;
                    for (var i = 0; i < numWide; i++){
                        // ADD COLS
                        if (i > step){
                            blocks.push(new Block(pos.x + (i * blockSize), pos.y - (j * blockSize), layout.type, id));
                            layout.blockCount++;
                        }

                    }
                }
                id.blockCount = layout.blockCount;
                break;
            case 5:
                //Coins
                var numWide = nW;
                var numHigh = nH;
                for (var i = 0; i < numWide; i++){
                    // ADD ROWS
                    for (var j = 0; j < numHigh; j++){
                        // ADD COLS
                        coins.push(new Coin(pos.x + (i * blockSize), pos.y - ((j * blockSize) + offset), id));
                        layout.blockCount++;
                    }
                }
                id.blockCount = layout.blockCount;
                break;
            case 6:
                // Block Custom Steps Right
                var numWide = nW;
                var numHigh = nH;
                var step = numWide;
                for (var j = 0; j < numHigh; j++){
                    // ADD ROWS
                    if (j > 0) numWide--;
                    for (var i = 0; i < numWide; i++){
                        // ADD COLS
                        if (nH >= 2){
                            offset = blockSize
                        }
                        blocks.push(new Block(pos.x + (i * blockSize), pos.y - ((j * blockSize) + offset), layout.type, id));
                        layout.blockCount++;
                    }
                }
                id.blockCount = layout.blockCount;
                break;
            default:
                blocks.push(new Block(pos.x, pos.y, layout.type, id));
                layout.blockCount++;
        }
        return {
            pos:pos,
            id:id,
            layout:layout,
            offset:offset
        };

    };

    /**
     * Type: 1 = Brick
     *       2 = Metal
     *       3 = Glass
     * @param x
     * @param y
     * @param type
     * @param owner
     */
    Block = function (x, y, type, owner){
        var image = {x:80, y:(16 * type), w:16, h:16};
        var pos = {x:x, y:y};
        var settings = {width:blockSize, height:blockSize, type:type, owner:owner};
        if (!type){
            settings.type = 1;
        }
        var draw = function (){
            // Single Block
            sprite.draw(image.x, image.y, image.w, image.h, pos.x, pos.y, settings.width, settings.height);
            if (debug && settings.type){
                context.font = "20px 800 Arial";
                context.fillText(settings.type, pos.x + 4, pos.y + 10);
            }
        };
        var checkEdge = function (){
            //4 * block width, so left hand side bug is fixed.
            return !(pos.x <= 0 - ((settings.width*4)+(settings.width/2))|| pos.y <= 0 - settings.height);
        };
        var move = function (){
            pos.x -= moveSpeed;
        };
        return {
            image:image,
            pos:pos,
            settings:settings,
            draw:draw,
            check:checkEdge,
            move:move
        };
    };

    Cloud = function (x, y){
        var image = {w:41, h:21, x:36, y:0};
        var type = randomFromTo(0, 1);
        if (type == 1){
            image.y = 22
        } else{
            image.y = 0
        }
        var pos = {x:x, y:y, offsetx:0, offsety:0, speed:moveSpeed / 10};
        var settings = {width:81, height:42};
        var draw = function (){
            sprite.draw(image.x, image.y, image.w, image.h, pos.x + pos.offsetx, pos.y + pos.offsety, settings.width, settings.height);
        };
        var move = function (){
            pos.offsetx -= pos.speed;
            if ((pos.x + pos.offsetx + settings.width) <= 0){
                pos.offsetx += canvasWidth + settings.width;
                pos.offsety = randomFromTo(-42, 42);
                if (pos.offsety + pos.y < 0) pos.offsety = 0;
                type = randomFromTo(0, 1);
                //pos.speed = randomFromTo(0,1);

            }
        };
        return {
            image:image,
            settings:settings,
            pos:pos,
            move:move,
            draw:draw
        };
    };

    /**
     * Create object instances
     */
    var sprite = new Sprites("img/sprites.gif");
    var player = new Player(initialPlayerLocation, floorHeight);
    var coin = new Coin(20, 20);
    var heart = new Heart(20, 58);

    console.log(blocks.length);
    if (debug){
        terminalAppend(blocks.length);
    }

    var clouds = [];
    var cloudCount = 4;
    for (var i = 0; i < cloudCount; i++){
        var x = randomFromTo(0, canvasWidth);
        var y = randomFromTo(10, 42);
        var cloud = new Cloud(x, y);
        clouds.push(cloud);
    }

    /**
     * Draws everything together.
     */
    function render(){
        // Clear the frame
        context.save();
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.restore();

        // Levels

        if(level < 8){
            level =  bitwiseRound(distance/125);
        }
        // Do something if key is pressed
        if (touchable && touches.length > 0){
        }
        if (rightKey){
            //player.pos.offsetX += moveSpeed;
        }
        if (leftKey){
            //player.pos.offsetX -= moveSpeed;
        }
        if (upKey){
            if (player.check(3) != 3){
                if (player.movement.sliding){
                    player.movement.sliding = false;
                }
                if (player.settings.jumpHeight == 0 && player.settings.energy == 100) player.movement.jumping = true;
            }
        }
        if (downKey){
            player.movement.sliding = true;
        }
        if (space){
            if (player.check(3) != 3){
                if (player.movement.sliding){
                    player.pos.offsetX -= player.settings.width;
                    player.movement.sliding = false;
                }
                if (player.settings.jumpHeight == 0 && player.settings.energy == 100) player.movement.jumping = true;
            }
        }

        // Check Coins
        if (coins.length > 0){
            player.check(4);
        }
        if (player.settings.coins >= 20){
            player.life("inc");
            player.settings.coins = 0;
        }
        //Draw Clouds
        context.save();
        for (var i = 0; i < clouds.length; i++){
            var cloud = clouds[i];
            cloud.draw();
            cloud.move();
        }
        context.restore();

        //Draw items (such as score sign posts)
        for (var i = 0; i < items.length; i++){
            var item = items[i];
            //check if its on screen, if not remove.
            if(!item.check()){
                items.removeByValue(item);
            }
            if (item){
                item.draw();
                item.move();
            }
        }

        // Move the player
        player.move();

        // Draw in player stats
        context.save();
        player.drawStats();
        context.restore();

        // Draw in Player
        context.save();
        player.draw();
        context.restore();

        //Draw structures
        context.save();
        addRemoveStructures();
        for (var i = 0; i < blocks.length; i++){
            var block = blocks[i];
            if (block){
                if (!block.check()){
                    block.settings.owner.blockCount--;
                    /* Dont remove block due to error where blocks shifted position  */
                    // blocks.removeByValue(block);
                }
                else{
                    block.draw();
                    block.move();
                }
            }
        }

        //Draw coins
        for (var i = 0; i < coins.length; i++){
            var coinBlock = coins[i];
            if (coinBlock){
                coinBlock.draw();
                if (!coinBlock.check()){
                    coinBlock.settings.owner.blockCount--;
                    coins.removeByValue(coinBlock);
                }
                else coinBlock.move();
            }
        }
        context.restore();

        //Update Timer
        playTime++;

        if(globalHigh == distance){
            items.push(new Item(canvasWidth, floorHeight - 64, 1));
        }
        if(personalHigh == distance){
            items.push(new Item(canvasWidth, floorHeight - 64, 2));
        }
    }

    /**
     * Adds structures if less that specified count.
     * Removes structures if they contain no blocks.
     */
    function addRemoveStructures(){
        if (structures.length < structureCount && spacing >= structureSpacing){
            var ranType = randomFromTo(1, 3);
            var ranLayout = bitwiseRound(Math.random() * 5);
            var ranHeight = bitwiseRound(Math.random() * level);
            var ranWidth = bitwiseRound(Math.random() * level);
            structures.push(
                new Structure(canvasWidth, floorHeight - 32, ranType, ranLayout, ranWidth, ranHeight)
            );

            if (debug){
                terminalAppend("Added Structure. Layout :: " + ranLayout + ", Block Count ::" + (ranWidth * ranHeight) + "(" + ranWidth + "x" + ranHeight + ")");
            }
            spacing = -(ranWidth * blockSize);
        } else if (spacing < structureSpacing) spacing++;
        if (structures.length >= structureCount){
            for (var i = 0; i < structures.length; i++){
                var structure = structures[i];
                if (structure.id.blockCount <= 0){
                    structures.removeByValue(structure);
                    if (debug){
                        terminalAppend("Removed Structure. Array loc. ::  " + i);
                    }
                }
            }
        }
    }

    /**
     * Plays specified sound
     * @param name
     */
    function playSound(name){
        if (!muted) switch (name){
            case "background":
                backgroundSound.play();
                break;
            case "jump":
                //jumpSound.currentTime = 0;
                jumpSound.play();
                break;
            case "hit":
                hitSound.play();
                break;
            case "coin":
                coinSound.currentTime = 0;
                coinSound.play();
                break;
            case "levelup":
                levelupSound.currentTime = 0;
                levelupSound.play();
                break;
            default:

        }
    }

    /**
     * Reset Game
     */
    function resetAll(){
        playTime = 0;
        player = new Player(initialPlayerLocation, floorHeight);
        structures = [];
        blocks = [];
        moveSpeed = 4;
        spacing = 50;
        distance = 0;
        score = 0;
        updateHighScore();
        //Update UI
        scoreOut.html(score + " meters");

        // Clear the frame
        context.save();
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.restore();

        if (debug){
            terminalAppend("Reset Stats");
        }
    }

    /**
     * End the game
     */
    function endGame(){
        // Move distance to a score
        score = distance;
        saveHighScore();
        updateHighScore();

        // Assign score to a temporary var.
        var tmpScore = score;
        score = 0;
        scoreOut.html(score + " meters");
        overScoreOut.html(tmpScore);

        playGame = false;
        gameOver = true;
    }

    function saveHighScore(){
        if (Modernizr.localstorage){
            if (score > highScore){
                terminalAppend("New High Score");
                localStorage.setItem('highScore', score);
                newhighScore.show();
            }
        }
        if (connected){
            updateOnlineScore();
        }
    }

    function updateHighScore(){
        if (Modernizr.localstorage && localStorage.getItem('highScore')){
            highScoreOut.html(localStorage.getItem('highScore') + " meters <span class='offline'>(offline)</span>");
            highScore = localStorage.getItem('highScore');
            personalHigh = highScore;
        } else{
            highScoreOut.html("0 meters (offline)");
        }
        if (connected){
            $.ajax({
                type:"POST",
                cache: false,
                data:"name=" + twitter_username,
                url:"php/ajax/getHighScore.php",
                success:function (html){
                    highScoreOut.html(html + " meters <span class='offline'>(online)</span>");
                    personalHigh = html;
                }
            });
        }
    }

    function updateOnlineScore(){
        updatingScores.show();
        $.ajax({
            type:"POST",
            cache: false,
            data:"score=" + score + "&name=" + twitter_username,
            url:"php/ajax/sendScore.php",
            success:function (html){
                if (html != "Failed" || html != "Invalid data"){
                    terminalAppend("SUBMITTED TO ONLINE HIGHSCORE!");
                    updatingScores.hide();
                    highList.html(html);
                    /*$.ajax({
                     url: "php/ajax/updateScores.php",
                     success: function(html){
                     highList.html(html);
                     }
                     });*/
                }
            }

        });
        if (debug) terminalAppend("Updating Online Scores");
    }

    if (connected) terminalAppend("Twitter Username: " + twitter_username);

    /**
     * Turn on debug options and display FPS
     */
    function debugMode(){

        debug = !debug;
        if (debug){
            terminalAppend("DEBUG ENABLED");
            $('.toggleDebug').removeClass('muted');
        } else $('.toggleDebug').addClass('muted');

        if (!stats){
            stats = new Stats();

            // Align top-left
            stats.getDomElement().style.position = 'absolute';
            stats.getDomElement().style.left = '0px';
            stats.getDomElement().style.top = '0px';

            document.body.appendChild(stats.getDomElement());
            setInterval(function (){
                stats.update();
            }, 1000 / 60);
        }
    }

    function toggleSound(){
        if(!muted){
            muted = true;
            $('.toggleSound').addClass('muted');
            if(debug) terminalAppend("Sound Off");
        }else{
            muted = false;
            $('.toggleSound').removeClass('muted');
            if(debug) terminalAppend("Sound On");
        }
    }

    /**
     * Append messages to a console div.
     * @param msg
     */
    function terminalAppend(msg){
        $('#log').append("> " + msg + "\n");
        $('#log').animate({ scrollTop:$('#log').prop("scrollHeight") - $('#log').height() }, 400);
    }

    /**
     * When play button is pressed
     */
    playButton.on("click touchend", (function (event){
        resetAll();
        playGame = true;
        pause = false;
        gameOver = false;
        uiStart.hide();
        uiPause.hide();
        uiOver.hide();
    }));

    /**
     * When play button is pressed
     */
    continueButton.on("click touchend", (function (event){
        playGame = true;
        pause = false;
        gameOver = false;
        uiStart.hide();
        uiPause.hide();
        uiOver.hide();
    }));

    exitButton.on("click touchend", (function (event){
        resetAll();
        playGame = false;
        pause = false;
        gameOver = false;
        uiStart.show();
        uiPause.hide();
        uiOver.hide();
    }));

    $('.togglePause').toggle(function (){
        pause = true;
    }, function (){
        pause = false;
    });

    /**
     * When sound button is pressed
     */
    $('.toggleSound').on("click touchend", toggleSound);

    /**
     * When full screen button is pressed
     */
    $('.toggleFullScreen').toggle(function (){
        toggleFullScreen();
        $(this).removeClass('fullscreen_alt');
        $(this).addClass('fullscreen_exit_alt');
    }, function (){
        toggleFullScreen();
        $(this).removeClass('fullscreen_exit_alt');
        $(this).addClass('fullscreen_alt');
    });

    /**
     * When debug button is pressed
     */
    $('.toggleDebug').toggle(function (){
        debugMode();
    }, function (){
        debugMode();
    });

    /**
     * This puts the viewport into true fullscreen mode
     * NOTE: Only supported by some broswers
     * Code is taken from Firefox online Fullscreen API documentation
     */
    function toggleFullScreen(){
        if ((document.fullScreenElement && document.fullScreenElement !== null) || // alternative standard method
            (!document.mozFullScreen && !document.webkitIsFullScreen)){               // current working methods
            if (document.documentElement.requestFullScreen){
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen){
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen){
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else{
            if (document.cancelFullScreen){
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen){
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen){
                document.webkitCancelFullScreen();
            }
        }
    }

    function outOfFocus(){
        if (playGame) pause = true;
        if (debug) terminalAppend("Window went out of focus");
    }

    /******
     * Controls functions
     ******/

    /**
     * Sets correct key to true
     * @param evt
     */
    function onKeyDown(evt){
        evt.preventDefault();
        if (evt.keyCode === 39) rightKey = true;
        else if (evt.keyCode === 37) leftKey = true;
        if (evt.keyCode === 38) upKey = true;
        else if (evt.keyCode === 40) downKey = true;
        if (evt.keyCode === 32) space = true;
        if (evt.keyCode === 112) debugMode();
        if (evt.keyCode === 80) if (!pause)pause = true;
        if(evt.keyCode == 83) toggleSound();


    }

    /**
     * Sets correct key to false
     * @param evt
     */
    function onKeyUp(evt){
        if (evt.keyCode === 39) rightKey = false;
        else if (evt.keyCode === 37) leftKey = false;
        if (evt.keyCode === 38) upKey = false;
        else if (evt.keyCode === 40) downKey = false;
        if (evt.keyCode === 32) space = false;
    }

    /**
     * When the mouse press is up, store the values of x & y of the action.
     * @param e
     */
    function mouseUp(e){
        if (!e) var e = event;
        e.preventDefault();

        downKey = upKey = false;

    }

    /**
     * If mouse press is down, make store x & y of press.
     * @param e
     */
    function mouseDown(e){
        if (!e) var e = event;
        e.preventDefault();
        if (e.button == 2) //right click
        {

            if (debug){
                terminalAppend("Right Click");
            }
            downKey = true;
        }
        else //left click
        {
            if (debug){
                terminalAppend("Left Click");
            }
            upKey = true;
        }

    }

    /**
     * Function to call when touches are first detected
     * @param e
     */
    function onTouchStart(e){
        e.preventDefault();
        touches = e.touches;
        if(touches.length > 1){
            downKey = true;
        }else upKey = true;
    }

    /**
     * Function call when touchs are moved
     * @param e
     */
    function onTouchMove(e){
        e.preventDefault();
        touches = e.touches;
    }

    /**
     * Function to call as touch detection ends
     * @param e
     */
    function onTouchEnd(e){
        touches = e.touches;
        upKey = false;
        downKey = false;
    }


    /**
     * Floors a number with better performance the Math.Floor().
     * @param number
     */
    function bitwiseRound(number){
        var rounded = ~~(0.5 + number);
        return rounded;
    }


    /**
     * Generate a random number between 2 numbers.
     * @param from
     * @param to
     */
    function randomFromTo(from, to){
        return bitwiseRound(Math.random() * (to - from + 1) + from);
    }

    /**
     * Initialise keyboard and touch controls
     */
    $(document).ready(function (){
        if (touchable){
            window.document.addEventListener('touchstart', onTouchStart, false);
            window.document.addEventListener('touchmove', onTouchMove, false);
            window.document.addEventListener('touchend', onTouchEnd, false);
            window.document.addEventListener("orientationChanged", render);
            window.document.addEventListener("touchcancel", onTouchEnd, false);
        } else{
            $(document).keydown(onKeyDown);
            $(document).keyup(onKeyUp);
            document.getElementById("myCanvas").addEventListener("mousedown", mouseDown, false);
            document.body.addEventListener("mouseup", mouseUp, false);

            if (/*@cc_on!@*/false){ // check for Internet Explorer
                document.onfocusout = outOfFocus;
            } else{
                window.onblur = outOfFocus;
            }
        }
    });

    function startGame(){
        requestAnimationFrame(startGame);

        if (debug) debugUI.show();
        else debugUI.hide();

        if (playGame){
            if (pause){
                uiPause.show();
            } else{
                render();
            }
        }
        else if (gameOver) uiOver.show();
        else uiStart.show();

    }

    render();
    startGame();


});