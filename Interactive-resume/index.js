import "@pixi/spine-pixi";
import { Application, Assets, Sprite, Texture } from "pixi.js";
import { Character } from "./Character";
import { Controller } from "./Controller";
import { Scene } from "./Scene";

const blimpDistanceThreshold = 150;
const balonDistanceThreshold = 250;
const specialAreaDistance = 500;

(async () => {
  const app = new Application();
  await app.init({ background: "#1099bb", resizeTo: window });
  document.body.appendChild(app.canvas);

  await Assets.load([
    { alias: "background", src: "background.png" },
   
    { alias: "platform", src: "platform.png" },
    { alias: "blimp", src: "blimp.png" },
    { alias: "balon", src: "balon.png" },
    { alias: "rune", src: "rune.png" },
    { alias: "Walk1", src: "character-walk/Walk-1.png" },
    { alias: "Walk2", src: "character-walk/Walk-2.png" },
    { alias: "Walk3", src: "character-walk/Walk-3.png" },
    { alias: "Walk4", src: "character-walk/Walk-4.png" },
    { alias: "Walk5", src: "character-walk/Walk-5.png" },
    { alias: "Walk6", src: "character-walk/Walk-6.png" },

  ]).then(() => {
    console.log("Assets loaded successfully");
});;

  const controller = new Controller();
  const scene = new Scene(app.screen.width, app.screen.height);
  const spineBoy = new Character();

  scene.view.y = app.screen.height;
  spineBoy.view.x = app.screen.width / 4;
  spineBoy.view.y = app.screen.height - scene.floorHeight -110;
  spineBoy.view.scale.set(3);
  app.stage.addChild(scene.view, spineBoy.view);

  const blimpTexture = Texture.from("blimp");
  const blimp = new Sprite(blimpTexture);

  //balon
  const balonTexture = Texture.from("balon");
  const balon = new Sprite(balonTexture);

  const runeTexture = Texture.from("rune");
  const rune = new Sprite(runeTexture);

  blimp.scale.set(0.22);
  blimp.x = app.screen.width;
  // blimp.y = app.screen.height / 4 - blimp.height / 2;
  app.stage.addChild(blimp);

  //balon
  balon.scale.set(0.7);
  balon.x = app.screen.width; // Start at some x position
  balon.y = app.screen.height - balon.height / 4; // Start at the bottom
  app.stage.addChild(balon);

  rune.scale.set(0.3);

  rune.y = app.screen.height - scene.floorHeight - 60;
  app.stage.addChild(rune);
   

  const animationContainer = document.getElementById("animationContainer");
  const runeCube = document.getElementById("cube-container");
   console.log(runeCube)
  let specialAreaReached = false;

  app.ticker.add(() => {
    let speed = 2;
    if (spineBoy.state.hover) speed = 7.5;
    else if (spineBoy.state.run) speed = 3.75;

    rune.x = specialAreaDistance + scene.positionX;
    balon.x =
      scene.positionX +
      app.screen.width +
      balonDistanceThreshold +
      blimp.width +
      400;

    spineBoy.state.walk =
      controller.keys.left.pressed || controller.keys.right.pressed;
    if (spineBoy.state.run && spineBoy.state.walk) spineBoy.state.run = true;
    else
      spineBoy.state.run =
        controller.keys.left.doubleTap || controller.keys.right.doubleTap;
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

    if (spineBoy.state.walk)
      scene.positionX -= speed * scene.scale * spineBoy.direction;

    if (spineBoy.distance >= blimpDistanceThreshold) {
      blimp.x =
        scene.positionX +
        app.screen.width +
        blimp.width +
        blimpDistanceThreshold;
    }

    if (spineBoy.distance +60 >= rune.x && !specialAreaReached) {
      app.stage.removeChild(rune);
      animationContainer.classList.remove("hidden");
      runeCube.classList.remove("hidden");
      specialAreaReached = true;
      setTimeout(() => {
        // Add fadeOut class after 4 seconds
        animationContainer.classList.replace("fadeIn", "fadeOut");
      }, 4000);
      setTimeout(() => {
        // Hide the animationContainer after 5 seconds (1 second for fadeOut animation)
        animationContainer.classList.add("hidden");
      }, 6000);
    }

    // Animate the balloon only when the character is walking
    if (spineBoy.state.walk && spineBoy.distance >= balonDistanceThreshold) {
      if (spineBoy.direction === 1) {
        // Move the balloon up
        balon.y -= 2; // Adjust the speed as necessary
      }
    }


  });
})();
