/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
 import * as posedetection from '@tensorflow-models/pose-detection';
 
 export const DEFAULT_LINE_WIDTH = 2;
 export const DEFAULT_RADIUS = 4;
 
 export const VIDEO_SIZE = {
   '640 X 480': {width: 640, height: 480},
   '640 X 360': {width: 640, height: 360},
   '360 X 270': {width: 360, height: 270}
 };
 export const STATE = {
   camera: {targetFPS: 60, sizeOption: '640 X 480'},
   backend: '',
   flags: {},
   modelConfig: {}
 };
 export const BLAZEPOSE_CONFIG = {
   maxPoses: 1,
   type: 'full',
   scoreThreshold: 0.65,
   render3D: true
 };
 export const POSENET_CONFIG = {
   maxPoses: 1,
   scoreThreshold: 0.5
 };
 export const MOVENET_CONFIG = {
   maxPoses: 1,
   type: 'lightning',
   scoreThreshold: 0.3,
   customModel: '',
   enableTracking: false
 };
 /**
  * This map descripes tunable flags and theior corresponding types.
  *
  * The flags (keys) in the map satisfy the following two conditions:
  * - Is tunable. For example, `IS_BROWSER` and `IS_CHROME` is not tunable,
  * because they are fixed when running the scripts.
  * - Does not depend on other flags when registering in `ENV.registerFlag()`.
  * This rule aims to make the list streamlined, and, since there are
  * dependencies between flags, only modifying an independent flag without
  * modifying its dependents may cause inconsistency.
  * (`WEBGL_RENDER_FLOAT32_CAPABLE` is an exception, because only exposing
  * `WEBGL_FORCE_F16_TEXTURES` may confuse users.)
  */
 export const TUNABLE_FLAG_VALUE_RANGE_MAP = {
   WEBGL_VERSION: [1, 2],
   WASM_HAS_SIMD_SUPPORT: [true, false],
   WASM_HAS_MULTITHREAD_SUPPORT: [true, false],
   WEBGL_CPU_FORWARD: [true, false],
   WEBGL_PACK: [true, false],
   WEBGL_FORCE_F16_TEXTURES: [true, false],
   WEBGL_RENDER_FLOAT32_CAPABLE: [true, false],
   WEBGL_FLUSH_THRESHOLD: [-1, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
   CHECK_COMPUTATION_FOR_ERRORS: [true, false],
 };
 
 export const BACKEND_FLAGS_MAP = {
   ['tfjs-wasm']: ['WASM_HAS_SIMD_SUPPORT', 'WASM_HAS_MULTITHREAD_SUPPORT'],
   ['tfjs-webgl']: [
     'WEBGL_VERSION', 'WEBGL_CPU_FORWARD', 'WEBGL_PACK',
     'WEBGL_FORCE_F16_TEXTURES', 'WEBGL_RENDER_FLOAT32_CAPABLE',
     'WEBGL_FLUSH_THRESHOLD'
   ],
   ['mediapipe-gpu']: []
 };
 
 export const MODEL_BACKEND_MAP = {
   [posedetection.SupportedModels.PoseNet]: ['tfjs-webgl'],
   [posedetection.SupportedModels.MoveNet]: ['tfjs-webgl', 'tfjs-wasm'],
   [posedetection.SupportedModels.BlazePose]: ['mediapipe-gpu', 'tfjs-webgl']
 }
 
 export const TUNABLE_FLAG_NAME_MAP = {
   PROD: 'production mode',
   WEBGL_VERSION: 'webgl version',
   WASM_HAS_SIMD_SUPPORT: 'wasm SIMD',
   WASM_HAS_MULTITHREAD_SUPPORT: 'wasm multithread',
   WEBGL_CPU_FORWARD: 'cpu forward',
   WEBGL_PACK: 'webgl pack',
   WEBGL_FORCE_F16_TEXTURES: 'enforce float16',
   WEBGL_RENDER_FLOAT32_CAPABLE: 'enable float32',
   WEBGL_FLUSH_THRESHOLD: 'GL flush wait time(ms)'
 };

 // #ffffff - White
// #800000 - Maroon
// #469990 - Malachite
// #e6194b - Crimson
// #42d4f4 - Picton Blue
// #fabed4 - Cupid
// #aaffc3 - Mint Green
// #9a6324 - Kumera
// #000075 - Navy Blue
// #f58231 - Jaffa
// #4363d8 - Royal Blue
// #ffd8b1 - Caramel
// #dcbeff - Mauve
// #808000 - Olive
// #ffe119 - Candlelight
// #911eb4 - Seance
// #bfef45 - Inchworm
// #f032e6 - Razzle Dazzle Rose
// #3cb44b - Chateau Green
// #a9a9a9 - Silver Chalice
export const COLOR_PALETTE = [
  '#ffffff', '#800000', '#469990', '#e6194b', '#42d4f4', '#fabed4', '#aaffc3',
  '#9a6324', '#000075', '#f58231', '#4363d8', '#ffd8b1', '#dcbeff', '#808000',
  '#ffe119', '#911eb4', '#bfef45', '#f032e6', '#3cb44b', '#a9a9a9'
];

// These anchor points allow the pose pointcloud to resize according to its
// position in the input.
export const ANCHOR_POINTS = [[0, 0, 0], [0, 1, 0], [-1, 0, 0], [-1, -1, 0]];



// These anchor points allow the hand pointcloud to resize according to its
// position in the input.
export const HAND_ANCHOR_POINTS = [[0, 0, 0], [0, 0.1, 0], [-0.1, 0, 0], [-0.1, -0.1, 0]];

export const fingerLookupIndices = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
}; // for rendering each finger as a polyline

export const connections = [
  [0, 1], [1, 2], [2, 3], [3,4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13,14], [14, 15], [15, 16],
  [0, 17], [17, 18],[18, 19], [19,20]
];