# Implementation Plan (Agile Methodology)

## Overview
This project will be developed using an Agile software development life cycle (SDLC). The work is broken down into manageable Sprints, each culminating in a usable prototype or feature set. 

## Sprint 1: Architecture and Visual Foundation
**Goal:** Establish the project structure, basic game loop, and CSS graphic rendering system.
- **Task 1.1:** Setup project repository (HTML, CSS, JS files).
- **Task 1.2:** Implement the main game loop using `requestAnimationFrame`.
- **Task 1.3:** Create the CSS architecture for the stickman player character (HTML structure + CSS styles).
- **Task 1.4:** Implement basic state machine for the player (Idle, Running) and animate using CSS.

## Sprint 2: Core Mechanics and Physics
**Goal:** Make the stickman move and interact with the environment.
- **Task 2.1:** Implement the Input Manager to handle keyboard events.
- **Task 2.2:** Add player movement (horizontal running) and map to animations.
- **Task 2.3:** Implement a basic physics engine (gravity, velocity, collision with the ground).
- **Task 2.4:** Add jumping mechanics and platform collision detection (AABB - Axis-Aligned Bounding Box).

## Sprint 3: Combat System
**Goal:** Implement shooting and enemy interactions.
- **Task 3.1:** Implement projectile pooling and rendering (CSS projectiles).
- **Task 3.2:** Add 8-way directional shooting logic for the player.
- **Task 3.3:** Create the basic Grunt enemy (AI to move left/right).
- **Task 3.4:** Implement projectile-to-enemy and enemy-to-player collision detection.
- **Task 3.5:** Add health/life system and death states.

## Sprint 4: Level Design and Polish
**Goal:** Create a playable level, add power-ups, and polish the user experience.
- **Task 4.1:** Build a scrolling camera system that follows the player.
- **Task 4.2:** Design a simple level layout (platforms, terrain) using HTML/CSS.
- **Task 4.3:** Implement the Spread Gun power-up.
- **Task 4.4:** Add UI overlay (Score, Lives).
- **Task 4.5:** Final bug fixing, performance profiling, and visual enhancements (CSS effects like glow and screen shake).
