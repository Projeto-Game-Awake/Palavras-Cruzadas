class KeyBox extends Phaser.GameObjects.Container {

    constructor(scene,x,y,letter) {
        let box = scene.add.rectangle(0,0,60,60, 0x000000);
        box.setStrokeStyle(4, 0xdddddd);
        box.setInteractive();
        box.on(
        "pointerdown",
        () => {
            if(scene.selected) {
                scene.selected.setText(letter);
            }
        });
        let text = scene.add.text(0,0,letter, 
            {color: '#fff'}
        );
        text.setOrigin(0.5);
        super(scene,x,y,[box,text]);

        this.box = box;
        this.text = text;

        scene.add.existing(this);
    }

    setText(key) {
        this.text.setText(key);
    }
}