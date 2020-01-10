// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // 画像の読み込み
    this.load.image('map01', 'assets/images/map01.png');
    this.load.image('treasure03', 'assets/images/treasure03.png');
    this.load.image('enemy07', 'assets/images/enemy07.png');
    this.load.image('startButton', 'assets/images/start.gif');
    // スプライト画像の読み込み
    this.load.spritesheet('player', 'assets/images/player5.png', { frameWidth: 32, frameHeight: 32 });
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
