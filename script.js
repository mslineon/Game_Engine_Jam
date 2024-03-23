class Main extends Phaser.Scene {
    text;

    constructor() {
        super();// get the details from Phaser
        this.blocks = null; // declare the blocks variable
    }

    preload ()
    {
        this.load.image('block', 'assets/feather.png'); // image load of feather
        this.load.spritesheet('boom', 'assets/wind.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 }); // image loads of blowing
        this.load.audio('sfx', 'assets/sounds/airsound.wav'); // sound of blowing
    }

    create ()
    {
        this.text = this.add.text(50, 520, '').setFontFamily('helvetica').setFontSize(20).setColor('#FF0000');

        this.sound.pauseOnBlur = false;

        var timer = this.time.addEvent({
            delay: 100,                // ms
            callback: this.addFeather,
            //args: [],
            callbackScope: this,
            loop: true
        });

        this.anims.create({
            key: 'explode',
            frames: 'boom',
            frameRate: 20,
            showOnStart: true,
            hideOnComplete: true
        });

        this.blocks = this.physics.add.group({
            defaultKey: 'block',
            bounceX: 1,
            bounceY: 1,
            collideWorldBounds: true,
            dragX: 0.5,
            dragY: 0.5,
            useDamping: true
        });

        for (let i = 0; i < 10; i++)
        {
            const block = this.blocks.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500));
            block.setGravityY(80); // Gravity to go down

            block.setMass(Phaser.Math.Between(1, 2));
            // block.setScale(0.5 * Math.random()+ 0.1);
            block.setScale(0.3 * block.body.mass ** 0.5);
        }

        const boom = this.add.sprite(0, 0, 'boom').setBlendMode('ADD').setScale(4).setVisible(false);
       
        this.music = this.sound.add('sfx', {
            volume: 1
        });
        this.music.loop = false;
        this.music.play();
        this.music.pause();

        this.input.on('pointerdown', (pointer) =>
        {    
            this.music.play();
            boom.copyPosition(pointer).play('explode');

            const distance = new Phaser.Math.Vector2();
            const force = new Phaser.Math.Vector2();
            const acceleration = new Phaser.Math.Vector2();

            for (const block of this.blocks.getChildren())
            {
                distance.copy(block.body.center).subtract(pointer);
                force.copy(distance).setLength(5000000 / distance.lengthSq()).limit(500);
                acceleration.copy(force).scale(1 / block.body.mass);
                block.body.velocity.add(acceleration);
                
                var rotationSpeed = force.x * 0.5; 
                block.setAngularVelocity(rotationSpeed);
            }
        });
    }


    addFeather() {
        const block = this.blocks.create(Phaser.Math.Between(100, 700), 0);
        block.setGravityY(80); // Gravity to go down

        block.setMass(Phaser.Math.Between(1, 2));
        // block.setScale(0.5 * Math.random()+ 0.1);
        block.setScale(0.3 * block.body.mass ** 0.5);
        
    }

update(){
    this.text.setText(`CPU usage: ${
        (61 - this.physics.world.fps) * (100/60)  + Math.random()
    }%`);
}
}


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: Main,
};

const game = new Phaser.Game(config);