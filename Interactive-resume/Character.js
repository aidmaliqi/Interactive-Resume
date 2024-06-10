import { Spine } from '@pixi/spine-pixi';
import { Container, AnimatedSprite, Texture, Assets } from 'pixi.js';



// Define the Spine animation map for the character.
// name: animation track key.
// loop: do the animation once or infinitely.
const animationMap = {
    idle: {
        name: 'idle',
        loop: true,
        speed: 0.04
    },
    walk: {
        name: 'walk',
        loop: true,
        speed:0.1
    },
    run: {
        name: 'run',
        loop: true,
        speed: 0.1
    },
    jump: {
        name: 'jump',
        timeScale: 1.5,
        speed: 0
    },
   
  
}; 
const animationFrames = {
   walk: ["character-walk/Walk-1.png" , "character-walk/Walk-2.png","character-walk/Walk-3.png" , "character-walk/Walk-4.png" ,"character-walk/Walk-5.png" , "character-walk/Walk-6.png"], 
   idle : ["character-idle/Idle1.png", "character-idle/Idle2.png", "character-idle/Idle3.png", "character-idle/Idle4.png"],
   run : ["character-run/Run1.png" , "character-run/Run2.png", "character-run/Run3.png", "character-run/Run4.png", "character-run/Run5.png", "character-run/Run6.png"]
}


// Class for handling the character Spine and its animations.
export class Character
{
    constructor()
    {
        // The character's state.
        this.state = {
            walk: false,
            run: false,
            hover: false,
            jump: false,
        };

        // Create the main view and a nested view for directional scaling.
        this.view = new Container();
        this.directionalView = new Container();

        // Create the Spine instance using the preloaded Spine asset aliases.
        // this.spine = Spine.from({
        //     skeleton: 'spineSkeleton',
        //     atlas: 'spineAtlas',
        // });

        this.animations = {}
        for (const [key, frames] of Object.entries(animationFrames)) {
            this.animations[key] = new AnimatedSprite(frames.map(frame => Texture.from(frame)));
            this.animations[key].animationSpeed = animationMap[key]?.speed || 0.1; // Use the specific speed if defined
            this.animations[key].loop = animationMap[key]?.loop || false;
        }


         // Start with the idle animation.
         this.currentAnimation = this.animations.idle;
         this.directionalView.addChild(this.currentAnimation);
         this.view.addChild(this.directionalView);
 
         // Track the distance walked.
         this.distance = 0;

       

    }
    playAnimation(animation) {
        if (this.currentAnimation === this.animations[animation]) return;
        this.currentAnimation.stop();
        this.directionalView.removeChild(this.currentAnimation);
        this.currentAnimation = this.animations[animation];
        this.directionalView.addChild(this.currentAnimation);
        this.currentAnimation.play();
    }


        update() {
            this.playAnimation('idle');
            if (this.state.jump) this.playAnimation('jump');
            else if (this.state.run) this.playAnimation('run');
            else if (this.state.walk) this.playAnimation('walk');
           
        }
   
    // Return character's facing direction.
    get direction()
    {
        return this.directionalView.scale.x > 0 ? 1 : -1;
    }

    // Set character's facing direction.
    set direction(value)
    {
        this.directionalView.scale.x = value;
    }

    
}