var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function () {
    // マップ画像の表示
    var map01Group = this.add.group({
        key: 'map01',
        frameQuantity: 192
    });
    Phaser.Actions.GridAlign(map01Group.getChildren(), {
        width: 16,
        height: 12,
        cellWidth: 50,
        cellHeight: 50,
        x: 25,
        y: 25
    });
    
    // スプライト画像の表示
    this.player = this.add.sprite(400, 300, 'player');
    // スプライト画像のサイズを1.5倍にする
    this.player.setScale(1.5);
    // 最初のフレームを4番にする
    this.player.setFrame(0);
    
    // 正面を向く
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 0 } ],
        frameRate: 20
    });
    // 左向きのアニメーション
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    // 右向きのアニメーション
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    // 上向きのアニメーション
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
        frameRate: 10,
        repeat: -1
    });
    // 下向きのアニメーション
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    
    // 宝箱を表示する
    this.treasure03 = this.add.image(0,0,'treasure03').setOrigin(0,0);
    this.treasure03.setRandomPosition(0, 0, 800 - this.treasure03.width, 600 - this.treasure03.height);
    
    // 重なったときに上に表示される画像を指定する。大きい数値が手前に表示される
    this.player.setDepth(1);
    this.treasure03.setDepth(0);

    this.hp = 50;
    
    // HPを文字で表示する
    this.hpText = this.add.text(30, 20, 'HP: ' + this.hp, {
        font: '28px Open Sans',
        fill: '#ffffff'
    });
    
    // 敵のグループを作成
    this.enemies = this.add.group({
        key: 'enemy07',
        repeat: 5,
    });
    
    // 敵のグループの画像を設定
    var enemies = this.enemies.getChildren();
    for( var i in enemies) {
        var enemy = enemies[i];
        enemy.setSize(50, 50);
        enemy.setDisplaySize(50, 50);
        enemy.setOrigin(0,0);
        enemy.setRandomPosition(0, 0, 800 - enemy.width, 600 - enemy.height);
        enemy.isHit = false;
    }
    
    // 終了処理フラグ
    this.isTerminating = false;
};

mainScene.update = function() {
    // 終了処理なら、処理を実行しない
    if( this.isTerminating ) {
        this.player.anims.stop();
        return;
    }
    
    var speed = 5;
    var cursors = this.input.keyboard.createCursorKeys();
    if(cursors.right.isDown) {
        // 右に移動
        this.player.x += speed;
        // 右向きのアニメーション
        this.player.anims.play('right', true);
    } else if(cursors.left.isDown) {
        // 左に移動
        this.player.x -= speed;
        // 左向きのアニメーション
        this.player.anims.play('left', true);
    } else if(cursors.up.isDown) {
        // 上に移動
        this.player.y -= speed;
        // 上向きのアニメーション
        this.player.anims.play('up', true);
    } else if(cursors.down.isDown) {
        // 下に移動
        this.player.y += speed;
        // 下向きのアニメーション
        this.player.anims.play('down', true);
    } else {
        // キーを放すとアニメーション停止
        this.player.anims.stop();
        // キーを放すと正面を向く
        //this.player.anims.play('turn', true);
    }
    
    /*
    // 画像の四角形での位置座標を取り出す
    var playerRect = this.player.getBounds();
    var treasure03Rect = this.treasure03.getBounds();
    
    // 四角形の重なりを判定する
    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasure03Rect)) {
        alert("宝箱を見つけました");
        // 現在のシーンをリスタートする
        this.scene.restart();
        return;
    }
    */
    
    // 画像の中心点の座標を取り出す
    var playerVector2 = this.player.getCenter();
    var treasure03Vector2 = this.treasure03.getCenter();
    
    // 画像の中心点の距離を計算して、距離が40以下なら重なると判定する
    if(playerVector2.distance(treasure03Vector2) <= 40) {
        alert("宝箱を見つけました");
        // 現在のシーンをリスタートする
        this.scene.restart();
        return;
    }
    
    // 敵との判定
    var enemies = this.enemies.getChildren();
    for( var i in enemies) {
        var enemy = enemies[i];
        var enemyVector2 = enemy.getCenter();
        // 距離が40以下なら接触と判定
        if(playerVector2.distance(enemyVector2) <= 40) {
            // enemiyのisHitがfalseならHPを減少させる
            if( !enemy.isHit ) {
                this.hp -= 10;
                this.hpText.setText("HP : " + this.hp);
                // HPを減少させ続けないための処理
                enemy.isHit = true;
            }
        } else {
            // 距離が離れたら、isHitをfalse
            enemy.isHit = false;
        }
    }
    if( this.hp <= 0) {
        this.gameOver();
        return;
    }
};

mainScene.gameOver = function() {
    // 終了処理をTrueに設定する
    this.isTerminating = true;

    // メインカメラをシェークする
    this.cameras.main.shake(1000);
    // フェードアウトする
    //this.cameras.main.fadeOut(1000);
    // 点滅させる
    //this.cameras.main.flash(1000);
    // 赤色で点滅させる
    //this.cameras.main.flash(1000, 255, 0, 0);
    
    // シェークの完了後に実行する
    this.cameras.main.on('camerashakecomplete', function(camera, effect){
        // 赤色にフェードアウトする
        this.cameras.main.fadeOut(1000, 255, 0, 0);
    }, this);
    
    // フェードアウト完了後に実行する
    this.cameras.main.on('camerafadeoutcomplete', function(camera, effect){
        // ゲームをリスタートする
        alert("Game Over");
        //this.scene.restart();
        this.scene.start('startScene');
    }, this);
};
