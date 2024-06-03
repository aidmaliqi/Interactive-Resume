import '@pixi/spine-pixi';
import { Application, Assets, Sprite, Texture } from 'pixi.js';
import { Character } from './Character';
import { Controller } from './Controller';
import { Scene } from './Scene';

const blimpDistanceThreshold = 150;
const balonDistanceThreshold = 250;

(async () => {
    const app = new Application();
    await app.init({ background: '#1099bb', resizeTo: window });
    document.body.appendChild(app.canvas);

    await Assets.load([
        { alias: 'spineSkeleton', src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pro.skel' },
        { alias: 'spineAtlas', src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pma.atlas' },
        { alias: 'sky', src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/sky.png' },
        { alias: 'background', src: 'http://localhost:5173/background.png' },
        { alias: 'midground', src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/midground.png' },
        { alias: 'platform', src: 'http://localhost:5173/platform.png' },
        { alias: 'blimp', src: 'blimp.png' },
        { alias: 'balon', src: 'balon.png' },
    ]);

    const controller = new Controller();
    const scene = new Scene(app.screen.width, app.screen.height);
    const spineBoy = new Character();
    
    scene.view.y = app.screen.height;
    spineBoy.view.x = app.screen.width / 4;
    spineBoy.view.y = app.screen.height - scene.floorHeight - 30;
    spineBoy.spine.scale.set(scene.scale * 0.22);

    app.stage.addChild(scene.view, spineBoy.view);

    const blimpTexture = Texture.from('blimp');
    const blimp = new Sprite(blimpTexture);

    //balon
    const balonTexture = Texture.from('balon');
    const balon = new Sprite(balonTexture);
   
    
    blimp.scale.set(0.22);
    blimp.x = app.screen.width;
    blimp.y = -blimp.height;
    app.stage.addChild(blimp);

    //balon
    balon.scale.set(0.7);
    balon.x = app.screen.width; // Start at some x position
    balon.y = app.screen.height - balon.height / 4; // Start at the bottom
    app.stage.addChild(balon);

    let blimpAnimating = false;
    let blimpInPosition = false;
    let targetX = 150; // Initialize targetX to the target position

    //balon
    let balonAnimating = false;
    let balonInPosition = false;

    app.ticker.add(() => {
        if (spineBoy.isSpawning()) return;

        let speed = 2;
        if (spineBoy.state.hover) speed = 7.5;
        else if (spineBoy.state.run) speed = 3.75;

        spineBoy.state.walk = controller.keys.left.pressed || controller.keys.right.pressed;
        if (spineBoy.state.run && spineBoy.state.walk) spineBoy.state.run = true;
        else spineBoy.state.run = controller.keys.left.doubleTap || controller.keys.right.doubleTap;
        spineBoy.state.hover = controller.keys.down.pressed;
        if (controller.keys.left.pressed) spineBoy.direction = -1;
        else if (controller.keys.right.pressed) spineBoy.direction = 1;
        spineBoy.state.jump = controller.keys.space.pressed;
        if (controller.keys.right.pressed) {
            spineBoy.distance += speed;
        } else if (controller.keys.left.pressed) {
            spineBoy.distance -= speed;
        }
        spineBoy.update();

        if (spineBoy.state.walk) scene.positionX -= speed * scene.scale * spineBoy.direction;

        // Check the distance and animate the blimp
        if (spineBoy.distance >= blimpDistanceThreshold && !blimpInPosition) {
            blimpAnimating = true;
        }

        if (spineBoy.distance >= blimpDistanceThreshold) {
            blimp.x = scene.positionX + app.screen.width + blimp.width + blimpDistanceThreshold;
        }

        blimp.y = app.screen.height / 4 - blimp.height / 2;

        // Animate the balloon only when the character is walking
        if (spineBoy.state.walk && spineBoy.distance >= balonDistanceThreshold) {
            if (spineBoy.direction === 1) {
                // Move the balloon up
                balon.y -= 2; // Adjust the speed as necessary
            } else if (spineBoy.direction === -1) {
                // Move the balloon down
                balon.y += 2; // Adjust the speed as necessary
            }

            // If the balloon goes off the top or bottom of the screen, reset its position
            if (balon.y < -balon.height / 2) {
                balon.y = app.screen.height - balon.height / 2;
            } else if (balon.y > app.screen.height - balon.height / 2) {
                balon.y = -balon.height / 2;
            }
        }
        balon.x = scene.positionX + app.screen.width + balonDistanceThreshold  + blimp.width +400;
        // if (blimpAnimating) {
        //     if (controller.keys.right.pressed) {
        //         targetX -= speed; // Move blimp left when character moves right
        //     } else if (controller.keys.left.pressed) {
        //         targetX += speed; // Move blimp right when character moves left
        //     }

        //     const targetY = app.screen.height / 4 - blimp.height / 2;

        //     const dx = targetX - blimp.x;
        //     const dy = targetY - blimp.y;

        //     blimp.x += dx * 0.01;
        //     blimp.y += dy * 0.03;

        //     if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        //         blimp.x = targetX;
        //         blimp.y = targetY;
        //         blimpAnimating = false;
        //         blimpInPosition = true;
        //     }
        // }
    });
})();
