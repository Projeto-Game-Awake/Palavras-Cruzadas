class LetterBox extends Phaser.GameObjects.Container {

    constructor(scene,x,y,direction,letter, tip) {
        let box = scene.add.rectangle(0,0,30,30, 0xffffff);
        box.setStrokeStyle(4, 0x000000);
        box.setInteractive();
        let text = null;
        if(Number.isInteger(letter)) {
            box.on(
            "pointerdown",
            () => {
                alert(this.tip);
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
        this.inputLetter = "";
        this.tip = tip;

        this.nextLetter = [];
        scene.add.existing(this);
    }

    select() {
        if(this.scene.selected) {
            this.scene.selected.box.setStrokeStyle(4, 0x000000);
        }
        this.box.setStrokeStyle(4, 0xcccccc);
        this.scene.before = this.scene.selected;
        this.scene.children.bringToTop(this);
        this.scene.selected = this;
    }

    setText(key) {
        this.inputLetter = key;
        this.text.setText(key);

        if(this.nextLetter.length > 1) {
            for(let i=0;i<this.nextLetter.length;i++) {
                if(this.scene.before.directions[0] == this.nextLetter[i].directions[0]) {
                    this.nextLetter[i].select();
                    return;
                }
            }
        } else {
            this.nextLetter[0].select();
        }
    }

    isMatch() {
        return this.inputLetter == this.letter
    }
}