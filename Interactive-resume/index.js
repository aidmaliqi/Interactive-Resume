import "@pixi/spine-pixi";
import { Application, Assets, Sprite, Texture } from "pixi.js";
import { Character } from "./Character";
import { Controller } from "./Controller";
import { Scene } from "./Scene";

const blimpDistanceThreshold = 150;
const balonDistanceThreshold = 250;
const specialAreaDistance = 1500;

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
    { alias: "Run1", src: "character-run/Run1.png" },
    { alias: "Run2", src: "character-run/Run2.png" },
    { alias: "Run3", src: "character-run/Run3.png" },
    { alias: "Run4", src: "character-run/Run4.png" },
    { alias: "Run5", src: "character-run/Run5.png" },
    { alias: "Run6", src: "character-run/Run6.png" },
    { alias: "Idle1", src: "character-idle/Idle1.png" },
    { alias: "Idle2", src: "character-idle/Idle2.png" },
    { alias: "Idle3", src: "character-idle/Idle3.png" },
    { alias: "Idle4", src: "character-idle/Idle4.png" },
  ]).then(() => {
    console.log("Assets loaded successfully");
  });

  const controller = new Controller();
  const scene = new Scene(app.screen.width, app.screen.height);
  const spineBoy = new Character();
  scene.view.y = app.screen.height;
  spineBoy.view.x = app.screen.width / 4;
  spineBoy.view.y = app.screen.height - scene.floorHeight - 110;
  spineBoy.view.scale.set(3);
  spineBoy.distance = spineBoy.view.position._x;
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
  app.stage.addChild(blimp);

  //balon
  balon.scale.set(0.7);
  balon.x = app.screen.width; // Start at some x position
  balon.y = app.screen.height - balon.height / 4; // Start at the bottom
  app.stage.addChild(balon);

  rune.scale.set(0.3);
  rune.y = app.screen.height - scene.floorHeight - 60;
  app.stage.addChild(rune);

  // Create a div element
  const specialAreaDiv = document.createElement('div');
  specialAreaDiv.id = 'special-area';
  specialAreaDiv.classList.add('hidden');
  specialAreaDiv.style.position = 'absolute';
  specialAreaDiv.style.width = '400px';
  specialAreaDiv.style.height = '250px';
  specialAreaDiv.style.backgroundImage = 'url("Billboard.png")';
  specialAreaDiv.style.backgroundSize = 'cover';
  specialAreaDiv.style.zIndex = '2';  // Higher than other elements
  spineBoy.view.zIndex = '1'; // Ensure spineBoy has a lower z-index

  // Create a video element
  const videoElement = document.createElement('video');
  videoElement.src = 'video1.mp4'; // Replace with the path to your video file
  videoElement.controls = true; // Optional: show video controls (play, pause, etc.)
  videoElement.style.position = 'absolute';
  videoElement.style.width = '94%'; // Cover the width of the div
  videoElement.style.height = '79%'; // Decrease the height of the video
  videoElement.style.display = 'none'; // Initially hide the video
  videoElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Add a subtle shadow
  videoElement.style.padding = '0'; // Remove padding
  videoElement.style.left = '50%'; // Center horizontally
  videoElement.style.top = '50%';
  videoElement.style.objectFit = 'cover';  // Center vertically
  videoElement.style.paddingTop = '13%';
  videoElement.style.paddingBottom = '0.5%';
  videoElement.style.transform = 'translate(-50%, -50%)'; // Center using transform
  videoElement.style.zIndex = '1'; // Ensure video is below the specialAreaDiv

  const textElement = document.createElement('p');
  textElement.innerText = 'My video'; // Replace with your desired text
  textElement.style.position = 'absolute';
  textElement.style.bottom = '250px'; // Adjust as needed
  textElement.style.left = '50%'; // Center horizontally
  textElement.style.transform = 'translateX(-50%)'; // Center using transform
  textElement.style.color = 'black'; // Adjust text color as needed
  textElement.style.fontSize = '20px'; // Adjust font size as needed
  textElement.style.fontWeight = 'bold'; // Optional: make text bold
  textElement.style.zIndex = '3'; // Ensure text is above the video
  textElement.style.opacity = '0'; // Set initial opacity to 0 for fade-in effect
  textElement.style.animation = 'fadeInMove 6s forwards'; // Apply animation

  // Append the text element to the specialAreaDiv
  specialAreaDiv.appendChild(textElement);
  // Append the video element to the specialAreaDiv
  specialAreaDiv.appendChild(videoElement);

  // Append the specialAreaDiv to the body (or any other desired parent element)
  document.body.appendChild(specialAreaDiv);

  // Access the skills div
  const skillsDiv = document.getElementById("skills");
  skillsDiv.style.display = 'none'; // Hide the skills div initially

  const animationContainer = document.getElementById("animationContainer");
  const runeCube = document.getElementById("cube-container");

  // Set initial position of the special area div
  specialAreaDiv.style.left = `${app.screen.width}px`;
  let specialAreaReached = false;
  let billboardPassed = false;

  
  app.ticker.add(() => {
    let speed = 2;
    if (spineBoy.state.run) speed = 3.75;

    rune.x = specialAreaDistance + scene.positionX;


    spineBoy.state.walk =
      controller.keys.left.pressed || controller.keys.right.pressed;
    if (spineBoy.state.run && spineBoy.state.walk) spineBoy.state.run = true;
    else
      spineBoy.state.run =
        controller.keys.left.doubleTap || controller.keys.right.doubleTap;
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

    blimp.x =
      scene.positionX + app.screen.width + blimp.width + blimpDistanceThreshold;

    if (spineBoy.distance >= specialAreaDistance && !specialAreaReached) {
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

      // Show the video element and position it
      videoElement.style.display = 'block';
    }

    // Animate the balloon only when the character is walking
    if (spineBoy.state.walk && spineBoy.distance >= balonDistanceThreshold) {
      if (spineBoy.direction === 1) {
        balon.x = blimp.x + 50;
        balon.y -= 2; // Adjust the speed as necessary
      }
    }
    specialAreaDiv.classList.remove("hidden");

    if (spineBoy.distance >= specialAreaDistance) {
      const distanceBeyond = spineBoy.distance - specialAreaDistance;

      specialAreaDiv.style.transform = `translateX(-${distanceBeyond}px)`;
      specialAreaDiv.classList.remove("hidden");
     // skillsDiv.classList.remove("hidden");
    }

    // Check if character has passed the billboard
    if (spineBoy.distance >= blimp.x && !billboardPassed) {
  
      billboardPassed = true;

    }

    if (spineBoy.distance < specialAreaDistance && specialAreaReached) {
      videoElement.style.display = 'none';
      specialAreaReached = false;
      billboardPassed = false; // Reset billboardPassed when moving away from the special area
    }
    if(spineBoy.distance > 2500){
     skillsDiv.style.display = 'block';
    }
  //  console.log(spineBoy.distance );
  });
})();
