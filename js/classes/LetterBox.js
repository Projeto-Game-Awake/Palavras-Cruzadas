class LetterBox extends Phaser.GameObjects.Container {

    constructor(scene,x,y,direction,letter, tip, isVisible) {
        let box = scene.add.rectangle(0,0,30,30, 0xffffff);
        box.setStrokeStyle(4, 0x000000);
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
        if(this.inputLetter != "") {
            this.text.setText(this.inputLetter);
        }
        this.tip = tip;

        this.nextLetter = [];
        this.currentMove = 0;
        scene.add.existing(this);
    }

    select() {
        if(this.isVisible) {
            return;
        }
        if(this.scene.selected) {
            this.scene.selected.box.setStrokeStyle(4, 0x000000);
        }
        this.box.setStrokeStyle(4, 0xcccccc);
        this.scene.before = this.scene.selected;
        if(this.scene.keyBoard.alpha == 1) {
            this.scene.children.bringToTop(this);
        }
        this.scene.selected = this;
    }

    setText(key) {
        if(!this.isVisible) {
            this.inputLetter = key;
            this.text.setText(key);
        }

        if(this.scene.isRegister) {
            this.scene.moveDirection(this.x/30-1,this.y/30-1);
        } else {
            let next = this.nextLetter[this.currentMove];
            if(next.inputLetter != "") { 
                if(next.isVisible || next.nextLetter[next.currentMove].inputLetter == "") {
                    let next = this.nextLetter[this.currentMove];
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
    }

    isMatch() {
        return this.inputLetter == this.letter || (this.inputLetter == "C" && this.letter == "Ç")
    }
}