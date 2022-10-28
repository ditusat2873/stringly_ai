/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
 import * as posenet from '@tensorflow-models/posenet';
 import * as poseDetection from '@tensorflow-models/pose-detection';
 
 import * as tf from '@tensorflow/tfjs-core';
 import * as scatter from 'scatter-gl';
 import * as params from './params';
 
 const color = 'aqua';
 const boundingBoxColor = 'red';
 const lineWidth = 2;
 
 export const tryResNetButtonName = 'tryResNetButton';
 export const tryResNetButtonText = '[New] Try ResNet50';
 const tryResNetButtonTextCss = 'width:100%;text-decoration:underline;';
 const tryResNetButtonBackgroundCss = 'background:#e61d5f;';
 
 function isAndroid() {
   return /Android/i.test(navigator.userAgent);
 }
 
 function isiOS() {
   return /iPhone|iPad|iPod/i.test(navigator.userAgent);
 }
 
 export function isMobile() {
   return isAndroid() || isiOS();
 }
 
 function setDatGuiPropertyCss(propertyText, liCssString, spanCssString = '') {
   var spans = document.getElementsByClassName('property-name');
   for (var i = 0; i < spans.length; i++) {
     var text = spans[i].textContent || spans[i].innerText;
     if (text === propertyText) {
       spans[i].parentNode.parentNode.style = liCssString;
       if (spanCssString !== '') {
         spans[i].style = spanCssString;
       }
     }
   }
 }
 
 export function updateTryResNetButtonDatGuiCss() {
   setDatGuiPropertyCss(
       tryResNetButtonText, tryResNetButtonBackgroundCss,
       tryResNetButtonTextCss);
 }
 
 /**
  * Toggles between the loading UI and the main canvas UI.
  */
 export function toggleLoadingUI(
     showLoadingUI, loadingDivId = 'loading', mainDivId = 'main') {
   if (showLoadingUI) {
     document.getElementById(loadingDivId).style.display = 'block';
     document.getElementById(mainDivId).style.display = 'none';
   } else {
     document.getElementById(loadingDivId).style.display = 'none';
     document.getElementById(mainDivId).style.display = 'block';
   }
 }
 
 function toTuple({y, x}) {
   return [y, x];
 }
 
 export function drawPoint(ctx, y, x, r, color) {
   ctx.beginPath();
   ctx.arc(x, y, r, 0, 2 * Math.PI);
   ctx.fillStyle = color;
   ctx.fill();
 }
 
 /**
  * Draws a line on a canvas, i.e. a joint
  */
 export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
   ctx.beginPath();
   ctx.moveTo(ax * scale, ay * scale);
   ctx.lineTo(bx * scale, by * scale);
   ctx.lineWidth = lineWidth;
   ctx.strokeStyle = color;
   ctx.stroke();
 }
 
   /**
    * Draw the keypoints on the video.
    * @param keypoints A list of keypoints.
    */
    export function drawKeypoints(keypoints, ctx) {
     const keypointInd =
         poseDetection.util.getKeypointIndexBySide(poseDetection.SupportedModels.BlazePose);
     ctx.fillStyle = 'Red';
     ctx.strokeStyle = 'White';
     ctx.lineWidth = params.DEFAULT_LINE_WIDTH;
 
     for (const i of keypointInd.middle) {
       drawKeypoint(keypoints[i], ctx);
     }
 
     ctx.fillStyle = 'Green';
     for (const i of keypointInd.left) {
       drawKeypoint(keypoints[i], ctx);
     }
 
     ctx.fillStyle = 'Orange';
     for (const i of keypointInd.right) {
       drawKeypoint(keypoints[i], ctx);
     }
   }
 
   function drawKeypoint(keypoint, ctx) {
     if(keypoint != null){
       // If score is null, just show the keypoint.
       const score = (keypoint != null && keypoint.score != null) ? keypoint.score : 1;
       const scoreThreshold = params.STATE.modelConfig.scoreThreshold || 0;
 
       if (score >= scoreThreshold) {
         const circle = new Path2D();
         circle.arc(keypoint.x, keypoint.y, params.DEFAULT_RADIUS, 0, 2 * Math.PI);
         ctx.fill(circle);
         ctx.stroke(circle);

         /*const color = 'Red';
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
         ctx.beginPath();
         ctx.moveTo(keypoint.x, keypoint.y);
         ctx.lineTo(keypoint.x, keypoint.y-50);
         ctx.stroke();*/
         //arrow({x: keypoint.x, y: keypoint.y}, {x: keypoint.x, y: keypoint.y-50}, 10, ctx);

       }
     }
   }

   export function arrow (p1, p2, size, ctx) {
    var angle = Math.atan2((p2.y - p1.y) , (p2.x - p1.x));
    var hyp = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
  
    ctx.save();
    ctx.translate(p1.x, p1.y);
    ctx.rotate(angle);
  
    // line
    ctx.lineWidth = 3;
    ctx.beginPath();	
    ctx.moveTo(0, 0);
    ctx.lineTo(hyp - size, 0);
    ctx.stroke();
  
    // triangle
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.lineTo(hyp - size, size);
    ctx.lineTo(hyp, 0);
    ctx.lineTo(hyp - size, -size);
    ctx.fill();
  
    ctx.restore();
  }
 
   /**
    * Draw the skeleton of a body on the video.
    * @param keypoints A list of keypoints.
    */
    export function drawSkeleton(keypoints, poseId, ctx) {
     // Each poseId is mapped to a color in the color palette.
     const color = params.STATE.modelConfig.enableTracking && poseId != null ?
         params.COLOR_PALETTE[poseId % 20] :
         'White';
     ctx.fillStyle = color;
     ctx.strokeStyle = color;
     ctx.lineWidth = params.DEFAULT_LINE_WIDTH;
 
     poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.BlazePose).forEach(([
                                                                       i, j
                                                                     ]) => {
       const kp1 = keypoints[i];
       const kp2 = keypoints[j];
       if(kp1 != null && kp2 != null){
       // If score is null, just show the keypoint.
       const score1 = kp1.score != null ? kp1.score : 1;
       const score2 = kp2.score != null ? kp2.score : 1;
       const scoreThreshold = params.STATE.modelConfig.scoreThreshold || 0;
 
       if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
         ctx.beginPath();
         ctx.moveTo(kp1.x, kp1.y);
         ctx.lineTo(kp2.x, kp2.y);
         ctx.stroke();
       }}
     });
   }
 
   function drawKeypoints3D(keypoints) {
     const scoreThreshold = params.STATE.modelConfig.scoreThreshold || 0;
     const pointsData =
         keypoints.map(keypoint => ([-keypoint.x, -keypoint.y, -keypoint.z]));
 
     const dataset =
         new scatter.ScatterGL.Dataset([...pointsData, ...params.ANCHOR_POINTS]);
 
     const keypointInd =
       poseDetection.util.getKeypointIndexBySide(params.STATE.model);
     this.scatterGL.setPointColorer((i) => {
       if (keypoints[i] == null || keypoints[i].score < scoreThreshold) {
         // hide anchor points and low-confident points.
         return '#ffffff';
       }
       if (i === 0) {
         return '#ff0000' /* Red */;
       }
       if (keypointInd.left.indexOf(i) > -1) {
         return '#00ff00' /* Green */;
       }
       if (keypointInd.right.indexOf(i) > -1) {
         return '#ffa500' /* Orange */;
       }
     });
 
     if (!this.scatterGLHasInitialized) {
       this.scatterGL.render(dataset);
     } else {
       this.scatterGL.updateDataset(dataset);
     }
     const connections = poseDetection.util.getAdjacentPairs(params.STATE.model);
     const sequences = connections.map(pair => ({indices: pair}));
     this.scatterGL.setSequences(sequences);
     this.scatterGLHasInitialized = true;
   }
 
 
 /**
  * Draws a pose skeleton by looking up all adjacent keypoints/joints
  */
 export function drawSkeletonForPoseNet(keypoints, minConfidence, ctx, scale = 1) {
   const adjacentKeyPoints =
       posenet.getAdjacentKeyPoints(keypoints, minConfidence);
 
   adjacentKeyPoints.forEach((keypoints) => {
     drawSegment(
         toTuple(keypoints[0].position), toTuple(keypoints[1].position), color,
         scale, ctx);
   });
 }
 
 /**
  * Draw pose keypoints onto a canvas
  */
 export function drawKeypointsForPoseNet(keypoints, minConfidence, ctx, scale = 1) {
   for (let i = 0; i < keypoints.length; i++) {
     const keypoint = keypoints[i];
 
     if (keypoint.score < minConfidence) {
       continue;
     }
 
     const {y, x} = keypoint.position;
     drawPoint(ctx, y * scale, x * scale, 3, color);
   }
 }
 
 /**
  * Draw the bounding box of a pose. For example, for a whole person standing
  * in an image, the bounding box will begin at the nose and extend to one of
  * ankles
  */
 export function drawBoundingBox(keypoints, ctx) {
   const boundingBox = posenet.getBoundingBox(keypoints);
 
   ctx.rect(
       boundingBox.minX, boundingBox.minY, boundingBox.maxX - boundingBox.minX,
       boundingBox.maxY - boundingBox.minY);
 
   ctx.strokeStyle = boundingBoxColor;
   ctx.stroke();
 }
 
 /**
  * Converts an arary of pixel data into an ImageData object
  */
 export async function renderToCanvas(a, ctx) {
   const [height, width] = a.shape;
   const imageData = new ImageData(width, height);
 
   const data = await a.data();
 
   for (let i = 0; i < height * width; ++i) {
     const j = i * 4;
     const k = i * 3;
 
     imageData.data[j + 0] = data[k + 0];
     imageData.data[j + 1] = data[k + 1];
     imageData.data[j + 2] = data[k + 2];
     imageData.data[j + 3] = 255;
   }
 
   ctx.putImageData(imageData, 0, 0);
 }
 
 /**
  * Draw an image on a canvas
  */
 export function renderImageToCanvas(image, size, canvas) {
   canvas.width = size[0];
   canvas.height = size[1];
   const ctx = canvas.getContext('2d');
 
   ctx.drawImage(image, 0, 0);
 }
 
 /**
  * Draw heatmap values, one of the model outputs, on to the canvas
  * Read our blog post for a description of PoseNet's heatmap outputs
  * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
  */
 export function drawHeatMapValues(heatMapValues, outputStride, canvas) {
   const ctx = canvas.getContext('2d');
   const radius = 5;
   const scaledValues = heatMapValues.mul(tf.scalar(outputStride, 'int32'));
 
   drawPoints(ctx, scaledValues, radius, color);
 }
 
 /**
  * Used by the drawHeatMapValues method to draw heatmap points on to
  * the canvas
  */
 function drawPoints(ctx, points, radius, color) {
   const data = points.buffer().values;
 
   for (let i = 0; i < data.length; i += 2) {
     const pointY = data[i];
     const pointX = data[i + 1];
 
     if (pointX !== 0 && pointY !== 0) {
       ctx.beginPath();
       ctx.arc(pointX, pointY, radius, 0, 2 * Math.PI);
       ctx.fillStyle = color;
       ctx.fill();
     }
   }
 }
 
 /**
  * Draw offset vector values, one of the model outputs, on to the canvas
  * Read our blog post for a description of PoseNet's offset vector outputs
  * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
  */
 // export function drawOffsetVectors(
 //     heatMapValues, offsets, outputStride, scale = 1, ctx) {
 //   const offsetPoints =
 //       posenet.singlePose.getOffsetPoints(heatMapValues, outputStride, offsets);
 
 //   const heatmapData = heatMapValues.buffer().values;
 //   const offsetPointsData = offsetPoints.buffer().values;
 
 //   for (let i = 0; i < heatmapData.length; i += 2) {
 //     const heatmapY = heatmapData[i] * outputStride;
 //     const heatmapX = heatmapData[i + 1] * outputStride;
 //     const offsetPointY = offsetPointsData[i];
 //     const offsetPointX = offsetPointsData[i + 1];
 
 //     drawSegment(
 //         [heatmapY, heatmapX], [offsetPointY, offsetPointX], color, scale, ctx);
 //   }
 // }
 
 
 
   /**
    * Draw the keypoints on the video.
    * @param hand A hand with keypoints to render.
    * @param ctxt Scatter GL context to render 3D keypoints to.
    */
    export function drawHandResult(posePoints, hand, ctxt) {
     if (hand.keypoints != null) {
       drawHandKeypoints(posePoints, hand.keypoints, hand.handedness, ctxt);
     }
     // Don't render 3D hands after first two.
     if (ctxt == null) {
       return;
     }
     // if (hand.keypoints3D != null && params.STATE.modelConfig.render3D) {
     //   drawHandsKeypoints3D(hand.keypoints3D, hand.handedness, ctxt);
     // } else {
     //   // Clear scatter plot.
     //   drawHandsKeypoints3D([], '', ctxt);
     // }
   }
 
   /**
    * Draw the keypoints on the video.
    * @param keypoints A list of keypoints.
    * @param handedness Label of hand (either Left or Right).
    */
    function drawHandKeypoints(posePoints, keypoints, handedness, ctx) {
     const keypointsArray = keypoints;
     ctx.fillStyle = handedness === 'Left' ? 'Green' : 'Blue';
     ctx.strokeStyle = 'White';
     ctx.lineWidth = params.DEFAULT_LINE_WIDTH;
 
     for (let i = 0; i < keypointsArray.length; i++) {
       const y = keypointsArray[i].x;
       const x = keypointsArray[i].y;
       drawHandPoint(ctx, x - 2, y - 2, 3);
     }
 
     const fingers = Object.keys(params.fingerLookupIndices);
     for (let i = 0; i < fingers.length; i++) {
       const finger = fingers[i];
       const points = params.fingerLookupIndices[finger].map(idx => keypoints[idx]);
       drawPath(points, false, ctx);
     }
     if(handedness === 'Left')
       connectPoints(posePoints, 14, keypoints, ctx);
     else
       connectPoints(posePoints, 13, keypoints, ctx);
   }
 
   function drawPath(points, closePath, ctx) {
     const region = new Path2D();
     region.moveTo(points[0].x, points[0].y);
     for (let i = 1; i < points.length; i++) {
       const point = points[i];
       region.lineTo(point.x, point.y);
     }
 
     if (closePath) {
       region.closePath();
     }
     ctx.stroke(region);
   }
 
   function drawHandPoint(ctx, y, x, r) {
     ctx.beginPath();
     ctx.arc(x, y, r, 0, 2 * Math.PI);
     ctx.fill();
   }
 
   function drawHandsKeypoints3D(keypoints, handedness, ctxt) {
     const scoreThreshold = params.STATE.modelConfig.scoreThreshold || 0;
     const pointsData =
         keypoints.map(keypoint => ([-keypoint.x, -keypoint.y, -keypoint.z]));
 
     const dataset =
         new scatter.ScatterGL.Dataset([...pointsData, ...params.ANCHOR_POINTS]);
 
     ctxt.scatterGL.setPointColorer((i) => {
       if (keypoints[i] == null || keypoints[i].score < scoreThreshold) {
         // hide anchor points and low-confident points.
         return '#ffffff';
       }
       return handedness === 'Left' ? '#ff0000' : '#0000ff';
     });
 
     if (!ctxt.scatterGLHasInitialized) {
       ctxt.scatterGL.render(dataset);
     } else {
       ctxt.scatterGL.updateDataset(dataset);
     }
     const sequences = params.connections.map(pair => ({indices: pair}));
     ctxt.scatterGL.setSequences(sequences);
     ctxt.scatterGLHasInitialized = true;
   }
 
 
   export function connectPoints(posePoint, poseIdx, handPoint, ctx)
   {
     if(posePoint != null && posePoint[poseIdx]!= null && handPoint != null && handPoint[0] != null){
       const kp1 = posePoint[poseIdx];
       const kp2 = handPoint[0];
       if(kp1 != null && kp2 != null){
       // If score is null, just show the keypoint.
       const score1 = kp1.score != null ? kp1.score : 1;
       const score2 = kp2.score != null ? kp2.score : 1;
       const scoreThreshold = 0.1 || 0;
 
       if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
         ctx.beginPath();
         ctx.moveTo(kp1.x, kp1.y);
         ctx.lineTo(kp2.x, kp2.y);
         ctx.stroke();
       }}
       }
   }
 
   export function removeLandmarks(results) {
    if (results) {
      removeElements(
          results,
          [1, 3, 4,  6, 7, 8, 15, 16, 17, 18, 19, 20, 21, 22, 25, 26, 27, 28, 29, 30, 31, 32]);  //This is for the Face  0, 9, 10, 
    }
  }

  function removeElements(landmarks, elements) {
    for (const element of elements) {
      delete landmarks[element];
    }
  }

  /*p0 - First co-ordinate
  P1 - Second co-ordinate
  c - center co-ordinate
  */
  export function find_angle(p0,p1,c) {
    return (
      Math.atan2(
        p1.y - c.y,
        p1.x - c.x
      )
      - Math.atan2(
        p0.y - c.y,
        p0.x - c.x
      )
    ) * (180 / Math.PI);
  }
  