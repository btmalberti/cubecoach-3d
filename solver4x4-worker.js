/*
 * CubeCoach 3D — 4×4 solver worker
 *
 * Uses the MIT-licensed 4×4 reduction solver by Cassim:
 * https://github.com/cassimhossain/rubiks-cube-solver
 *
 * Source pinned to commit:
 * 86e43ef925991a5a2e44a0f21d96eabeec7a600e
 *
 * Copyright (c) 2026 Cassim
 *
 * MIT License:
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, subject
 * to the following conditions:
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 */

self.window = self;

importScripts(
  'https://cdn.jsdelivr.net/npm/cubejs@1.3.2/lib/cube.min.js',
  'https://cdn.jsdelivr.net/npm/cubejs@1.3.2/lib/solve.js',
  'https://cdn.jsdelivr.net/gh/cassimhossain/rubiks-cube-solver@86e43ef925991a5a2e44a0f21d96eabeec7a600e/js/engine.js',
  'https://cdn.jsdelivr.net/gh/cassimhossain/rubiks-cube-solver@86e43ef925991a5a2e44a0f21d96eabeec7a600e/js/solver3x3.js',
  'https://cdn.jsdelivr.net/gh/cassimhossain/rubiks-cube-solver@86e43ef925991a5a2e44a0f21d96eabeec7a600e/js/solver4x4-centers.js',
  'https://cdn.jsdelivr.net/gh/cassimhossain/rubiks-cube-solver@86e43ef925991a5a2e44a0f21d96eabeec7a600e/js/solver4x4-edges.js',
  'https://cdn.jsdelivr.net/gh/cassimhossain/rubiks-cube-solver@86e43ef925991a5a2e44a0f21d96eabeec7a600e/js/solver4x4.js'
);

let solverReady = false;

const VALID_FACES = new Set(['U', 'R', 'F', 'D', 'L', 'B']);

self.onmessage = function(event) {
  const { type, requestId, faces } = event.data || {};

  if (type !== 'solve') return;

  try {
    if (!faces || typeof faces !== 'object') {
      throw new Error('The 4×4 sticker data is missing.');
    }

    const cube = new self.CubeEngine.Cube(4);

    for (const face of self.CubeEngine.FACES) {
      const stickers = faces[face];

      if (
        !Array.isArray(stickers) ||
        stickers.length !== 16 ||
        stickers.some(colour => !VALID_FACES.has(colour))
      ) {
        throw new Error(`Face ${face} must contain exactly 16 valid stickers.`);
      }

      cube.faces[face] = stickers.slice();
    }

    if (!solverReady) {
      self.Cube.initSolver();
      solverReady = true;
    }

    const result = self.Solver4x4.solve4x4(cube, self.Cube);

    if (
      !result ||
      !Array.isArray(result.moves) ||
      !result.cube ||
      !result.cube.isSolved()
    ) {
      throw new Error('The 4×4 solver did not verify a completely solved cube.');
    }

    self.postMessage({
      type: 'solved',
      requestId,
      moves: result.moves
    });

  } catch (error) {
    self.postMessage({
      type: 'error',
      requestId,
      message: error.message || String(error),
      details: error.details || null
    });
  }
};
