class KeyBoard extends Phaser.GameObjects.Container {

    constructor(scene) {
        let rectangle = scene.add.rectangle(-40,-40,630,300, 0xcccccc);
        rectangle.setOrigin(0);
        let items = [rectangle];

        let keyBoardLines = [];
        keyBoardLines.push("QWERTYUIOP".split(""));
        keyBoardLines.push("ASDFGHJKLÇ".split(""));
        keyBoardLines.push("ZXCVBNM".split(""));

        let startX = 0;
        for(let i=0;i<keyBoardLines.length;i++) {
            for(let j=0;j<keyBoardLines[i].length;j++) {
                let key = new KeyBox(scene, startX+60*j,60*i,keyBoardLines[i][j]);
                items.push(key);
            }
            startX += 10;
        }
        super(scene,60,420, items);

        rectangle.setInteractive();
        rectangle.on(
            "pointerdown",
            () => {
                if(this.alpha == 0.5) {
                    this.alpha = 1;
                    scene.children.sendToBack(this);                    
                } else {
                    this.alpha = 0.5;
                    scene.children.bringToTop(this);                    
                }
        },this);

        scene.add.existing(this);
    }

}