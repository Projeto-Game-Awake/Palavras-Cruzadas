class Game extends Phaser.Scene
{
    constructor ()
    {
        super('game');
    }

    preload ()
    {
        this.load.html('start', '/html/start.html');
    }

    create ()
    {
        let element = this.add.dom(800 / 2, 0).createFromCache('start');
    
        element.addListener('click');

        element.on('click', (event) => {

            if (event.target.name === 'playButton')
            {
                
                //  Turn off the click events
                element.removeListener('click');

                //  Hide the login element
                element.setVisible(false);

                this.scene.start('explore',{sceneName:"tutorial" + (++tutorial)});
            }
        });

        this.scene.start('main');


        this.tweens.add({
            targets: element,
            y: 400,
            duration: 500,
            ease: 'Power3'
        });
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent:"game",
        width: 800,
        height: 600
    },
    dom: {
        createContainer: true
    },
    scene: [Game, Main, Register]
};

const options = {
    feelingSize: 48,
    plotSize: 64,
    cardWidth: 60,
    cardHeight: 124,
    marginY : (600 - 64 * 5)  / 2
}

let game = new Phaser.Game(config);

let url = new URL(window.location.href);
const jogo = url.searchParams.get("jogo");
