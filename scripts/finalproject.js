var game = new Phaser.Game(1520, 750, Phaser.CANVAS, 'phaser-example', {preload: preload, create: create, update: update,render: render })

function preload() {

    //deploy

    game.load.image('button', 'ressources/images/startButton.png');
    game.load.audio('mainMusic', 'ressources/music/mainTheme.mp3');
    game.load.audio('shoot', 'ressources/music/shoot.wav');
    game.load.image('flyer', 'ressources/images/boss.png');
    game.load.image('bullet', 'ressources/images/ball.png');
    game.load.image('background', 'ressources/images/background.png');
    game.load.image('titleBackground', 'ressources/images/titleBackground.png');
    game.load.image('logo', 'ressources/images/logo.png');
    game.load.image('dmg', 'ressources/images/dmg.png');
    game.load.image('spd', 'ressources/images/spd.png');
    game.load.image('hp', 'ressources/images/hp.png');
    game.load.image('arrow', 'ressources/images/arrow.png');

}
//main player
var sprite;
//game controls
var right;
var left;
var up;
var down;
//everything to do with the shooting
var bullets;
var fireRate = 100;
var nextFire = 0;
var bulletSpeed = 1800;
var damage = 1;
var speed = 750;
//the boss
var bosses;
//random text stuff
var lifeString = '';
var bossLifeString = '';
var lifetxt 
var bossTxt;
//player and boss life
var life = 3;
var bossMultiplier = 50
var bossLife = bossMultiplier
//placeholder for boss
var image;
//check to see if player has pressed the start button
var started = false;
var startBTN;

var tween;

var mainMusic;



var winString;
var winTXT;

var loseString;
var loseTXT;

var continueBTN;

var damageUpgradeBTN;
var speedUpgradeBTN;
var lifeUpgradeBTN;

var round = 1;

var dead = false

var shootSFX;








function create(){

    
var bg =game.add.sprite(0, 0, "titleBackground");
bg.scale.setTo(1,0.8);

var logo = game.add.sprite(750, 0, "logo");
logo.anchor.setTo(0.5,0.5);
logo.scale.setTo(0.6,0.6);
tween = game.add.tween(logo).to( { y: 200 }, 1000, Phaser.Easing.Bounce.Out, true);
    
    startBTN = game.add.button(game.world.centerX, game.world.centerY, "button", startGame, music);
    startBTN.anchor.setTo(0.5,0.5);
    tween = game.add.tween(startBTN).to( { y: 500 }, 1000, Phaser.Easing.Bounce.Out, true);

    

}

function startGame(){
   var gameBG = game.add.sprite(0, 0, "background");
   gameBG.scale.setTo(2,2)
    game.world.setBounds(0, 0, 2000, 2000);
    started = true
    startBTN.visible = false;

    
    

    game.physics.startSystem(Phaser.Physics.ARCADE);
    

bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    sprite = game.add.sprite(400, 300, 'arrow');
    sprite.anchor.set(0.5);
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.allowRotation = false;
    sprite.body.collideWorldBounds = true;
    sprite.scale.setTo(2,2);
    game.camera.follow(sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    game.camera.scale.set(1); // 1 = normal, 1.2 = zoomed in

    

    bosses = game.add.group();
    bosses.enableBody = true;
    bosses.physicsBodyType = Phaser.Physics.ARCADE;

    

    right = game.input.keyboard.addKey(Phaser.Keyboard.D)
    left = game.input.keyboard.addKey(Phaser.Keyboard.A)
    up = game.input.keyboard.addKey(Phaser.Keyboard.W)
    down = game.input.keyboard.addKey(Phaser.Keyboard.S)

    lifeString = 'PLAYER LIFE : ';
    lifetxt = game.add.text(900, 10, lifeString + life, { font: '40px Franklin Gothic Heavy', fill: '#fff' });

    bossLifeString = 'BOSS LIFE : ';
    bossTxt = game.add.text(100, 10, bossLifeString + bossLife, { font: '40px Franklin Gothic Heavy', fill: '#fff' });

    lifetxt.fixedToCamera = true;
bossTxt.fixedToCamera = true;


    
spawnBoss()
    
}

function update() {
if (!started) return;
    

    var cam = game.camera;

// Convert mouse position to world coordinates
var mouseX = (game.input.activePointer.x / cam.scale.x) + cam.x;
var mouseY = (game.input.activePointer.y / cam.scale.y) + cam.y;

// Rotate sprite to face mouse
sprite.rotation = game.physics.arcade.angleToXY(sprite, mouseX, mouseY);


    if (game.input.activePointer.isDown) {
        fire();
        
    }

    game.physics.arcade.overlap(bullets, bosses, collisionHandler, null, this);
    game.physics.arcade.overlap (bosses, sprite, collisionHandlerPlayer, null, this);
    

    sprite.body.velocity.x = (0,0);
    sprite.body.velocity.y = (0,0);


        if(left.isDown)
        {
            sprite.body.velocity.x -=speed;
        }
        
        else if(right.isDown){
        
            sprite.body.velocity.x = speed;
        }
        else if(up.isDown){
            sprite.body.velocity.y -= speed;
        }
        else if(down.isDown){
            sprite.body.velocity.y = speed;
        }

        lifetxt.text = lifeString + life;
bossTxt.text = bossLifeString + bossLife;


    }
        


    


function fire() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(sprite.x - 8, sprite.y - 8);

        game.physics.arcade.moveToPointer(bullet, bulletSpeed);
    }
shootSFX = game.add.audio('shoot');
    shootSFX.play()

}

function render() {
 if (!started) return;
    game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);
    game.debug.spriteInfo(sprite, 32, 450);

}



function collisionHandler(bullet, boss) {
    // Bullet disappears
    bullet.kill()

    // Reduce boss health
    bossLife-=damage

    // Update the UI
    bossTxt.text = bossLifeString + bossLife;

    boss.alpha = 0.5;
    game.time.events.add(100, function() { boss.alpha = 1; }, this);

    // Check if boss is dead
    if (bossLife <= 0) {
        boss.kill();
        sprite.kill();
bullets.kill()
       round++

       bossLife= round * 50
       
       

        continueBTN = game.add.button(game.world.centerX, game.world.centerY, "button", upgrade, this );
    continueBTN.anchor.setTo(0.5,0.5);
    continueBTN.fixedToCamera = true;
    continueBTN.cameraOffset.set(1100, game.height / 2);
    }
}

function collisionHandlerPlayer(sprite, boss) {
    
sprite.kill()
    life --;

    respawn()

    lifetxt.text = lifeString + life

    if (life === 0){
        sprite.kill();
        loseString = ' Game Over';
    loseTXT = game.add.text(500, 300, loseString, { font: '36px Franklin Gothic Heavy', fill: '#ff0000' });
    }
    if (life === 1){  
        dead = true
    }
    

    

    
}

function spawnBoss(){   
    var boss = bosses.create(600, 200, "flyer");
    boss.scale.setTo(4,4);
    game.physics.enable(boss, Phaser.Physics.ARCADE);
    boss.body.collideWorldBounds = true;
    boss.body.bounce.set(1.02);
    boss.body.velocity.setTo(500, 500);
}

function upgrade(){
    continueBTN.kill()
lifeUpgradeBTN = game.add.button(1100, game.world.centerY, "hp", lifeUpgrade, this );
    lifeUpgradeBTN.anchor.setTo(0.5,0.5);
    lifeUpgradeBTN.fixedToCamera = true;
    lifeUpgradeBTN.cameraOffset.set(1100, game.height / 2);

    damageUpgradeBTN = game.add.button(500, game.world.centerY, "dmg", damageUpgrade, this );
    damageUpgradeBTN.anchor.setTo(0.5,0.5);
    damageUpgradeBTN.fixedToCamera = true;
    damageUpgradeBTN.cameraOffset.set(500, game.height / 2);

    speedUpgradeBTN = game.add.button(800, game.world.centerY, "spd", speedUpgrade, this );
    speedUpgradeBTN.anchor.setTo(0.5,0.5);
    speedUpgradeBTN.fixedToCamera = true;
    speedUpgradeBTN.cameraOffset.set(800, game.height / 2);

    



    
}

function lifeUpgrade(){
lifeUpgradeBTN.kill()
damageUpgradeBTN.kill()
speedUpgradeBTN.kill()
life+=2
startGame()
spawnBoss()
}

function damageUpgrade(){
    lifeUpgradeBTN.kill()
damageUpgradeBTN.kill()
speedUpgradeBTN.kill()
damage+=1
startGame()
spawnBoss()
}

function speedUpgrade(){
    lifeUpgradeBTN.kill()
damageUpgradeBTN.kill()
speedUpgradeBTN.kill()
speed+=200
startGame()
spawnBoss()
}


function respawn(){
    if (!dead){
    sprite = game.add.sprite(400, 300, 'arrow');
    sprite.anchor.set(0.5);
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.allowRotation = false;
    sprite.body.collideWorldBounds = true;
    sprite.scale.setTo(2,2);
    game.camera.follow(sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    game.camera.scale.set(1); // 1 = normal, 1.2 = zoomed in
    }
}

function music(){
    music = game.add.audio('mainMusic');
    

    music.play();
}


