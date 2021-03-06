define('app/images', ['SpriteSheet'], function(SpriteSheet) {
  var idle = new Image();
  idle.src = "./assets/images/idle.png";

  var walk_animation_sprite = new Image();
  walk_animation_sprite.src = "./assets/images/walk_animation.png";

  var climber_dead = new Image();
  climber_dead.src = "./assets/images/climber_dead.png";

  var cloud_left = new Image();
  cloud_left.src = "./assets/images/cloud_left.png";

  var cloud_center = new Image();
  cloud_center.src = "./assets/images/cloud_center.png";

  var cloud_right = new Image();
  cloud_right.src = "./assets/images/cloud_right.png";

  var climber_swing_sheet = new Image();
  climber_swing_sheet.src = "./assets/images/climber_swing.png";

  var enemy_walk = new Image();
  enemy_walk.src = "./assets/images/enemy_walk.png";

  var walk_animation = SpriteSheet.new(walk_animation_sprite, {
    frames: [200, 200, 200],
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    restart: true,
    autoPlay: true,
  });

  var press_any_key_sprite = new Image();
  press_any_key_sprite.src = "./assets/images/pressanykey.png";

  var press_any_key = SpriteSheet.new(press_any_key_sprite, {
    frames: [200, 200],
    x: 0,
    y: 0,
    width: 320,
    height: 64,
    restart: true,
    autoPlay: true,
  });

  var jump = new Image();
  jump.src = "./assets/images/jump.png";

  var tile = new Image();
  tile.src = "./assets/images/tile.png";

  var tile2 = new Image();
  tile2.src = "./assets/images/tile2.png";

  var tile3 = new Image();
  tile3.src = "./assets/images/tile3.png";

  var lava = new Image();
  lava.src = "./assets/images/lava.png";

  var lava_blueprint = {
    frames: [200, 200],
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    restart: true,
    autoPlay: true,
  }

  var spike = new Image();
  spike.src = "./assets/images/spikmurr_animation.png";

  var climber_walk = new Image();
  climber_walk.src = "./assets/images/climber_walk.png";

  var climber_jump = new Image();
  climber_jump.src = "./assets/images/climber_jump.png";

  var spike_blueprint = {
    frames: [200, 200, 200],
    x: 0,
    y: 0,
    width: 64,
    height: 96,
    restart: true,
    autoPlay: true,
  }

  var pipe = new Image();
  pipe.src = "./assets/images/pipe.png";

  var won = new Image();
  won.src = "./assets/images/won.png";

  var dead = new Image();
  dead.src = "./assets/images/dead.png";

  var sky = new Image();
  sky.src = "./assets/images/sky.png";

  var pratbubblathanks = new Image();
  pratbubblathanks.src = "./assets/images/pratbubblathanks.png";

  var lavaparticle = new Image();
  lavaparticle.src = "./assets/images/lavaparticle.png";

  var cloud1 = new Image();
  cloud1.src = "./assets/images/cloud1.png";

  var cloud2 = new Image();
  cloud2.src = "./assets/images/cloud2.png";

  var bush1 = new Image();
  bush1.src = "./assets/images/bush1.png";

  var bush2 = new Image();
  bush2.src = "./assets/images/bush2.png";

  var grandpa = new Image();
  grandpa.src = "./assets/images/grandpa_sad.png";

  var grandpa_happy = new Image();
  grandpa_happy.src = "./assets/images/grandpa_happy.png";

  var youdidit = new Image();
  youdidit.src = "./assets/images/youdidit.png";

  var egg = new Image();
  egg.src = "./assets/images/egg.png";

  var particleSpike = new Image();
  particleSpike.src = "./assets/images/particleSpike.png";

  var particleIce = new Image();
  particleIce.src = "./assets/images/particleIce.png";

  var flag = new Image()
  flag.src = "./assets/images/victory_flag.png"

  var victory_text = new Image()
  victory_text.src = "./assets/images/victory_text.png"

  return {
    climber_dead: climber_dead,
    cloud_left: cloud_left,
    cloud_center: cloud_center,
    cloud_right: cloud_right,
    climber_swing_sheet: climber_swing_sheet,
    enemy_walk: enemy_walk,
    climber_jump: climber_jump,
    climber_walk: climber_walk,
    idle: idle,
    walk_animation: walk_animation,
    jump: jump,
    tile: tile,
    tile2: tile2,
    tile3: tile3,
    lava: lava,
    pipe: pipe,
    won: won,
    dead: dead,
    sky: sky,
    particleIce: particleIce,
    pratbubblathanks: pratbubblathanks,
    lavaparticle: lavaparticle,
    press_any_key: press_any_key,
    cloud1: cloud1,
    cloud2: cloud2,
    bush1: bush1,
    bush2: bush2,
    grandpa: grandpa,
    grandpa_happy: grandpa_happy,
    youdidit: youdidit,
    lava_blueprint: lava_blueprint,
    egg: egg,
    spike: spike,
    spike_blueprint: spike_blueprint,
    particleSpike: particleSpike,
    flag: flag,
    victory_text: victory_text,
  }
})