const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let obstacles;
let score = 0;
let scoreText;

function preload() {
  this.load.image('player', 'assets/player.png');
  this.load.image('obstacle', 'assets/obstacle.png');
}

function create() {
  player = this.physics.add.sprite(100, config.height / 2, 'player');
  player.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();

  obstacles = this.physics.add.group();
  this.time.addEvent({
    delay: 1000,
    loop: true,
    callback: spawnObstacle
  });

  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
}

function update() {
  if (cursors.up.isDown) {
    player.setVelocityY(-200);
  } else if (cursors.down.isDown) {
    player.setVelocityY(200);
  } else {
    player.setVelocityY(0);
  }

  this.physics.world.collide(player, obstacles, gameOver, null, this);
}

function spawnObstacle() {
  const obstacle = obstacles.create(config.width, Phaser.Math.Between(50, config.height - 50), 'obstacle');
  obstacle.setVelocityX(-200);
  obstacle.setCollideWorldBounds(false);
  obstacle.setBounce(1);
}

function gameOver() {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  scoreText.setText(`Score: ${score}. Press R to restart.`);
  const restartKey = this.input.keyboard.addKey('R');
  restartKey.on('down', () => {
    this.scene.restart();
  });
}

