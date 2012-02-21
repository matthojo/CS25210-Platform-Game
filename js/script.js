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
     * UI Elements
     */
    var uiStart = $(".start"), uiPause = $(".paused"), uiOver = $(".gameOver"), playButton = $(".playGame");
    //sprite.src = '/img/sprite.gif'; // Set source path

    /**
     * Game UI Settings
     */
    if("mozImageSmoothingEnabled" in context){
        context.mozImageSmoothingEnabled = false;
    }
    var structures = [];
    var blocks = [];
    var moveSpeed = 0.2;
    var blockSize = 32;
    var floorHeight = canvasHeight - 49;

    /**
     * Objects
     */

    var Sprites, Player, Enemy, Coin, Heart, Item, Cloud, Structure, Block;

    Sprites = function(){
        var sprite = [new Image(), false];

        sprite[0].src = "img/sprites.gif";
        sprite[0].onload = function() {
            sprite[1] = true;
        };

        var draw = function(sx,sy, sWidth, sHeight, dx, dy, dWidth, dHeight){
            if(sprite[1]){
                context.drawImage(sprite[0], sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                if(debug){
                    context.beginPath();
                    context.strokeRect(dx, dy, dWidth, dHeight);
                    context.strokeStyle = "#ff00d7";
                    context.closePath();
                }
            }
        };

        return {
            draw: draw
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
    Player = function(x,y){
        var image = {x:16, y:0, w: 16, h:16};
        var pos = {x:x,y:y};
        var settings = {width: 32, height: 32, health: 100, status: 0, lives: 3};
        var draw = function(){
            switch(settings.status){
                case 0:
                    sprite.draw(image.x,image.y, image.w, image.h, pos.x, pos.y, settings.width, settings.height);
                    break;
                case 1:
                    sprite.draw(image.x,image.y, image.w, image.h, pos.x, pos.y, settings.width, settings.height);

                    break;
                case 2:
                    sprite.draw(image.x,image.y, image.w, image.h, pos.x, pos.y, settings.width, settings.height);

                     break;
                case 3:
                    sprite.draw(image.x,image.y, image.w, image.h, pos.x, pos.y, settings.width, settings.height);

                    break;
                default:
                    sprite.draw(image.x,image.y, image.w, image.h, pos.x, pos.y, settings.width, settings.height);
            }
        };
        var move = function(direction){
            pos.offsetx -= moveSpeed;
            if((pos.x+pos.offsetx+settings.width) <= 0){
                pos.offsetx += canvasWidth+settings.width;
                pos.offsety = randomFromTo(-42, 42);
                if(pos.offsety+pos.y < 0) pos.offsety = 0;

            }
        };
        return {
            image: image,
            settings: settings,
            pos: pos,
            draw: draw,
            move: move
        };
    };

    Coin = function(x,y){
        var image = {x:16, y:0, w: 16, h:16};
        var pos = {x:x,y:y};
        var settings = {width: 32, height: 32};
        var draw = function(){
            sprite.draw(image.x,image.y, image.w, image.h, pos.x, pos.y, settings.width, settings.height);
        };
        return {
            image: image,
            settings: settings,
            pos: pos,
            draw: draw
        };
    };

    Heart = function(x,y){
        var image = {x:16, y:17, w: 16, h:14};
        var pos = {x:x,y:y};
        var settings = {width: 32, height: 28};
        var draw = function(){
            sprite.draw(image.x,image.y, image.w, image.h, pos.x, pos.y, settings.width, settings.height);
        };
        return {
            image: image,
            settings: settings,
            pos: pos,
            draw: draw
        };
    };
    /**
     * Type: 1 = Brick
     *       2 = Metal
     *       3 = Glass
     * Layout:
     *      1 = Single Block
     *      2 = Solid Block
     *      3 = Stair Right
     *      4 = Stair Left
     *      5 = Stairs Both Sides
     * @param x
     * @param y
     * @param type
     * @param layout
     * @param nW
     * @param nH
     */
    Structure = function(x,y,type,layout,nW,nH){
        var pos = {x:x,y:y};
        var layout = {layout: layout, type: type, width: blockSize*nW, height:blockSize*nH};
        switch(layout.layout){
            case 1:
                // Single Block
                blocks.push(new Block(pos.x,pos.y,layout.type,this));
                break;
            case 2:
                // Block Custom Solid
                var numWide = nW;
                var numHigh = nH;
                for (var i = 0; i < numWide; i++) {
                    // ADD ROWS
                    for (var j = 0; j < numHigh; j++) {
                        // ADD COLS
                        blocks.push(new Block(pos.x+(i*blockSize),pos.y-(j*blockSize),layout.type,this));
                    }
                }
                break;
            case 3:
                // Block Custom Steps Right
                var numWide = nW;
                var numHigh = nH;
                var step = numWide;
                for (var j = 0; j < numHigh; j++) {
                    // ADD ROWS
                    if(j > 0) numWide--;
                    for (var i = 0; i < numWide; i++) {
                        // ADD COLS
                        blocks.push(new Block(pos.x+(i*blockSize),pos.y-(j*blockSize),layout.type,this));

                    }
                }
                break;
            case 4:
                // Block Custom Steps Right
                var numWide = nW;
                var numHigh = nH;
                var step = 0;
                for (var j = 0; j < numHigh; j++) {
                    // ADD ROWS
                    if(j > 0) step++;
                    for (var i = 0; i < numWide; i++) {
                        // ADD COLS
                        if(i > step) blocks.push(new Block(pos.x+(i*blockSize),pos.y-(j*blockSize),layout.type,this));

                    }
                }
                break;
            case 5:
                // Block Custom Steps Right
                var numWide = nW;
                var numHigh = nH;
                var step = 0;
                for (var j = 0; j < numHigh; j++) {
                    // ADD ROWS
                    if(j > 0) step++;
                    if(j > 0) numWide--;
                    for (var i = 0; i < numWide; i++) {
                        // ADD COLS
                        if(i > step) blocks.push(new Block(pos.x+(i*blockSize),pos.y-(j*blockSize),layout.type,this));

                    }
                }
                break;
            default:
                blocks.push(new Block(pos.x,pos.y,layout.type,this));
        }
        return {
            pos: pos,
            layout: layout,
            draw: draw
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
    Block = function(x,y,type, owner){
        var image = {x:80, y:(16*type), w: 16, h:16};
        var pos = {x:x,y:y};
        var settings = {width: blockSize, height: blockSize, type: type, owner: owner};
        var draw = function(){
                // Single Block
                sprite.draw(image.x,image.y, image.w, image.h, pos.x, pos.y, settings.width, settings.height);
        };
        return {
            image: image,
            pos: pos,
            settings: settings,
            draw: draw
        };
    };

    Cloud = function(x,y){
        var image = {w: 41, h:21, x:36, y:0};
        var type = randomFromTo(0,1);
        if(type==1){
            image.y = 22
        }else{
            image.y = 0
        }
        var pos = {x:x,y:y, offsetx:0, offsety:0, speed: 0};
        var settings = {width: 81, height: 42};
        var draw = function(){
            sprite.draw(image.x,image.y, image.w, image.h, pos.x+pos.offsetx, pos.y+pos.offsety, settings.width, settings.height);
        };
        var move = function(){
            pos.offsetx -= moveSpeed+pos.speed;
            if((pos.x+pos.offsetx+settings.width) <= 0){
                pos.offsetx += canvasWidth+settings.width;
                pos.offsety = randomFromTo(-42, 42);
                if(pos.offsety+pos.y < 0) pos.offsety = 0;
                type = randomFromTo(0,1);
                //pos.speed = randomFromTo(0,1);

            }
        };
        return {
            image: image,
            settings: settings,
            pos: pos,
            move: move,
            draw: draw
        };
    };
    /**
     * Create object instances
     */
    var sprite = new Sprites();
    var coin = new Coin(20, 20);
    var heart = new Heart(20, 58);
    structures.push(
        new Structure(50, floorHeight-32,1,2,2,2)
    );
    console.log(blocks.length);
    //var block2 = new Block(84, floorHeight-32, 2,1);
    //var block3 = new Block(118, floorHeight-32, 3,1);

    var clouds = [];
    var cloudCount = 4;
    for(var i=0;i<cloudCount; i++){
        var x = randomFromTo(0, canvasWidth);
        var y = randomFromTo(10, 42);
        var cloud = new Cloud(x, y);
        clouds.push(cloud);
    }

    /**
     * Draws everything together.
     */
    function draw() {
        // Clear the frame
        context.save();
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.restore();

        // Do something if key is pressed
        if (touchable && touches.length > 0) {
        }
        if (rightKey) {
        }
        if (leftKey) {
        }
        if (upKey) {
        }
        if(downKey){
        }
        if(space){
        }


        //Draw Clouds
        context.save();
        for(var i=0; i< clouds.length; i++){
            var cloud = clouds[i];
            cloud.draw();
            cloud.move();
        }
        context.restore();

        context.save();
        coin.draw();
        heart.draw();
        for(var i=0;i<blocks.length; i++){
            var block = blocks[i];
            block.draw();
        }
        //block2.draw();
        //block3.draw();
        context.restore();

    }

    /**
     * End the game
     */
    function endGame() {
        playGame = false;
        gameOver = true;
    }

    /**
     * Turn on debug options and display FPS
     */
    function debugMode() {

        if(!debug){

            var stats = new Stats();

            // Align top-left
            stats.getDomElement().style.position = 'absolute';
            stats.getDomElement().style.left = '0px';
            stats.getDomElement().style.top = '0px';

            document.body.appendChild(stats.getDomElement());
            setInterval(function () {
                stats.update();
            }, 1000 / 60);
            debug = true;

        }
    }

    /******
     * Controls functions
     ******/

    /**
     * Sets correct key to true
     * @param evt
     */
    function onKeyDown(evt) {
        evt.preventDefault();
        if (evt.keyCode === 39) rightKey = true;
        else if (evt.keyCode === 37) leftKey = true;
        if (evt.keyCode === 38) upKey = true;
        else if (evt.keyCode === 40) downKey = true;
        if (evt.keyCode === 32) space = true;
        if(evt.keyCode === 112) debugMode();
        if(evt.keyCode === 80) if(!pause)pause=true;

    }

    /**
     * Sets correct key to false
     * @param evt
     */
    function onKeyUp(evt) {
        if (evt.keyCode === 39) rightKey = false;
        else if (evt.keyCode === 37) leftKey = false;
        if (evt.keyCode === 38) upKey = false;
        else if (evt.keyCode === 40) downKey = false;
        if (evt.keyCode === 32) space = false;
    }

    /**
     * Function to call when touches are first detected
     * @param e
     */
    function onTouchStart(e) {
        e.preventDefault();
        touches = e.touches;
        upKey = true;
    }

    /**
     * Function call when touchs are moved
     * @param e
     */
    function onTouchMove(e) {
        e.preventDefault();
        touches = e.touches;
    }

    /**
     * Function to call as touch detection ends
     * @param e
     */
    function onTouchEnd(e) {
        touches = e.touches;
        upKey = false;
    }

    /**
     * When play button is pressed
     */
    playButton.on("click touchend",(function(event){
        playGame = true;
        pause = false;
        gameOver = false;
        uiStart.hide();
        uiPause.hide();
        uiOver.hide();
    }));

    /**
     * When sound button is pressed
     */
    $('#toggleSound').toggle(function () {
        muted = true;
        $(this).addClass('muted');
    }, function () {
        muted = false;
        $(this).removeClass('muted');
    });

    /**
     * When full screen button is pressed
     */
    $('#toggleFullScreen').toggle(function () {
        toggleFullScreen();
        $(this).removeClass('fullscreen_alt');
        $(this).addClass('fullscreen_exit_alt');
    }, function () {
        toggleFullScreen();
        $(this).removeClass('fullscreen_exit_alt');
        $(this).addClass('fullscreen_alt');
    });

    /**
     * This puts the viewport into true fullscreen mode
     * NOTE: Only supported by some broswers
     * Code is taken from Firefox online Fullscreen API documentation
     */
    function toggleFullScreen() {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {               // current working methods
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }


    /**
     * Floors a number with better performance the Math.Floor().
     * @param number
     */
    function bitwiseRound(number){
        var rounded = ~~ (0.5 + number);
        return rounded;
    }


    /**
     * Generate a random number between 2 numbers.
     * @param from
     * @param to
     */
    function randomFromTo(from, to) {
        return bitwiseRound(Math.random() * (to - from + 1) + from);
    }

    /**
     * Initialise keyboard and touch controls
     */
    $(document).ready(function () {
        if (touchable) {
            window.document.addEventListener('touchstart', onTouchStart, false);
            window.document.addEventListener('touchmove', onTouchMove, false);
            window.document.addEventListener('touchend', onTouchEnd, false);
            window.document.addEventListener("orientationChanged", draw);
            window.document.addEventListener("touchcancel", onTouchEnd, false);
        } else {
            $(document).keydown(onKeyDown);
            $(document).keyup(onKeyUp);
        }
    });

    function startGame() {
        requestAnimationFrame(startGame);
        if(playGame){
            if(pause){
                uiPause.show();
            }else{
                draw();
            }
        }else if(gameOver){
            uiOver.show();
        }else{
            uiStart.show();
        }
    }
    draw();
    startGame();


});



