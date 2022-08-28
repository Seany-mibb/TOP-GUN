var score =0;
var gun,bluebubble,redbubble, bullet, backBoard, background;

var gunImg,bubbleImg, bulletImg, blastImg, backBoardImg;

var redBubbleGroup, redBubbleGroup, bulletGroup;

var ammo = 1000;
var missiles = 200;

var life =3;
var score=0;
var gameState=1;

var status = '';
var fuel = 100;

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
  music = loadSound("d.mp3")
  explosion = loadSound("explosion.mp3");
}

function setup() 
{
  createCanvas(1500, 800);

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
  }, 1000)
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
  missileboard.position(width-700,20)

  fuelboard.html("Fuel Remaining: " + fuel)
  fuelboard.style("color:red");
  fuelboard.position(width-1100,20)

  if(gameState===1)
  {
    gun.y=mouseY  
    gun.x = mouseX

    if(missiles === 0)
    {
        gameState=2;
          
        swal({
          title: `Game Over`,
          text: "Oh my you lost all your missiles and your plane broke!!!"+"Your Score is " + score,
          imageUrl:
            "http://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/loudly-crying-face.png",
          imageSize: "100x100",
          confirmButtonText: "Thanks For Playing, if your wanna play again just reload the website!"
        })
    }

    if(ammo === 0)
    {
        gameState=2;
          
        swal({
          title: `Game Over`,
          text: "Oh my you lost all your ammo and your gun exploded!!!"+"Your Score is " + score,
          imageUrl:
            "http://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/loudly-crying-face.png",
          imageSize: "100x100",
          confirmButtonText: "Thanks For Playing, if your wanna play again just reload the website!"
        })
    }

    if(fuel === 0)
    {
      gameState = 2;
      swal({
        title: `Game Over`,
        text: "Oh my you lost all your fuel and your plane crashed in the sea!!!"+"Your Score is " + score,
        imageUrl:
          "http://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/loudly-crying-face.png",
        imageSize: "100x100",
        confirmButtonText: "Thanks For Playing, if your wanna play again just reload the website!"
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
      shootMissile();
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

function drawblueBubble()
{
  bluebubble = createSprite(1500,random(20,750),160,160);
  bluebubble.addImage(blueBubbleImg);
  bluebubble.scale = 0.1;
  bluebubble.velocityX = -8;
  bluebubble.lifetime = 400;
  blueBubbleGroup.add(bluebubble);
}
function drawredBubble()
{
  redbubble = createSprite(1500,random(20,750),160,160);
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
       fuel += 1;
    }

    blast= createSprite(bullet.x+60, bullet.y, 50,50);
    blast.addImage(blastImg) 
    
    blast.scale=0.3
    blast.life=10
    bulletGroup.destroyEach()
    bubbleGroup.destroyEach()
    explosion.play();
}

function handleBubbleMissileCollision(bubbleGroup)
{
    if (life > 0) 
    {
       score += 2;
       fuel += 2;
    }

    blast= createSprite(missile.x+60, missile.y, 50,50);
    blast.addImage(blastImg) 
    
    blast.scale=0.3
    blast.life=10
    missileGroup.destroyEach()
    bubbleGroup.destroyEach()
    explosion.play()
}