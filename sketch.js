let x = 0.01;
let y = 0;
let z = 0;

const o = 10;
const p = 28;
const b = 8 / 3;

const dt = 0.01;

let path = [];

let rgb; // [r, g, b]
let previousColor = 0;
let currentColor = 1;
const colorChange = 1;
const opacity = 255; // [0, 255]

let cam;

function firstPersonCamera(cam) {
    // store state
    if (typeof cam.firstPersonCameraState === 'undefined') {
        cam.firstPersonCameraState = {
            azimuth: -Math.atan2(cam.eyeZ - cam.centerZ, cam.eyeX - cam.centerX),
            zenith: -Math.atan2(cam.eyeY - cam.centerY, dist(cam.eyeX, cam.eyeZ, cam.centerX, cam.centerZ)),
            lookAtDistance: dist(cam.eyeX, cam.eyeY, cam.eyeZ, cam.centerX, cam.centerY, cam.centerZ),
            previousMouseX: mouseX,
            previousMouseY: mouseY
        };
    }

    // look around
    if (mouseIsPressed) {
        cam.firstPersonCameraState.azimuth -= (mouseX - cam.firstPersonCameraState.previousMouseX) / 100;

        if (Math.abs(cam.firstPersonCameraState.zenith + (mouseY - cam.firstPersonCameraState.previousMouseY) / 100) < Math.PI / 2) {
            cam.firstPersonCameraState.zenith += (mouseY - cam.firstPersonCameraState.previousMouseY) / 100;
        }
    }

    // movement
    if (keyIsPressed) {
        // forwards and backwards
        if (keyCode == 87) { // 87: w
            cam.eyeX -= 2 * Math.cos(cam.firstPersonCameraState.azimuth);
            cam.eyeZ += 2 * Math.sin(cam.firstPersonCameraState.azimuth);
        }
        else if (keyCode == 83) { // 83: s
            cam.eyeX += 2 * Math.cos(cam.firstPersonCameraState.azimuth);
            cam.eyeZ -= 2 * Math.sin(cam.firstPersonCameraState.azimuth);
        }

        // side
        else if (keyCode == 65) { // 65: a
            cam.eyeX -= 2 * Math.cos(cam.firstPersonCameraState.azimuth + Math.PI / 2);
            cam.eyeZ += 2 * Math.sin(cam.firstPersonCameraState.azimuth + Math.PI / 2);
        }
        else if (keyCode == 68) { // 68: d
            cam.eyeX += 2 * Math.cos(cam.firstPersonCameraState.azimuth + Math.PI / 2);
            cam.eyeZ -= 2 * Math.sin(cam.firstPersonCameraState.azimuth + Math.PI / 2);
        }

        // up and dowm
        else if (keyCode == 16) { // 16: shift
            cam.eyeY += 2;
        }
        else if (keyCode == 32) { // 32: space
            cam.eyeY -= 2;
        }
    }

    // update previous mouse position
    cam.firstPersonCameraState.previousMouseX = mouseX;
    cam.firstPersonCameraState.previousMouseY = mouseY;

    // update look-at point
    cam.centerX = cam.eyeX - cam.firstPersonCameraState.lookAtDistance * Math.cos(cam.firstPersonCameraState.zenith) * Math.cos(cam.firstPersonCameraState.azimuth);
    cam.centerY = cam.eyeY + cam.firstPersonCameraState.lookAtDistance * Math.sin(cam.firstPersonCameraState.zenith);
    cam.centerZ = cam.eyeZ + cam.firstPersonCameraState.lookAtDistance * Math.cos(cam.firstPersonCameraState.zenith) * Math.sin(cam.firstPersonCameraState.azimuth);

    // position and orient the camera
    camera(cam.eyeX, cam.eyeY, cam.eyeZ, // position
        cam.centerX, cam.centerY, cam.centerZ, // look-at point
        0, 1, 0); // up vector
}

function setup() {
    createCanvas(1280, 720, WEBGL);
    cam = createCamera();
}

function draw() {
    background(32, 32, 32);

    let dx = o * (y - x);
    let dy = x * (p - z) - y;
    let dz = x*y - b*z;

    dx *= dt;
    dy *= dt;
    dz *= dt;

    x += dx;
    y += dy;
    z += dz;

    path.push([x, y, z]);

    scale(5);

    rgb = [255, 0, 0];

    for (let i = 0; i < path.length - 1; i++) {
        stroke(rgb[0], rgb[1], rgb[2], opacity);

        if (rgb[currentColor] > 255 || rgb[previousColor] < 0) {
            rgb[previousColor] = 0;
            rgb[currentColor] = 255;
            previousColor = currentColor;
            currentColor = (currentColor + 1) % rgb.length;
        }
        else {
            rgb[previousColor] -= colorChange;
            rgb[currentColor] += colorChange;
        }

        line(path[i][0], path[i][1], path[i][2],
            path[i+1][0], path[i+1][1], path[i+1][2]);
    }

    firstPersonCamera(cam);
}
