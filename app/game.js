define('app/game', [
  'underscore',
  'userInput',
  'utils',
  'SpriteSheet',
  'app/images',
  'app/map'
], function (
  _,
  userInput,
  utils,
  SpriteSheet,
  images,
  map
) {
  /*
    PLAYER: 1,
    TILE: 2,
    ENEMY: 3,
  */

  let canvasWidth
  let canvasHeight

  const DEBUG_WRITE_BUTTONS = false;
  const DEBUG_DISABLE_GRAPHICS = false;
  const DEBUG_DRAW_BOXES = false;
  const DEBUG_HOTKEYS = true;
  let DEBUG_START_OFFSET = 0;

  const TILE_SIZE = 32;
  const GRAVITY = 0.3;
  const TIME_UNTIL_RESTART = 200;

  let gameObjects;
  let playSound;
  let murrio;
  let grandpa;
  let victoryTile;
  let currentMapIdx = 0;
  let hasWon = false
  let flag
  let showVictoryText = false

  function debugWriteButtons(pad) {
        if (!DEBUG_WRITE_BUTTONS) return;
        _.each(pad && pad.buttons, function(button, idx) {
            if (button.pressed) console.log(idx + " pressed");
        })
    }

  class GameObject {
    constructor(config) {
      this.image = config.image;
      this.markedForRemoval = false;
      this.color = config.color || "gray"
      this.pos = config.pos;
      this.velocity = config.velocity || {x: 0, y: 0}
    }
    tick() {

    }
    draw(renderingContext) {
      if (DEBUG_DRAW_BOXES) {
        renderingContext.fillStyle = this.color;
        renderingContext.fillRect(this.pos.x, this.pos.y, (this.tileWidth || 1) * TILE_SIZE, (this.tileHeight || 1) * TILE_SIZE)
        renderingContext.strokeStyle = "#000000";
        renderingContext.strokeRect(this.pos.x, this.pos.y, (this.tileWidth || 1) * TILE_SIZE, (this.tileHeight || 1) * TILE_SIZE)
      } else {
        if (!this.image) return;
        renderingContext.drawImage(this.image, this.pos.x, this.pos.y)
      }
    }
    destroy() {
      this.markedForRemoval = true;
    }
  }

  class Murrio extends GameObject {
    constructor(config) {
      super(config);
      this.jumpButtonReleased = true;
      this.touchingGround = false;
      this.walk_animation = images.walk_animation;
      this.swing_animation = null;
      this.direction = false; //True is left, false is right
      this.tileWidth = 1.99999
      this.tileHeight = 2.99999
      this.moved_by_cloud = false

      this.isHackaMonsterPlaying = false

      var spriteConfig = {
        frames: [200, 200, 200, 200, 200],
        x: 0,
        y: 0,
        width: 64,
        height: 96,
        restart: true,
        autoPlay: true,
      }
      this.spritesheet = SpriteSheet.new(images.climber_walk, spriteConfig)
    }
    tick() {
      this.moved_by_cloud = false
      const pad = userInput.getInput(0)
      var acceleration = {
        x: 0,
        y: 0
      }
      var speed = (this.touchingGround) ? 0.6 : 0.14;
      if (pad.buttons[14].pressed) { // left
        acceleration.x -= speed;
      }
      if (pad.buttons[15].pressed) { // right
        acceleration.x += speed;
      }

      if (pad.buttons[0].pressed) { // up
        this.jump();
      }
      if (!pad.buttons[0].pressed) { // up
        this.jumpButtonReleased = true;
      }

      if (pad.buttons[2].pressed) { // hacka slafsa!
        this.isHackaMonsterPressed = true
      } else {
        this.isHackaMonsterPressed = false
      }

      this.hackaSlafsa()

      if (this.isHackaMonsterPlaying) {
        this.swing_animation.tick(1000/60);
      }
      var groundFriction = (this.touchingGround) ? 0.92 : 0.985;
      this.velocity = {
        x: (this.velocity.x + acceleration.x) * groundFriction,
        y: this.velocity.y + acceleration.y + GRAVITY
      }
      let nextPosition = {
        x: this.pos.x + this.velocity.x,
        y: this.pos.y + this.velocity.y
      }

      //Collision with edge of map
      if (nextPosition.x <= 0) {
        nextPosition.x = 1;
        this.velocity.x = 0;
      } else if (nextPosition.x >= canvasWidth - this.tileWidth * TILE_SIZE) {
        nextPosition.x = canvasWidth - this.tileWidth * TILE_SIZE - 1
        this.velocity.x = 0;
      }

      var callbackX = function() {
        this.velocity.x = 0;
      }
      var callbackY = function() {
        this.velocity.y = 0;
        this.jumpAvailable = 2;
        this.touchingGround = true;
      }
      this.touchingGround = false;
      handleMove(this, nextPosition, callbackX.bind(this), callbackY.bind(this));

      var tickspeed = Math.round(1000/60 * Math.abs(this.velocity.x));
      this.spritesheet.tick((tickspeed === 0) ? 0.00001 : tickspeed); // 0 gives spasms

      if (this.velocity.x < -0.1) {
        this.direction = false
      } else if (this.velocity.x > 0.1) {
        this.direction = true
      }
      super.tick();

      if (this.pos.y > scroller.screenOffset + canvasHeight) {
        playSound('die')
        init()
      }
    }
    jump() {
      if (!this.touchingGround || !this.jumpButtonReleased) return;
      playSound('jump')
      var jumpSpeed = -10.4
      this.velocity.y = Math.max(-11, jumpSpeed);
      this.touchingGround = false;
      this.jumpButtonReleased = false;
    }
    hackaSlafsa() {
      if (this.isHackaMonsterPressed && !this.isHackaMonsterPlaying) {
        this.isHackaMonsterPlaying = true
        playSound('miss')
        var hacka;
        setTimeout(function() {
          var hackaX = this.direction ? this.pos.x + this.tileWidth * TILE_SIZE : this.pos.x - TILE_SIZE
          var hackaY = this.pos.y + TILE_SIZE
          hacka = new Hacka(hackaX, hackaY)
          gameObjects.push(hacka)
        }.bind(this), 180)

        this.swing_animation = SpriteSheet.new(images.climber_swing_sheet, {
          frames: [50, 90, 150, 200],
          x: 0,
          y: 0,
          width: 94,
          height: 96,
          restart: false,
          autoPlay: true,
          callback: function() {
            hacka.destroy()
            this.isHackaMonsterPlaying = false
          }.bind(this)
        });
      }
    }
    draw(renderingContext) {
      if (this.isHackaMonsterPlaying) {
        renderingContext.save()
        renderingContext.translate(this.pos.x, this.pos.y);
        if (!this.direction) {
          renderingContext.scale(-1, 1);
          renderingContext.translate(-TILE_SIZE * 2, 0);
        }
        this.swing_animation.draw(renderingContext);
        renderingContext.restore();
      } else if (this.touchingGround) {
        renderingContext.save()
        renderingContext.translate(this.pos.x, this.pos.y);
        if (!this.direction) {
          renderingContext.scale(-1, 1);
          renderingContext.translate(-TILE_SIZE * 2, 0);
        }
        this.spritesheet.draw(renderingContext);
        renderingContext.restore();
      } else {
        renderingContext.save();
        renderingContext.translate(this.pos.x, this.pos.y);
        if (!this.direction) {
          renderingContext.scale(-1, 1);
          renderingContext.translate(-TILE_SIZE * 2, 0);
        }
        renderingContext.drawImage(images.climber_jump, 0, 0);
        renderingContext.restore();
      }
    }
  }

  class Hacka extends GameObject {
    constructor(x, y) {
      super({
        pos: {
          x: x,
          y: y,
        }
      })
      this.tileWidth = 1
      this.tileHeight = 2
    }
  }

  class MurrioDeathAnimation extends GameObject {
    constructor(config) {
      super(config)
      this.color = "yellow";
      this.image = images.dead;
      this.rotation = 0;
      this.countdown = 120;
    }
    tick() {
      this.rotation += 0.15;
      this.countdown--;

      if (this.countdown <= 0) {
        init();
      }
    }
    draw(renderingContext) {
      renderingContext.save();
      renderingContext.translate(this.pos.x + TILE_SIZE, this.pos.y + (TILE_SIZE * 2));
      renderingContext.rotate(this.rotation);
      renderingContext.drawImage(images.climber_dead, -TILE_SIZE, TILE_SIZE * -2)
      renderingContext.restore();
    }
  }

  class MurrioWin extends GameObject {
    constructor(config) {
      super(config)
      this.color = "yellow";
      this.image = images.won;
    }
  }

  class Grandpa extends GameObject {
    constructor(config) {
      super(config);
      this.done = false;
    }
    draw(renderingContext) {
      if (this.done) {
        renderingContext.drawImage(images.grandpa_happy, this.pos.x, this.pos.y)
        renderingContext.drawImage(images.pratbubblathanks, this.pos.x - 205, this.pos.y - 210);
      } else {
        renderingContext.drawImage(images.grandpa, this.pos.x, this.pos.y)
      }
    }
  }

  class Tile extends GameObject {
    constructor(config) {
      super(config);
      this.image = config.image;
    }
  }

  class Decor extends GameObject {
    constructor(config) {
      super(config);
      this.image = config.image;
    }
  }

  class Enemy extends GameObject {
    constructor(config) {
      super(config)
      this.direction = true; //true is left, false is right
      this.speed = 0.5;
      this.tileWidth = 1.0001
      this.tileHeight = 1.0001
      this.timeSinceLastSwitch = 0;

      this.spritesheet = SpriteSheet.new(images.enemy_walk, {
        frames: [200, 200, 200, 200],
        x: 0,
        y: 0,
        width: 64,
        height: 96,
        restart: true,
        autoPlay: true,
      });
    }
    tick() {
      this.spritesheet.tick(1000/60);
      this.timeSinceLastSwitch++;
      if (!this.direction && this.distance > this.totalWalkDistance) {
        this.direction = true;
        this.timeSinceLastSwitch = 0;
      } else if (this.direction && this.distance < 0) {
        this.direction = false;
        this.timeSinceLastSwitch = 0;
      }
      var modifier = (this.direction) ? (this.speed*-1) : this.speed;
      this.distance += modifier;
      var nextPosition = {
        x: this.pos.x + modifier,
        y: this.pos.y
      }
      this.pos = nextPosition;

      var collisions = detectCollision(this);

      var tiles_touched = 0
      _.each(collisions, function(collision) {
        if (collision instanceof Tile) {tiles_touched += 1}
        if (collision instanceof Hacka) {
          this.destroy()
        }
      }.bind(this))

      if (tiles_touched == 1) {
        if (this.direction === false) {
          this.direction = true
          this.timeSinceLastSwitch = 0;
        } else {
          this.direction = false
          this.timeSinceLastSwitch = 0;
        }
      } else if (tiles_touched == 0) {
          this.destroy()
      }
    }
    draw(renderingContext) {
      renderingContext.save()
      renderingContext.translate(this.pos.x - (TILE_SIZE/2), this.pos.y - TILE_SIZE * 2);
      if (this.direction && this.timeSinceLastSwitch > 5) {
        renderingContext.scale(-1, 1);
        renderingContext.translate(-TILE_SIZE * 2, 0);
      }
      this.spritesheet.draw(renderingContext);
      renderingContext.restore();
    }

    destroy(){
      super.destroy()
      playSound('enemy_killed')
      _.each(new Array(20), function() {
        var particleSettings = {
          pos: {
            x: this.pos.x + (Math.random() * 2),
            y: this.pos.y + (Math.random() * 2),
          },
          velocity: {
            x: (Math.random() - 0.5) * 5,
            y: -(Math.random() - 0.5) * 5,
          },
          image: images.particleSpike,
          lifetime: 80
        }
        var particle = new Particle(particleSettings);
        gameObjects.push(particle);
      }.bind(this))
    }
  }

  class Flag extends GameObject {
    constructor(config) {
      super(config)
      this.spritesheet = SpriteSheet.new(images.flag, {
        frames: [200, 200, 200],
        x: 0,
        y: 0,
        width: 64,
        height: 96,
        restart: false,
        autoPlay: true,
      })
    }
    tick() {
      this.spritesheet.tick(1000/60)
    }
    draw(renderingContext) {
      renderingContext.save()
      renderingContext.translate(this.pos.x - TILE_SIZE, this.pos.y - TILE_SIZE * 2);
      this.spritesheet.draw(renderingContext);
      renderingContext.restore();
    }
  }


  class Cloud extends GameObject {
    constructor(config) {
      super(config)
      this.direction = config.direction; //true is left, false is right
      this.speed = config.speed;
      this.tileWidth = 1
      this.tileHeight = 1

    }
    tick() {
      if (!this.direction && this.distance > this.totalWalkDistance) {
        this.direction = true;
      } else if (this.direction && this.distance < 0) {
        this.direction = false;
      }
      var modifier = (this.direction) ? (this.speed*-1) : this.speed;
      this.distance += modifier;
      var nextPosition = {
        x: this.pos.x + modifier,
        y: this.pos.y
      }
      this.pos = nextPosition;

      //stop murrio from going though clouds from the side
      var collisions = detectCollision(this);
      _.each(collisions, function(collision) {
        if (collision instanceof Murrio) {
          collision.pos.x += modifier
        }
      })

      if (this.direction === true) {
        if (this.pos.x < -TILE_SIZE) {
          this.pos.x = 1024;
        }
      } else {
        if (this.pos.x > 1024) {
          this.pos.x = -TILE_SIZE;
        }
      }

    }
    draw(renderingContext) {
      //renderingContext.fillStyle = "#00FF00";
      //renderingContext.fillRect(this.pos.x, this.pos.y, (this.tileWidth || 1) * TILE_SIZE, (this.tileHeight || 1) * TILE_SIZE);
      renderingContext.drawImage(this.image, this.pos.x, this.pos.y)
    }
  }

  class DeathTile extends GameObject {
    constructor(config) {
      super(config)
      this.particles = config.particles;
      this.color = "red";
      this.sprite = config.sprite;
    }
    tick() {
      if (this.sprite) {
        this.sprite.tick(1000/60)
      }
    }
    draw(renderingContext) {
      if (this.sprite) {
        renderingContext.save();
        renderingContext.translate(this.pos.x, this.pos.y)
        this.sprite.draw(renderingContext);
        renderingContext.restore();
        }
    }
  }

  class VictoryTile extends GameObject {
    constructor(config) {
      super(config)
      this.spritesheet = SpriteSheet.new(images.flag, {
        frames: [200, 200, 200],
        x: 0,
        y: 0,
        width: 64,
        height: 96,
        restart: false,
        autoPlay: false,
      })
    }
    // tick() {
      // if (!this.done) {
      //   if (Math.random() > 0.0001) {
      //     var particleSettings = {
      //       pos: {
      //         x: victoryTile.pos.x + (Math.random() * TILE_SIZE / 2) + TILE_SIZE / 4,
      //         y: victoryTile.pos.y - 4,
      //       },
      //       velocity: {
      //         x: (Math.random() - 0.5) * 1.5,
      //         y: -1 - (Math.random()) * 8,
      //       },
      //       image: images.lavaparticle,
      //       lifetime: 90,
      //     }
      //     var particle = new Particle(particleSettings);
      //     gameObjects.push(particle);
      //   }
      // }
    // }
    draw(renderingContext) {
      renderingContext.save()
      renderingContext.translate(this.pos.x - TILE_SIZE, this.pos.y - TILE_SIZE * 2);
      this.spritesheet.draw(renderingContext);
      renderingContext.restore();
    }
  }

  class GameRestarter {
    constructor() {
      this.amountUntilKeyPressAvailable = TIME_UNTIL_RESTART;
      this.spritesheet = images.press_any_key;
      this.pos = {
        x: 999,
        y: 999
      }
    }
    tick() {
      this.spritesheet.tick(1000/60);
      this.amountUntilKeyPressAvailable--;

      if (this.amountUntilKeyPressAvailable > TIME_UNTIL_RESTART - 90) return;

      const pad = userInput.getInput(0)
      if (pad.buttons[0].pressed || pad.buttons[14].pressed || pad.buttons[15].pressed) {
        if (this.gameIsReallyOver()) return;
        if (this.done) {
          currentMapIdx++;
        }
        init();
      }
    }
    gameIsReallyOver() {
      return (this.done && map.getMap().length - 1 <= currentMapIdx);
    }
    draw(renderingContext) {
      if (this.amountUntilKeyPressAvailable > 0) return;

      if (this.gameIsReallyOver()) {
        renderingContext.drawImage(images.youdidit, canvasWidth/2 - (images.youdidit.width/2), 10)
        return;
      }
      renderingContext.save()
      renderingContext.translate(canvasWidth/2-(320/2), canvasHeight/2-(64/2));
      this.spritesheet.draw(renderingContext);
      renderingContext.restore();
    }
  }

  class ScreenScroller {
    constructor() {
      this.screenOffset = DEBUG_START_OFFSET || 0;
    }
    tick() {
      // if (murrio.pos.x > canvasWidth / 2 + this.screenOffset) {
      //   this.screenOffset = murrio.pos.x - canvasWidth / 2;
      // }
    }
    getScreenOffset() {
      return this.screenOffset;
    }
  }

  class Particle extends GameObject {
    constructor(config) {
      super(config);
      this.image = config.image;
      this.lifetimeMax = config.lifetime;
      this.lifetime = config.lifetime;
    }
    tick() {
      const nextPosition = {
        x: this.pos.x + this.velocity.x,
        y: this.pos.y + this.velocity.y
      }
      this.velocity.x = this.velocity.x * 0.98;
      this.velocity.y = this.velocity.y * 0.98;
      this.pos = nextPosition;

      this.lifetime--;
      if (this.lifetime <= 0) this.markedForRemoval = true;
    }
    draw(renderingContext) {
      renderingContext.globalAlpha = (this.lifetime / this.lifetimeMax);
      super.draw(renderingContext);
      renderingContext.globalAlpha = 1;
    }
  }

  function isOfTypes(gameObject, other, type1, type2) {
    return (gameObject instanceof type1 && other instanceof type2) ||
        (gameObject instanceof type2 && other instanceof type1)
  }

  function getOfType(gameObject, other, type) {
    if (gameObject instanceof type && other instanceof type) {
      console.warn(`Both ${gameObject} and ${other} were of type ${type}`)
    }
    if (gameObject instanceof type) {
      return gameObject
    } else if (other instanceof type) {
      return other
    }
    console.error(`None of type ${type}, ${gameObject} - ${other}`)
  }

  function detectCollision(who) {
      return _.filter(gameObjects, function(item) {
        if (item === who) return;

        var whoHeight = (who.tileHeight || 1) * TILE_SIZE
        var whoWidth = (who.tileWidth || 1) * TILE_SIZE

        var itemHeight = (item.tileHeight || 1) * TILE_SIZE
        var itemWidth = (item.tileWidth || 1) * TILE_SIZE

        const conditionLeftWithinWidth = item.pos.x > who.pos.x && item.pos.x < who.pos.x + whoWidth
        const conditionRightWithinWidth = item.pos.x + itemWidth > who.pos.x && item.pos.x + itemWidth < who.pos.x + whoWidth
        const conditionTopWithinHeight = item.pos.y > who.pos.y && item.pos.y < who.pos.y + whoHeight
        const conditionBottomWithinHeight = item.pos.y + itemHeight > who.pos.y && item.pos.y + whoHeight < who.pos.y + whoHeight
        const condition5 = !item.markedForRemoval
        const condition6 = !(item instanceof Particle)
        const condition7 = !(item instanceof Grandpa)
        const condition8 = !(item instanceof Decor)
        return ((conditionLeftWithinWidth && conditionTopWithinHeight) ||
          (conditionLeftWithinWidth && conditionBottomWithinHeight) ||
          (conditionRightWithinWidth && conditionTopWithinHeight) ||
          (conditionRightWithinWidth && conditionBottomWithinHeight)) &&
          condition5 && condition6 && condition7 && condition8;
      });
    }

  function resolveCollision(gameObject, other) {
    if (isOfTypes(gameObject, other, Murrio, DeathTile)) {
      var death = getOfType(gameObject, other, DeathTile);
      var murrio = getOfType(gameObject, other, Murrio);
      murrio.destroy();
      gameObjects.push(new GameRestarter());
      gameObjects.push(new MurrioDeathAnimation({ pos: murrio.pos }));
      playSound('gameMusic', true)

      if (death.particles) {
        _.each(new Array(20), function() {
          var particleSettings = {
            pos: {
              x: murrio.pos.x + TILE_SIZE + (Math.random() * TILE_SIZE),
              y: murrio.pos.y + (TILE_SIZE * 2) - (Math.random() * 2),
            },
            velocity: {
              x: (Math.random() - 0.5) * 1.2,
              y: -(Math.random() - 0.3) * 3,
            },
            image: images.lavaparticle,
            lifetime: 60
          }
          var particle = new Particle(particleSettings);
          gameObjects.push(particle);
        })
      }
    }
    if (isOfTypes(gameObject, other, Murrio, VictoryTile)) {
      var murrio = getOfType(gameObject, other, Murrio);
      var victoryTile = getOfType(gameObject, other, VictoryTile);
      hasWon = true
      // spela upp win-grejer here!!!
      playSound('gameMusic', true)
      playSound('win_song')
      victoryTile.destroy()

      setTimeout(function () {
        showVictoryText = true
      }, 1000)

      flag = new Flag({
        pos: victoryTile.pos,
      })
    }

    if (isOfTypes(gameObject, other, Murrio, Cloud)) {
      var murrio = getOfType(gameObject, other, Murrio);
      if (murrio.moved_by_cloud === false) {
        var modifier = (other.direction) ? (other.speed*-1) : other.speed;
        murrio.pos.x += modifier
        murrio.moved_by_cloud = true
      }
    }

    if (isOfTypes(gameObject, other, Murrio, Enemy)) {
      var murrio = getOfType(gameObject, other, Murrio);
      playSound('die');
      murrio.destroy();
      var deathconfig = {
        pos: {
          x: murrio.pos.x,
          y: murrio.pos.y
        }
      }
      gameObjects.push(new MurrioDeathAnimation(deathconfig));

      playSound('gameMusic', true)

      _.each(new Array(20), function() {
        var particleSettings = {
          pos: {
            x: murrio.pos.x + TILE_SIZE + (Math.random() * TILE_SIZE),
              y: murrio.pos.y + (TILE_SIZE * 2) - (Math.random() * 2),
          },
          velocity: {
            x: (Math.random() - 0.5) * 5,
            y: -(Math.random() - 0.5) * 5,
          },
          image: images.particleSpike,
          lifetime: 80
        }
        var particle = new Particle(particleSettings);
        gameObjects.push(particle);
      })
    }
  }

  function handleMove(gameObject, newPos, callbackX, callbackY) {
    var fromLeft = newPos.x > gameObject.pos.x;
    var fromTop = newPos.y > gameObject.pos.y;
    gameObject.pos.x = newPos.x;
    var collisions = detectCollision(gameObject);
    if (collisions.length > 0) {
      _.each(collisions, function(collision) { resolveCollision(gameObject, collision) });
      if (fromLeft) {
        gameObject.pos.x = collisions[0].pos.x - (gameObject.tileWidth || 1) * TILE_SIZE;
      } else {
        gameObject.pos.x = collisions[0].pos.x + (collisions[0].tileWidth || 1) * TILE_SIZE;
      }
      callbackX();
    }

    gameObject.pos.y = newPos.y;
    var collisions = detectCollision(gameObject);
    if (gameObject.direction) {
      collisions = collisions.reverse()
    }
    // console.log(collisions)
    if (collisions.length > 0) {
      _.each(collisions, function(collision) { resolveCollision(gameObject, collision) });
      if (fromTop) {
        gameObject.pos.y = collisions[0].pos.y - (gameObject.tileHeight || 1) * TILE_SIZE;

        var item = collisions[0]
        if (item instanceof Tile || item instanceof Cloud && item.pos.y < gameObject.currentTileLevel) {

          scroller.screenOffset -= gameObject.currentTileLevel - item.pos.y
          gameObject.currentTileLevel = item.pos.y

        }

      } else {
        // console.log('SLOG I HUVET!!')
        var oldGmaeObjectY = gameObject.pos.y
        gameObject.pos.y = collisions[0].pos.y + (collisions[0].tileHeight || 1) * TILE_SIZE;


        // hackan!
        var item = collisions[0]
        var itemHeight = (item.tileHeight || 1) * TILE_SIZE
        var itemWidth = (item.tileWidth || 1) * TILE_SIZE

        var hackPointX = gameObject.pos.x
        // this.direction = false; //True is left, false is right
        if (gameObject.direction) {
          hackPointX = gameObject.pos.x + gameObject.tileWidth * TILE_SIZE
        }
        // var hackPointY = gameObject.pos.y

        if (isPointInsideRect(hackPointX, oldGmaeObjectY, item.pos.x, item.pos.y, itemWidth, itemHeight)) {
          // hakc it!
          if (!(item instanceof Cloud)) {
            playSound('break_block')
            _.each(new Array(20), function() {
              var particleSettings = {
                pos: {
                  x: item.pos.x + (TILE_SIZE/2) + (Math.random() * 2),
                  y: item.pos.y + (TILE_SIZE/2) + (Math.random() * 2),
                },
                velocity: {
                  x: (Math.random() - 0.5) * 5,
                  y: -(Math.random() - 0.5) * 5,
                },
                image: images.particleIce,
                lifetime: 80
              }
              var particle = new Particle(particleSettings);
              gameObjects.push(particle);
            }.bind(this))
            item.destroy();
          }
        }

      }
      callbackY(collisions);
    }
  }

  function isPointInsideRect(x, y, rx, ry, rw, rh) {
    return x > rx && x < rx + rh && y > ry && y < ry + rh
  }

  function loadMap(map) {

    _.each(map, function(row, rowIdx) {
      _.each(row, function(column, colIdx) {
        switch(column) {
          case 1:
            var verticalOffset = rowIdx * TILE_SIZE;
            murrio = new Murrio({
              pos: {
                x: colIdx * TILE_SIZE,
                y: verticalOffset
              },
              velocity: {
                x: 0.00001,
                y: 0
              }
            })
            gameObjects.push(murrio)
          break;
          case 2:
            var tile = new Tile({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.tile
            })
            gameObjects.push(tile)
          break;
          case 3:
            var enemy = new Enemy({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              sprite: SpriteSheet.new(images.spike, images.spike_blueprint),
            })
            gameObjects.push(enemy)
          break;
          case 4:
            var tile = new Tile({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.tile2
            })
            gameObjects.push(tile)
          break;
          case 5:
            var tile = new Tile({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.tile3
            })
            gameObjects.push(tile)
          break;

          //slow cloud left
          case "a":
            cloud = new Cloud({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              direction: true,
              speed: 1,
              image: images.cloud_left
            })
            gameObjects.push(cloud)
          break;
          case "b":
            cloud = new Cloud({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              direction: true,
              speed: 1,
              image: images.cloud_center
            })
            gameObjects.push(cloud)
          break;
          case "c":
            cloud = new Cloud({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              direction: true,
              speed: 1,
              image: images.cloud_right
            })
            gameObjects.push(cloud)
          break;
          //slow cloud right
          case "d":
            cloud = new Cloud({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              direction: false,
              speed: 1,
              image: images.cloud_left
            })
            gameObjects.push(cloud)
          break;
          case "e":
            cloud = new Cloud({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              direction: false,
              speed: 1,
              image: images.cloud_center
            })
            gameObjects.push(cloud)
          break;
          case "f":
            cloud = new Cloud({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              direction: false,
              speed: 1,
              image: images.cloud_right
            })
            gameObjects.push(cloud)
          break;
          //fast cloud left
          case "g":
            cloud = new Cloud({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              direction: true,
              speed: 2,
              image: images.cloud_left
            })
            gameObjects.push(cloud)
          break;
          case "h":
            cloud = new Cloud({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              direction: true,
              speed: 2,
              image: images.cloud_center
            })
            gameObjects.push(cloud)
          break;
          case "i":
            cloud = new Cloud({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              direction: true,
              speed: 2,
              image: images.cloud_right
            })
            gameObjects.push(cloud)
          break;
          //fast cloud right
          case "j":
            cloud = new Cloud({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              direction: false,
              speed: 2,
              image: images.cloud_left
            })
            gameObjects.push(cloud)
          break;
          case "k":
            cloud = new Cloud({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              direction: false,
              speed: 2,
              image: images.cloud_center
            })
            gameObjects.push(cloud)
          break;
          case "l":
            cloud = new Cloud({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              direction: false,
              speed: 2,
              image: images.cloud_right
            })
            gameObjects.push(cloud)
          break;
          case 7:
            var victoryTile = new VictoryTile({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              }
            })
            gameObjects.push(victoryTile)
          break;
          case 8:
            var cloud1 = new Decor({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.cloud1
            })
            gameObjects.push(cloud1)
          break;
          case 9:
            var cloud2 = new Decor({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.cloud2
            })
            gameObjects.push(cloud2)
          break;
          case 'A':
            var bush1 = new Decor({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.bush1
            })
            gameObjects.push(bush1)
          break;
          case 'B':
            var bush2 = new Decor({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.bush2
            })
            gameObjects.push(bush2)
          break;
          case 'C':
            var invisible = new DeathTile({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              particles: false
            })
            gameObjects.push(invisible)
          break;
          case 'D':
            var spike = new Spike({
              sprite: SpriteSheet.new(images.spike, images.spike_blueprint),
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              totalWalkDistance: 48
            })
            gameObjects.push(spike)
          break;
          case 'E':
            var spike = new Spike({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              sprite: SpriteSheet.new(images.spike, images.spike_blueprint),
              totalWalkDistance: 48 * 3
            })
            gameObjects.push(spike)
          break;
          case 'F':
            var spike = new Spike({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              sprite: SpriteSheet.new(images.spike, images.spike_blueprint),
              totalWalkDistance: 48 * 7
            })
            gameObjects.push(spike)
          break;
          case 'G':
            var egg = new Decor({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.egg
            })
            gameObjects.push(egg)
          break;
        }
      })
    })

    scroller.screenOffset = map.length * TILE_SIZE - canvasHeight

    var lowestTile
    gameObjects.forEach(function (gob) {
      if (lowestTile) {
        if (gob.pos.y > lowestTile.pos.y) {
          lowestTile = gob
        }
      } else {
        lowestTile = gob
      }
    })

    murrio.currentTileLevel = lowestTile.pos.y
  }

  function playerAlive() {
    var playerDead = _.filter(gameObjects, function(item) {
        return item instanceof Murrio;
      }).length;
    return (playerDead !== 0);
  }

  function endConditions() {
    return false;
  }

  function init(_playSound) {
    grandpa = null
    murrio = null
    victoryTile = null

    canvasWidth = 1024
    canvasHeight = 768

    gameOver = false
    playSound = _playSound || playSound

    gameObjects = []

    playSound('gameMusic', false, true)

    scroller = new ScreenScroller();

    loadMap(map.getMap()[currentMapIdx]);

    actualScreenOffset = scroller.screenOffset
  }

  window.addEventListener("keydown", function(e) {
    if (!DEBUG_HOTKEYS) return;
    if (e.keyCode === 83) { // s
      murrio.pos.x = murrio.pos.x + 1000;
    }
    if (e.keyCode === 78) { // n
      currentMapIdx++;
      init();
    }
    if (e.keyCode === 66) { // b
      currentMapIdx = 0;
      init();
    }
    if (e.keyCode === 67) { // c
      playSound('die');
      murrio.destroy();
      var deathconfig = {
        pos: {
          x: murrio.pos.x,
          y: murrio.pos.y
        }
      }
      gameObjects.push(new MurrioDeathAnimation(deathconfig));
    }
  })

  var actualScreenOffset

  return {
    init: init,
    tick: function() {
      endConditions();
      if (hasWon) {
        flag.tick()
        return
      }
      _.each(gameObjects, function (gameObject) {
        gameObject.tick();
      });
      scroller.tick();

      gameObjects = gameObjects.filter(function (gameObject) {
        return !gameObject.markedForRemoval
      });
    },
    draw: function (renderingContext) {
      var offsetArray = utils.interpolateLinear(1344 + 258 + 10, 0, -256)
      var offset = offsetArray[actualScreenOffset];
      if (actualScreenOffset <= 0)
        offset = 0;
      renderingContext.drawImage(images.sky,0,offset)

      renderingContext.save();
      if (actualScreenOffset >= scroller.screenOffset) {
        actualScreenOffset -= 2
      }
      renderingContext.translate(0, -actualScreenOffset);
      _.each(gameObjects, function (gameObject) {
        if (gameObject instanceof Decor) gameObject.draw(renderingContext)
      })
      _.each(gameObjects, function (gameObject) {
        if (!(gameObject instanceof Decor || gameObject instanceof GameRestarter))
          gameObject.draw(renderingContext)
      })

      if (flag) {
        flag.draw(renderingContext)
      }

      renderingContext.restore();

      if (showVictoryText) {
        renderingContext.drawImage(images.victory_text, 320, 220)
      }

      _.each(gameObjects, function (gameObject) {
        if (gameObject instanceof GameRestarter) gameObject.draw(renderingContext)
      })
    },
    destroy: function() {
      playSound('gameMusic', true)
    }
  }
})
