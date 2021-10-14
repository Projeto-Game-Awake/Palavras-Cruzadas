class LetterBox extends Phaser.GameObjects.Container {

    constructor(scene,x,y,direction,letter, tip, isVisible) {
        let box = scene.add.rectangle(0,0,30,30, 0xffffff);
        box.setInteractive();
        let text = null;
        if(Number.isInteger(letter)) {
            box.on(
            "pointerdown",
            () => {
                this.scene.message = this.tip;
                this.scene.showMessage(true);
            });
            text = scene.add.text(0,0, letter, 
                {color: '#f00'}
            );
        } else {
            box.on(
            "pointerdown",
            () => {
                this.select()
            });
            text = scene.add.text(0,0, "", 
                {color: '#000'}
            );
        }
        
        text.setOrigin(0.5);
        super(scene,x,y,[box,text]);

        this.scene = scene;
        this.box = box;
        this.text = text;
        this.directions = [direction];
        
        this.letter = letter;
        this.isVisible = isVisible === true ? true : false;
        this.inputLetter = this.isVisible ? letter : "";

        this.indexes = [];

        if(this.inputLetter != "") {
            this.text.setText(this.inputLetter);
        }
        this.tip = tip;

        this.nextLetter = [];
        this.currentMove = 0;

        this.setColorBox(box);
        
        scene.add.existing(this);
    }
    select() {
        if(this.isVisible) {
            return;
        }
        if(this.scene.selected) {
            this.setColorBox(this.scene.selected.box);
        }
        if(!this.isVisible) {
            this.box.setStrokeStyle(2, 0xcccccc);
            this.scene.before = this.scene.selected;
            if(this.scene.keyBoard.alpha == 1) {
                this.scene.children.bringToTop(this);
            }
            this.scene.selected = this;
        }
        if(this.nextLetter.length == 1) {
            this.scene.currentDirection = this.directions[0];            
        }
    }
    setColorBox(box) {
        if(this.isVisible) {
            box.setStrokeStyle(2, 0x0000ff);
        } else {
            box.setStrokeStyle(2, 0x000000);
        }
    }
    checkWord(currentMove) {
        let word = "";
        let wordInput = "";        
        let list = [];
        let currentWord = this.indexes[currentMove];
        if(currentWord.minX != currentWord.maxX) {
            for(let i=currentWord.minX-1;i<=currentWord.maxX;i++) {
                let item = this.scene.collection[i][currentWord.minY];
                if(item == null) {
                    continue;
                } else if(this.isDigit(item)) {
                    
                } else if(item.letter == "Ç") {
                    word += "C";
                    wordInput += item.inputLetter;  
                } else {
                    word += item.letter;
                    wordInput += item.inputLetter;  
                }                
                list.push(item);
            }
        } else {
            for(let i=currentWord.minY-1;i<=currentWord.maxY;i++) {
                let item = this.scene.collection[currentWord.minX][i];
                if(item == null) {
                    continue;
                } else if(this.isDigit(item)) {

                } else if(item.letter == "Ç") {
                    word += "C";
                    wordInput += item.inputLetter;  
                } else {
                    word += item.letter;
                    wordInput += item.inputLetter;  
                }            
                list.push(item);
            }
        }
        console.log(word +"-"+ wordInput);
        if(word == wordInput) {
            for(let i=0;i<list.length;i++) {
                list[i].setFound();
            }
        }
    }
    isDigit(item) {
        let c = item.letter.toString().charAt(0);
        return (c >= '0' && c <= '9');
    }
    setFound() {
        this.box.setStrokeStyle(4, 0x0000ff);
        this.isVisible = true;
    }
    setText(key) {
        if(!this.isVisible) {
            this.inputLetter = key;
            this.text.setText(key);
        }

        if(this.scene.currentDirection != this.currentMove) {
            this.currentDirection = this.scene.currentMove;
        }

        if(!this.isVisible && this.scene.currentDirection != this.directions[this.currentMove]) {
            this.currentMove = ++this.currentMove % 2;
        } 
        let currentMove = this.currentMove;

        if(this.scene.isRegister) {
            this.scene.moveDirection(this.x/30-1,this.y/30-1);
        } else {
            let next = this.nextLetter[this.currentMove];
            if(next.inputLetter != "") {
                if(next.isVisible || next.nextLetter[next.currentMove].inputLetter == "") {
                    next.setText(next.inputLetter);
                } else {
                    this.nextLetter[this.currentMove].select();
                    if(this.nextLetter.length > 1) {
                        this.currentMove = ++this.currentMove % 2;
                    }
                }
            } else {
                this.nextLetter[this.currentMove].select();
                if(this.nextLetter.length > 1) {
                    this.currentMove = ++this.currentMove % 2;
                }
            }
        }

        this.checkWord(currentMove);
    }
    isMatch() {
        return this.inputLetter == this.letter || (this.inputLetter == "C" && this.letter == "Ç")
    }
}