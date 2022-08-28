var score =0;
var gun,bluebubble,redbubble, bullet, backBoard, background;

var gunImg,bubbleImg, bulletImg, blastImg, backBoardImg;

var redBubbleGroup, redBubbleGroup, bulletGroup;
var explosion = '';
var music = '';

var noseX, noseY, rightWristX, rightWristY = 0;
var ammo = 1000;
var missiles = 200;
var fuel = 100;

var life =3;
var score=0;
var gameState=1

function preload()
{
  gunImg = loadImage("jet.png")
  blastImg = loadImage("blast.png")
  bulletImg = loadImage("missile1.png")
  blueBubbleImg = loadImage("Su-57.png")
  redBubbleImg = loadImage("Su-33.png")
  backBoardImg= loadImage("background.png")
  backgroundImg = loadImage("wave.webp")
  missileImg = loadImage("missile.png")
  explosion = loadSound("explosion.mp3");
  music = loadSound("d.mp3");
}

function setup() 
{
  createCanvas(1500, 800);

  video = createCapture(VIDEO)
  video.hide();

  backBoard= createSprite(100, 450, 100,height);
  backBoard.addImage(backBoardImg)
  
  gun= createSprite(100, height/2, 180,180);
  gun.addImage(gunImg)
  gun.scale=0.2
  
  bulletGroup = createGroup();   
  blueBubbleGroup = createGroup();   
  redBubbleGroup = createGroup();
  missileGroup = createGroup();
  
  heading= createElement("h1");
  scoreboard= createElement("h1");
  ammoboard= createElement("h1");
  missileboard= createElement("h1");
  fuelboard = createElement("h1");

  music.play();

  setInterval(()=>{
    fuel -= 1;
  }, 2000)

  poseNet = ml5.poseNet(video)
  poseNet.on('pose', gotPoses)
}

function draw() 
{
  background = image(backgroundImg, 0, 0,1500, 800);

  heading.html("Life: "+life)
  heading.style('color:red'); 
  heading.position(150,20)

  scoreboard.html("Score: "+score)
  scoreboard.style('color:red'); 
  scoreboard.position(width-200,20)

  ammoboard.html("Ammunition: "+ammo)
  ammoboard.style('color:red'); 
  ammoboard.position(  width-500,20)
  

  missileboard.html("Missiles: "+missiles)
  missileboard.style('color:red'); 
  missileboard.position(width-750,20)

  fuelboard.html("Fuel Remaining: " + fuel)
  fuelboard.style("color:red");
  fuelboard.position(width-1100,20)

  if(gameState===1)
  {
    gun.y=noseY
    gun.x = 600 -noseX

    if(fuel === 150)
    {
      swal({
        title: `Game Over`,
        text: "Oh my you had to much fuel and your plane crashed into the sea!!!"+"Your Score is " + score,
        imageUrl:
          "http://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/loudly-crying-face.png",
        imageSize: "100x100",
        confirmButtonText: "Thanks For Playing, if your wanna play again just reload the website!   "
      })
    }

    if(fuel === 0)
    {
      swal({
        title: `Game Over`,
        text: "Oh my you lost all your fuel and your plane crashed in the sea!!!"+"Your Score is " + score,
        imageUrl:
          "http://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/loudly-crying-face.png",
        imageSize: "100x100",
        confirmButtonText: "Thanks For Playing, if your wanna play again just reload the website!   "
      })
    }

    if(missiles === 0)
    {
        gameState=2
          
        swal({
          title: `Game Over`,
          text: "Oh my you lost all your missiles and your plane broke!!!"+"Your Score is " + score,
          imageUrl:
            "http://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/loudly-crying-face.png",
          imageSize: "100x100",
          confirmButtonText: "Thanks For Playing, if your wanna play again just reload the website!   "
        })
    }

    if(ammo === 0)
    {
        gameState=2
          
        swal({
          title: `Game Over`,
          text: "Oh my you lost all your ammo and your gun exploded!!!"+"Your Score is " + score,
          imageUrl:
            "http://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/loudly-crying-face.png",
          imageSize: "100x100",
          confirmButtonText: "Thanks For Playing, if your wanna play again just reload the website!   "
        })
    }

    if(music.isPlaying() == false)
    {
      music.play();
    }
    
    if(blueBubbleGroup.collide(gun))
    {
        handleGameover(blueBubbleGroup)
    }
    if(redBubbleGroup.collide(gun))
    {
        handleGameover(redBubbleGroup)
    }
    if (frameCount % 80 === 0) 
    {
      drawblueBubble();
    }

    if (frameCount % 100 === 0) 
    {
      drawredBubble();
    }

    if(keyDown("g"))
    {
      shootBullet();
    }

    if(keyDown("m"))
    {
      setTimeout(()=>{
        shootMissile();
      },1000)
    }

    if (blueBubbleGroup.collide(backBoard))
    {
      handleGameover(blueBubbleGroup);
    }
    
    if (redBubbleGroup.collide(backBoard)) 
    {
      handleGameover(redBubbleGroup);
    }
    
    if(blueBubbleGroup.collide(bulletGroup))
    {
      handleBubbleCollision(blueBubbleGroup);
    }

    if(redBubbleGroup.collide(bulletGroup))
    {
      handleBubbleCollision(redBubbleGroup);
    }

    if(blueBubbleGroup.collide(missileGroup))
    {
      handleBubbleMissileCollision(blueBubbleGroup);
    }

    if(redBubbleGroup.collide(missileGroup))
    {
      handleBubbleMissileCollision(redBubbleGroup);
    }

    drawSprites();
  }
}

function gotPoses(results)
{
    if(results.length > 0)
    {
        console.log(results);

        leftWristX = results[0].pose.leftWrist.x;
        leftWristY = results[0].pose.leftWrist.y;
        console.log("Left wrist x is: " + leftWristX+"and left wrist y is: " + leftWristY);

        rightWristX = results[0].pose.rightWrist.x;
        rightWristY = results[0].pose.rightWrist.y;
        console.log("Right wrist x is: " + rightWristX + "and right wrist y is: " + rightWristY)

        noseX = results[0].pose.nose.x;
        noseY = results[0].pose.nose.y;
    }
}

function drawblueBubble()
{
  bluebubble = createSprite(1500,random(100,400),400,400);
  bluebubble.addImage(blueBubbleImg);
  bluebubble.scale = 0.1;
  bluebubble.velocityX = -8;
  bluebubble.lifetime = 400;
  blueBubbleGroup.add(bluebubble);
}
function drawredBubble()
{
  redbubble = createSprite(1500,random(100,400),300,300);
  redbubble.addImage(redBubbleImg);
  redbubble.scale = 0.1;
  redbubble.velocityX = -8;
  redbubble.lifetime = 400;
  redBubbleGroup.add(redbubble);
}

function shootBullet()
{
  bullet= createSprite(gun.x + 10, 20, gun.y,5)
  bullet.y= gun.y-20
  bullet.addImage(bulletImg)
  bullet.scale=0.12
  bullet.velocityX= 20
  bulletGroup.add(bullet)
  ammo -= 1;
}

function shootMissile()
{
  missile= createSprite(gun.x + 10, 20, gun.y,5)
  missile.y= gun.y-20
  missile.addImage(missileImg)
  missile.scale=0.12
  missile.velocityX= 50
  missileGroup.add(missile)
  missiles -= 1;
  
}

function handleGameover(bubbleGroup)
{
    blast= createSprite(gun.x+60, gun.y, 50,50);
    blast.addImage(blastImg) 
    
    blast.scale=0.3
    blast.life=10
    bubbleGroup.destroyEach();
    life = life -1;
    if (life === 0) 
    {
      gameState=2
      
      swal({
        title: `Game Over`,
        text: "Oops you lost the game....!!!",
        text: "Your Score is " + score,
        imageUrl:
          "http://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/loudly-crying-face.png",
        imageSize: "100x100",
        confirmButtonText: "Thanks For Playing, if your wanna play again just reload the website!   "
      });
    }
}

function handleBubbleCollision(bubbleGroup)
{
    if (life > 0) 
    {
       score += 1;
       fuel +=0.5;
    }

    blast= createSprite(bullet.x+60, bullet.y, 50,50);
    blast.addImage(blastImg) 
    
    blast.scale=0.3
    blast.life=10
    bulletGroup.destroyEach()
    bubbleGroup.destroyEach()
    explosion.play()
}

function handleBubbleMissileCollision(bubbleGroup)
{
    if (life > 0) 
    {
       score += 2;
       fuel += 1;
    }

    blast= createSprite(missile.x+60, missile.y, 50,50);
    blast.addImage(blastImg) 
    
    blast.scale=0.3
    blast.life=1
    missileGroup.destroyEach()
    bubbleGroup.destroyEach()
    explosion.play()
}