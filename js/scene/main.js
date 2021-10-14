class Main extends Phaser.Scene
{
    static direction = {
        UP : 0,
        RIGHT : 1,
        DOWN : 2,
        LEFT : 3
    }

    static directionMove = [
        {x:0,y:1},
        {x:1,y:0},
        {x:0,y:-1},
        {x:-1,y:0},
    ]

    constructor ()
    {
        super('main');
    }

    init(data) {
        this.words = data.words;
        this.grid  = data.grid;
    }

    preload ()
    {
        this.load.html('start', '/html/start.html');
        this.load.json('jogo', "data/" + jogo + ".json"); 
    }

    create ()
    {
        try {
            let json = this.cache.json.get("jogo");
            this.words = json.words;
            this.grid = json.grid;
        } catch {
            alert("Jogo "+jogo+" inválido!");
            return;
        }

        this.keyBoard = new KeyBoard(this);

        let keysList = "ABCDEFGHIJKLMNOPQRSTUVXWYZÇ".split("");
        for(let i=0;i<keysList.length;i++) {
            this.input.keyboard.on('keydown-' + keysList[i], this.keyPress(keysList[i]), this);
        }

        this.input.keyboard.on('keydown-BACKSPACE', this.keyPress(null), this);
        
        this.selected = null;
        this.before = null;

        this.collection = [];
        for(let i=0;i<this.grid.x;i++) {
            this.collection[i] = [];
            for(let j=0;j<this.grid.y;j++) {
                this.collection[i][j] = null;
            }
        }

        let beforeLetter = null;
        let visibles = 0;
        let first = null;

        let boxSize = 32;

        for(let i=0;i<this.words.length;i++) {
            let word = this.words[i];
            let letters = word.word.toUpperCase().split("");
            let x = word.x;
            let y = word.y;
            let directionMove = Main.directionMove[this.words[i].direction];
            let isVisible = this.words[i].isVisible;

            if(isVisible) {
                visibles++;
            } else {
                let letterBox = new LetterBox(this,
                    boxSize+x*boxSize,
                    boxSize+y*boxSize,
                    null,
                    i+1-visibles,
                    this.words[i].tip);

                this.collection[x][y] = letterBox;

                x+=directionMove.x;
                y+=directionMove.y;
            }
            let list = [];
            let minX = x;
            let minY = y;
            let maxX = x;
            let maxY = y;
            for(let j=0;j<letters.length;j++) {
                let letterBox = this.collection[x][y];
                if(letterBox == null) {
                    letterBox = new LetterBox(this,
                        boxSize+x*boxSize,
                        boxSize+y*boxSize,
                        this.words[i].direction,
                        letters[j],"",
                        isVisible);
                    if(this.selected == null && isVisible !== true) {
                        this.selected = letterBox;
                    }
                    this.collection[x][y] = letterBox;
                } else {
                    this.collection[x][y].directions.push(this.words[i].direction);
                }
                list.push(letterBox);
                if(first == null && !letterBox.isVisible) {
                    first = letterBox;
                }

                if(isVisible !== true) {
                    if(beforeLetter != null) {
                        beforeLetter.nextLetter.push(letterBox);
                    }
                    beforeLetter = letterBox;   
                }
                maxX = Math.max(maxX,x);
                maxY = Math.max(maxY,y);
                x+=directionMove.x;
                y+=directionMove.y;
            }
            for(let j=0;j<list.length;j++) {
                let item = {};
                item.minX = minX;
                item.minY = minY;
                item.maxX = maxX;
                item.maxY = maxY;
                list[j].indexes.push(item);
            }
        }

        beforeLetter.nextLetter.push(first);

        this.selected.select();

        let button = this.add.rectangle(750,60,80,80, 0x0000ff);
        button.setStrokeStyle(4, 0xdddddd);
        button.setInteractive();
        button.on(
        "pointerdown",
        () => {
            if(this.keyBoard.alpha == 0) {
                this.keyBoard.alpha = 0.5;
                this.children.bringToTop(this.keyBoard);
            } else {
                this.keyBoard.alpha = 0;
            }
            /*this.hasWon = true;
            for(let i=0;i<this.collection.length;i++) {
                for(let j=0;j<this.collection[i].length;j++) {
                    if(this.collection[i][j] != null && !this.collection[i][j].isMatch()) {
                        this.hasWon = false;
                    }
                }
            }
            if(this.hasWon) {
                this.message = "Parabéns";
            } else {
                this.message = "Tente novamente";
            }
            this.showMessage();*/
        });
    }

    keyPress(key) {
        return function() {
            if(this.selected && !this.selected.isVisible) {
                this.selected.setText(key);
            }
        }
    }

    showMessage(isTip) {
        let back = this.add.rectangle(0,0,800,600,0x000000);
        back.alpha = 0.6;
        back.setOrigin(0);
  
        let text;
        if(isTip) {
            text = this.add.text(400, 300, this.message, { 
                backgroundColor: '#68b5e9',
                fontFamily: "Arial Black",
                fontSize: 43 , 
                wordWrap: { width: 780, useAdvancedWrap: true }
            });
            text.setOrigin(0.5);
            text.setPadding(64, 16);
        } else {
            text = this.add.text(400, 300, this.message, { fontFamily: "Arial Black", fontSize: 82 });
            text.setOrigin(0.5);
      
            text.setStroke('#000000', 4);
            //  Apply the gradient fill.
            const gradient = text.context.createLinearGradient(0, 0, 0, text.height);
      
            if(this.hasWon) {
              gradient.addColorStop(0, '#111111');
              gradient.addColorStop(.5, '#00ff00');
              gradient.addColorStop(.5, '#11aa11');
              gradient.addColorStop(1, '#111111');
            } else {
              gradient.addColorStop(0, '#111111');
              gradient.addColorStop(.5, '#ffffff');
              gradient.addColorStop(.5, '#aaaaaa');
              gradient.addColorStop(1, '#111111');
            }
            text.setFill(gradient);
        }
  
        back.setInteractive();
        back.on(
            "pointerdown",
            () => {
                text.destroy();
                back.destroy();
            });
      }

}