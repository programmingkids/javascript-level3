// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');
    // 背景画像
    this.load.image('background', 'assets/images/background01.png');
    // プレイヤースプライト
    this.load.spritesheet('player', 'assets/images/jets.png', { frameWidth: 64, frameHeight: 64 });
    // ビームスプライト
    this.load.spritesheet('beam', 'assets/images/beam01.png', { frameWidth: 16, frameHeight: 16 });
    // パーティクル用画像
    this.load.image('fire', 'assets/images/fire.png');
    // 敵画像
    this.load.image('enemy01', 'assets/images/enemy01.gif');
    this.load.image('enemy02', 'assets/images/enemy02.png');
    this.load.image('enemy03', 'assets/images/enemy03.png');
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
