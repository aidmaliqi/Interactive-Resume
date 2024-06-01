import '@pixi/spine-pixi';
import { Application, Assets } from 'pixi.js';
import { Character } from './Character';
import { Controller } from './Controller';
import { Scene } from './Scene';

// Asynchronous IIFE
(async () => {
    // Create a PixiJS application.
    const app = new Application();

    // Intialize the application.
    await app.init({ background: '#1099bb', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas); 

    // Load the assets.
    await Assets.load([
        {
            alias: 'spineSkeleton',
            src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pro.skel',
        },
        {
            alias: 'spineAtlas',
            src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pma.atlas',
        },
        {
            alias: 'sky',
            src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/sky.png',
        },
        {
            alias: 'background',
            src: 'http://localhost:5173/background.png',
        },
        {
            alias: 'midground',
            src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/midground.png',
        },
        {
            alias: 'platform',
            src: 'http://localhost:5173/platform.png',
        },
    ]);

 // Create a controller that handles keyboard inputs.
 const controller = new Controller(); 
    // Create a scene that holds the environment.
    const scene = new Scene(app.screen.width, app.screen.height);

    // Create our character
    const spineBoy = new Character();

    // Adjust views' transformation.
    scene.view.y = app.screen.height;
    spineBoy.view.x = app.screen.width /4;
    spineBoy.view.y = app.screen.height - scene.floorHeight - 30;
    spineBoy.spine.scale.set(scene.scale * 0.32);

    // Add scene and character to the stage.
    app.stage.addChild(scene.view, spineBoy.view);

        // spineBoy.spawn();

        app.ticker.add(() =>
        {
            if (spineBoy.isSpawning()) return;
        
            spineBoy.state.walk = controller.keys.left.pressed || controller.keys.right.pressed;
            if (spineBoy.state.run && spineBoy.state.walk) spineBoy.state.run = true;
            else spineBoy.state.run = controller.keys.left.doubleTap || controller.keys.right.doubleTap;
            spineBoy.state.hover = controller.keys.down.pressed;
            if (controller.keys.left.pressed) spineBoy.direction = -1;
            else if (controller.keys.right.pressed) spineBoy.direction = 1;
            spineBoy.state.jump = controller.keys.space.pressed;
        
            spineBoy.update();
        });
})();
