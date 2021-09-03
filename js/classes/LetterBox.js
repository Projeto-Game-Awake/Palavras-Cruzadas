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
        this.scene.children.bringToTop(this);
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
            if(this.nextLetter.length > 1) {
                for(let i=0;i<this.nextLetter.length;i++) {
                    for(let d=0;d<this.scene.before.directions.length;d++) {
                        for(let d2=0;d2<this.nextLetter[i].directions.length;d2++) {
                            if(this.scene.before.directions[d] == this.nextLetter[i].directions[d2]) {
                                this.nextLetter[i].select();
                                return;
                            }
                        }
                    }
                }
            } else {
                if(this.nextLetter[0].isVisible) {
                    for(let i=0;i<this.nextLetter.length;i++) {
                        this.nextLetter[i].setText(key);
                    }
                } else {
                    this.nextLetter[0].select();
                }
            }
        }
    }

    isMatch() {
        return this.inputLetter == this.letter || (this.inputLetter == "C" && this.letter == "Ç")
    }
}