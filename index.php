<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');
include 'php/settings.php';
include 'php/classes/twitter.php';
include 'php/classes/functions.php';
?>
<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!-- Consider adding a manifest.appcache: h5bp.com/d/Offline -->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
    <meta charset="utf-8">

    <!-- Use the .htaccess and remove these lines to avoid edge case issues.
 More info: h5bp.com/b/378 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title>Platform Game</title>
    <meta name="description" content="">

    <!-- Mobile viewport optimized: h5bp.com/viewport -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="width=device-width,height=device-height, initial-scale=1, maximum-scale=1" />

    <!-- Place favicon.ico and apple-touch-icon.png in the root directory: mathiasbynens.be/notes/touch-icons -->
    <link rel="stylesheet" href="css/style.css">

    <!-- All JavaScript at the bottom, except this Modernizr build incl. Respond.js
Respond is a polyfill for min/max-width media queries. Modernizr enables HTML5 elements & feature detects;
for optimal performance, create your own custom Modernizr build: www.modernizr.com/download/ -->
    <script src="js/libs/modernizr-2.0.6.min.js"></script>
</head>

<body>
<div class="container">
    <div class="higherContent content">
        <div class="title logo logoBlack">Runner Man, Platform Game of Doom!</div>
        <div class="navBar">
            <ul>
                <li class="active">Home</li>
                <li><a href="about.html" title="About">About</a></li>
            </ul>
        </div>
    </div>
    <div class="middleContent content">
        <div class="highTable">
            <h3>Online High Scores</h3>
            <ol class="highList">
                <?php getScores(); ?>
            </ol>
        </div>
        <div class="interface">
            <section class="options">
                <ul>
                    <li class="togglePause">Pause / View Controls</li>
                    <li class="toggleSound">Toggle Sound</li>
                    <li class="toggleFullScreen">Toggle Fullscreen</li>
                    <li class="toggleDebug muted">Debug</li>
                </ul>
            </section>
            <canvas id="myCanvas" oncontextmenu="return false;">
                This is not working.
            </canvas>

            <div class="debug" id="console">
                <pre id="log"></pre>
            </div>

            <section class="menu start">
                <div class="content">
                    <div class="logo">Runner Man, Platform Game of Doom!</div>
                    <div class="touchControls">
                        <ul>
                            <li>Single Finger = Jump</li>
                            <li>Multiple Fingers = Slide</li>
                        </ul>
                    </div>
                    <?php if (isset($_SESSION['access_token'])) : ?>
                    <p class="label">Logged in as:</p>
                    <span class="twitter_username"><?php echo $username ?></span>
                    <?php endif; ?>
                    <p class="label high">High Score: </p>
                    <span class="highScore">0 meters</span>
                    <?php if (isset($_SESSION['access_token'])) : ?>
                    <a class="btn OldSkool btn-large btn-info playGame">Play Connected</a>
                    <p class="or">or</p>
                    <a href="?wipe=1" class="btn OldSkool btn-large btn-info">Logout</a>
                    <?php else : ?>
                    <a href="?authenticate=1" class="btn OldSkool twitter btn-large btn-info">Login via Twitter to Play</a>
                    <p class="or">or</p>
                    <a class="btn OldSkool btn-large btn-info playGame">Play Offline</a>
                    <?php endif; ?>
                </div>
            </section>
            <section class="menu paused">
                <div class="content">
                    <div class="logo">Runner Man, Platform Game of Doom!</div>
                    <h1>Paused</h1>
                    <div class="controls">
                        <ul>
                            <li>Up Arrow / Space = Jump</li>
                            <li>Down Arrow = Slide</li>
                            <li>P = Pause</li>
                            <li>F1 = Toggle Debug Mode</li>
                        </ul>
                        <hr />
                        <ul>
                            <li>Left Mouse Button = Jump</li>
                            <li>Right Mouse Button = Slide</li>
                        </ul>
                    </div>
                    <a class="btn OldSkool btn-large btn-info continueGame">Continue</a>
                    <a class="btn OldSkool btn-large btn-info exitGame">Quit Game</a>
                </div>
            </section>
            <section class="menu gameOver">
                <div class="content">
                    <div class="logo">Runner Man, Platform Game of Doom!</div>
                    <h1>Game Over!</h1>
                    <div class="scoreIt">
                        <span class="updatingScores" style="display: none">UPDATING HIGH SCORES</span>
                        <span>Score:</span><span class="scored">0 meters</span>
                        <div class="newHighScore">New High Score!</div>
                    </div>
                    <a class="btn OldSkool btn-large btn-info playGame">Play Again</a>
                    <a class="btn OldSkool btn-large btn-info exitGame">Back to menu</a>
                </div>
            </section>
        </div>
        <div class="clearfix"></div>
    </div>
    <div class="lowerContent content">
    </div>

    <!--<audio id="backgroundSound" loop="loop" loop>
        <source src="assets/background.wav" type="audio/x-wav"/>
        Your browser does not support the audio tag.
    </audio>-->
    <audio id="jumpSound">
        <source src="assets/jump.wav" type="audio/x-wav" />
        Your browser does not support the audio tag.
    </audio>
    <audio id="hitSound">
        <source src="assets/hit.wav" type="audio/x-wav" />
        Your browser does not support the audio tag.
    </audio>
    <audio id="coinSound">
        <source src="assets/coin.wav" type="audio/x-wav" />
        Your browser does not support the audio tag.
    </audio>
    <audio id="levelupSound">
        <source src="assets/levelup.wav" type="audio/x-wav" />
        Your browser does not support the audio tag.
    </audio>
</div>

<!-- JavaScript at the bottom for fast page loading -->

<!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.min.js"><\/script>')</script>
<!-- scripts concatenated and minified via build script -->
<script defer src="js/plugins.js"></script>
<script>
    <?php if (isset($_SESSION['access_token'])) : ?>
        var connected = true;
        var twitter_username = $('.twitter_username').text();
    <?php else : ?>
        var connected = false;
    <?php endif; ?>
</script>
<script defer src="js/script.js"></script>
<!-- end scripts -->


<!-- Asynchronous Google Analytics snippet. Change UA-XXXXX-X to be your site's ID.
       mathiasbynens.be/notes/async-analytics-snippet -->
  <script>
    var _gaq=[['_setAccount','UA-4609610-24'],['_trackPageview']];
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
    s.parentNode.insertBefore(g,s)}(document,'script'));
  </script>

<!-- Prompt IE 6 users to install Chrome Frame. Remove this if you want to support IE 6.
chromium.org/developers/how-tos/chrome-frame-getting-started -->
<!--[if lt IE 7 ]>
<script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
<script>window.attachEvent('onload',function(){CFInstall.check({mode:'overlay'})})</script>
<![endif]-->

</body>
</html>
