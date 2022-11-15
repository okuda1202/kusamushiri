enchant();

window.onload = function () {
	const game = new Game(400, 500);  				//画面サイズを400*500にする。（このサイズだとスマホでも快適なのでおススメ）

	/////////////////////////////////////////////////
	//ゲーム開始前に必要な画像・音を読み込む部分


	//クリック音読み込み
	const clickSndUrl = "click.wav";						//game.htmlからの相対パス
	game.preload([clickSndUrl]); 				//データを読み込んでおく

	//ぞう山くん画像
	const zoyamaImgUrl = "zoyama.png";						//game.htmlからの相対パス
	game.preload([zoyamaImgUrl]);					//データを読み込んでおく

	//ちいかわ画像
	const chiikawaImgUrl = "chi.png";						//game.htmlからの相対パス
	game.preload([chiikawaImgUrl]);					//データを読み込んでおく

	//雑草画像
	const zassou = "zassou.png";
	game.preload([zassou]);

	//クロユリ画像
	const kuroyuri = "kuroyuri.png";
	game.preload([kuroyuri]);

	//リザルト画面１
	const sad = "cried.jpg";
	game.preload([sad]);

	//リザルト画面2
	const usagi = "over100.jpg";						//game.htmlからの相対パス
	game.preload([usagi]);					//データを読み込んでおく		

	//リトライボタン
	const retryImgUrl = "retry.png";						//game.htmlからの相対パス
	game.preload([retryImgUrl]);					//データを読み込んでおく

	//ツイートボタン
	const tweetImgUrl = "tweet.png";						//game.htmlからの相対パス
	game.preload([tweetImgUrl]);					//データを読み込んでおく		

	//読み込み終わり
	/////////////////////////////////////////////////


	game.onload = function () {					//ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう

		/////////////////////////////////////////////////
		//グローバル変数 

		let point = 0;									//ポイント
		let state = 0;								//現在のゲーム状態
		let kusa = 0;
		let time = 0;
		let result = 0;
		let monsters = []; //モンスタースプライトを管理する配列

		//グローバル変数終わり
		/////////////////////////////////////////////////



		const mainScene = new Scene();					//シーン作成
		game.pushScene(mainScene);  					//mainSceneシーンオブジェクトを画面に設置
		mainScene.backgroundColor = "rgb(0,55,0)"; 			//mainSceneシーンの背景は黒くした

		//ポイント表示テキスト
		const scoreText = new Label(); 					//テキストはLabelクラス
		scoreText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		scoreText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		scoreText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		scoreText.moveTo(0, 30);						//移動位置指定
		mainScene.addChild(scoreText);					//mainSceneシーンにこの画像を埋め込む

		scoreText.text = "現在：" + point;					//テキストに文字表示 Pointは変数なので、ここの数字が増える
		
		const timeText = new Label(); 					//テキストはLabelクラス
		timeText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		timeText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		timeText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		timeText.moveTo(270, 30);						//移動位置指定
		mainScene.addChild(timeText);					//mainSceneシーンにこの画像を埋め込む

		timeText.text = "時間：" + time + " s";					//テキストに文字表示 Pointは変数なので、ここの数字が増える
		
		
		//ぞう山ボタン
		const zoyamaImg = new Sprite(166, 168);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		zoyamaImg.moveTo(118, 100);						//ぞう山ボタンの位置
		zoyamaImg.image = game.assets[zoyamaImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		//mainScene.addChild(zoyamaImg);					//mainSceneにこのぞう山画像を貼り付ける 

		const zassouImg0 = new Sprite(180, 180);				
		zassouImg0.moveTo(-50, 100);						
		zassouImg0.image = game.assets[zassou];			
		//mainScene.addChild(zassouImg0);
		
		const zassouImg1 = new Sprite(166, 168);				
		zassouImg1.moveTo(100, 100);						
		zassouImg1.image = game.assets[zassou];			
		//mainScene.addChild(zassouImg1);				
	
		const zassouImg2 = new Sprite(166, 168);				
		zassouImg2.moveTo(250, 100);						
		zassouImg2.image = game.assets[zassou];			
		//mainScene.addChild(zassouImg2);	
		
		const chiikawa = new Sprite(200, 200);
		chiikawa.scale(0.5, 0.5);
		chiikawa.moveTo(250, 100);						
		chiikawa.image = game.assets[chiikawaImgUrl];			
		mainScene.addChild(chiikawa);	

		zoyamaImg.ontouchend = function () {				//ぞう山ボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			point++;									//Pointを1増やす
			game.assets[clickSndUrl].clone().play();		//クリックの音を鳴らす。

			//クリックしたのでぞう山画像のｘ位置を戻す
			this.x = -200;							//this.xって何？と思った方、Zoyamaの関数内でぞう山の座標を動かすときにはthisを使います。

			//ポイントによって状態Stateを変更する
			if (point < 3) {
				state = 1;
			} else if (point < 6) {
				state = 2;
			} else if (point < 9) {
				state = 3;
			} else if (point < 12) {
				state = 4;
			} else {
				state = 5;
			}

		};

		zassouImg0.ontouchend = function () {				//ぞう山ボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			point++;									//Pointを1増やす
			game.assets[clickSndUrl].clone().play();		//クリックの音を鳴らす。

			
			//this.x = -200;							
			this.opacity  -= 0.25;
			//chiikawa.moveTo(this.x, this.y);	

		};



		///////////////////////////////////////////////////
		//メインループ　ここに主要な処理をまとめて書こう
		game.onenterframe = function () {
				time += 1/30;
			

			const monster = new Sprite(180, 180); //スライムを配置
                    monster.image = game.assets[zassou]; //スライム画像
					monster.scale(0.5, 0.5);
                    monster.y = Math.random() * 360 + 25; //出現Y座標
                    monster.x = Math.random() * 360 - 50; //出現X座標
					
			if(kusa <= 5)
			{       
				kusa += 1;
                    mainScene.addChild(monster); //mainSceneシーンに追加
                    monster.number = monsters.length; //自分がmonstersのどこにいるか覚えておく(削除するときに使う)
                    monsters.push(monster); //monsters（モンスター管理用配列）に格納
                    monster.onenterframe = function () {
                        //モンスターの動作
                        //this.y += 2; //下に降りる
                        if (this.y >= 500) {
                            //画面下に入ったら
                            game.popScene(); //mainSceneシーンを外して
                            setEndScene(); // endSceneを呼び出す
                        }
                        if (this.frame == 15) this.frame = 0;
                        //フレームを動かす処理
                        else this.frame++; //もし3フレーム以内なら次のフレームを表示
                    };
			}

					monster.ontouchend = function () {				//ぞう山ボタンをタッチした（タッチして離した）時にこの中の内容を実行する
						point++;									//Pointを1増やす
						//game.assets[clickSndUrl].clone().play();		//クリックの音を鳴らす。
			
						//クリックしたのでぞう山画像のｘ位置を戻す
						//this.x = -200;							
						//this.opacity  -= 0.25;
						monster.parentNode.removeChild(monster); //スライムをmainSceneから外す
						kusa -= 1;
						chiikawa.moveTo(this.x, this.y);
			
					};

			//現在のテキスト表示
			scoreText.text = "現在：" + point; 				//point変数が変化するので、毎フレームごとにpointの値を読み込んだ文章を表示する
			timeText.text = "時間：" + Math.floor( 30 - (time * Math.pow( 10, 1) ) / Math.pow( 10, 1)) + " s";
			//ゲームオーバー判定
			if (time >= 30) {						//画面端にぞう山画像が行ってしまったら
				game.popScene();					//mainSceneシーンを外す
				game.pushScene(endScene);				//endSceneシーンを読み込ませる

				//ゲームオーバー後のテキスト表示
				gameOverText.text = "記録：" + point + " 草";				//テキストに文字表示 
				time = 0;
				result = point;
				point = 0;
			}

		};

		

		////////////////////////////////////////////////////////////////
		//結果画面
		const endScene = new Scene();
		endScene.backgroundColor = "rgb(174,186,197)";

		//GAMEOVER
		const gameOverText = new Label(); 					//テキストはLabelクラス
		gameOverText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		gameOverText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		gameOverText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		gameOverText.moveTo(0, 30);						//移動位置指定
		endScene.addChild(gameOverText);						//endSceneシーンにこの画像を埋め込む


		//リザルト画像
		const sad_img = new Sprite(272, 271);
		sad_img.scale(0.8, 0.8);
		sad_img.moveTo(70, 80);						//リトライボタンの位置
		sad_img.image = game.assets[sad];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		//endScene.addChild(sad_img);					
		//リザルト2
		const usage_img = new Sprite(1016, 510);
		usage_img.scale(0.4, 0.4);
		usage_img.moveTo(-310, -20);						//リトライボタンの位置
		usage_img.image = game.assets[usagi];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		if(result>=100){
		endScene.addChild(usage_img);
		}
		else if(result < 100){
			endScene.addChild(sad_img);
		}

		//リトライボタン
		const retryBtn = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		retryBtn.moveTo(50, 330);						//リトライボタンの位置
		retryBtn.image = game.assets[retryImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		endScene.addChild(retryBtn);					//endSceneにこのリトライボタン画像を貼り付ける  

		retryBtn.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			state = 0;
			game.popScene();						//endSceneシーンを外す
			game.pushScene(mainScene);					//mainSceneシーンを入れる
		};

		//ツイートボタン
		const tweetBtn = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		tweetBtn.moveTo(230, 330);						//リトライボタンの位置
		tweetBtn.image = game.assets[tweetImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		endScene.addChild(tweetBtn);					//endSceneにこのリトライボタン画像を貼り付ける  

		tweetBtn.ontouchend = function () {				//S_Tweetボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			//ツイートＡＰＩに送信
			//結果ツイート時にURLを貼るため、このゲームのURLをここに記入してURLがツイート画面に反映されるようにエンコードする
			const url = encodeURI("https://okuda1202.github.io/kusamushiri/");
			window.open("http://twitter.com/intent/tweet?text=頑張って" + result + "草入手した&hashtags=ahoge&url=" + url); //ハッシュタグにahogeタグ付くようにした。
		};

	};
	game.start();
};