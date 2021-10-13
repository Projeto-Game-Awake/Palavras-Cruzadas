class KeyBoard extends Phaser.GameObjects.Container {

    constructor(scene) {
        let x = -40;
        let y = -40;
        if(isMobile()) {
            y -= 300;
        }
        let rectangle = scene.add.rectangle(x,y,630,300, 0xcccccc);
        rectangle.setOrigin(0);
        let items = [rectangle];

        let keyBoardLines = [];
        keyBoardLines.push("QWERTYUIOP".split(""));
        keyBoardLines.push("ASDFGHJKLÇ".split(""));
        keyBoardLines.push("ZXCVBNM".split(""));

        let startX = 0;
        for(let i=0;i<keyBoardLines.length;i++) {
            for(let j=0;j<keyBoardLines[i].length;j++) {
                let key = new KeyBox(scene, x+40+startX+60*j,y+40+60*i,keyBoardLines[i][j]);
                items.push(key);
            }
            startX += 10;
        }
        super(scene,60,420, items);

        scene.add.existing(this);
    }

}