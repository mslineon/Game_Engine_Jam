

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { 
                y: 40 // Simulate the feather falling
            } 
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    // Load images for the feather, backgrounds, obstacles, and collectibles
    this.load.image('feather', 'assets/feather.png');
}

function create() {
    // Feather
    this.feather = this.physics.add.sprite(400, 200, 'feather');
    this.feather.setScale(0.5);
    // this.feather.setRotation(0.5);

    // fall with gravity but not too quick! 
    this.feather.setGravityY(100);

    this.feather.driftAmplitude = 150; // Max distance the feather moves left or right
    this.feather.upDriftAmplitude = 4.0;
    this.feather.driftSpeed = 0.002; // How fast the feather drifts side to side
    this.feather.initialX = this.feather.x; // Initial X position for reference in the sine calculation
    this.feather.initialY = this.feather.y;
    this.feather.driftTime = 0; // Time counter for the sine function
}

function update(time, delta) {
    // Existing code to calculate the feather's drifting
    this.feather.driftTime += this.feather.driftSpeed * delta;
    var driftX = Math.sin(this.feather.driftTime) * this.feather.driftAmplitude;
    var driftY = (Math.sin(this.feather.driftTime * 1.0)) * this.feather.upDriftAmplitude;
    
    // Get the mouse position
    var mouseX = this.input.mousePointer.x;
    var mouseY = this.input.mousePointer.y;

    // Calculate the distance between the feather and the mouse
    var deltaX = this.feather.x - mouseX;
    var deltaY = this.feather.y - mouseY;
    var distanceFromMouse = Math.sqrt(deltaX ** 2 + deltaY ** 2) / 200.0;

    var repulsionForce = Math.exp(-distanceFromMouse);
    var angle = Math.atan2(deltaX, deltaY);

    // var distanceToMouseY = this.feather.y - mouseY;

    // // If the mouse is too close to the feather, adjust the feather's X position to "avoid" the mouse
    // if (Math.abs(distanceToMouseX) < 50) { // "150" is the avoidance threshold; adjust as needed
    //     // Move away from the mouse. If the mouse is left of the feather, move right, and vice versa
    //     // var runAwayX = Math.abs(50 - distanceToMouseX);
    //     driftX += distanceToMouseX > 0 ? 2 : -2; // "100" adjusts the avoidance strength; tweak as needed
    // }
    // if (Math.abs(distanceToMouseY) < 100) { // "150" is the avoidance threshold; adjust as needed
    //     // Move away from the mouse. If the mouse is left of the feather, move right, and vice versa
    //     var runAwayY = Math.abs(100 - distanceToMouseY)*0.5;
    //     driftY += distanceToMouseY > 0 ? 0 : -runAwayY; // "100" adjusts the avoidance strength; tweak as needed
    // }

    
    var repulsionAmount = 10.0;
    this.feather.initialX += Math.cos(angle) * repulsionForce * repulsionAmount;
    this.feather.initialY += Math.sin(angle) * repulsionForce * repulsionAmount;
    // Apply the adjusted or regular drift X position to the feather
    this.feather.setX(this.feather.initialX + driftX);  //- Math.cos(angle) * repulsionForce * repulsionAmount);
    this.feather.setY(this.feather.initialY + driftY);
    //this.feather.initialY = this.feather.y;


    console.log(repulsionForce);
}
