let video;
let facemesh;
let predictions = [];

const mouth = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291,
               76,77,90,180,85,16,315,404,320,307,306,408,304,303,302,11,72,73,74,184];
const leftEye = [243,190,56,28,27,29,30,247,130,25,110,24,23,22,26,112,
                 133,173,157,158,159,160,161,246,33,7,163,144,145,153,154,155];
const rightEye = [359,467,260,259,257,258,286,414,463,341,256,252,253,254,339,255,
                  263,466,388,387,386,385,384,398,362,382,381,380,374,373,390,249];

function setup() {
  createCanvas(640, 480);
  centerCanvas();

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', gotResults);
}

function centerCanvas() {
  let cnv = document.querySelector('canvas');
  cnv.style.display = 'block';
  cnv.style.margin = 'auto';
  cnv.style.position = 'absolute';
  cnv.style.top = '0';
  cnv.style.left = '0';
  cnv.style.right = '0';
  cnv.style.bottom = '0';
  cnv.style.transform = 'translateY(50%)';
}

function modelReady() {}

function gotResults(results) {
  predictions = results;
}

function draw() {
  background(220);
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 嘴唇
    stroke(255, 0, 0);
    strokeWeight(15);
    noFill();
    drawFacemeshLine(keypoints, mouth);

    // 左眼
    stroke(0, 255, 0);
    strokeWeight(8);
    noFill();
    drawFacemeshLine(keypoints, leftEye);

    // 右眼
    stroke(0, 0, 255);
    strokeWeight(8);
    noFill();
    drawFacemeshLine(keypoints, rightEye);

    fill(255,0,0);
    noStroke();
    ellipse(keypoints[0][0], keypoints[0][1], 20, 20); // 畫出第0號點
  }
  pop();
}

function drawFacemeshLine(keypoints, arr) {
  beginShape();
  for (let i = 0; i < arr.length; i++) {
    let idx = arr[i];
    if (keypoints[idx]) {
      vertex(keypoints[idx][0], keypoints[idx][1]);
    }
  }
  endShape(CLOSE);
}
