# Implementation Plan (Agile Methodology)

## Overview
This project will be developed using an Agile software development life cycle (SDLC). The work is broken down into manageable Sprints, each culminating in a usable prototype or feature set. All tasks below are officially **COMPLETED**.

## Sprint 1: Architecture and Visual Foundation
**Goal: COMPLETED** - Establish the project structure, basic game loop, and CSS graphic rendering system.
- [x] **Task 1.1:** Setup project repository (HTML, CSS, JS files).
- [x] **Task 1.2:** Implement the main game loop using `requestAnimationFrame`.
- [x] **Task 1.3:** Create the CSS architecture for the stickman player character (HTML structure + CSS styles).
- [x] **Task 1.4:** Implement basic state machine for the player (Idle, Running) and animate using CSS.

## Sprint 2: Core Mechanics and Physics
**Goal: COMPLETED** - Make the stickman move and interact with the environment.
- [x] **Task 2.1:** Implement the Input Manager to handle keyboard events.
- [x] **Task 2.2:** Add player movement (horizontal running) and map to animations.
- [x] **Task 2.3:** Implement a basic physics engine (gravity, velocity, collision with the ground).
- [x] **Task 2.4:** Add jumping mechanics and platform collision detection (AABB - Axis-Aligned Bounding Box).

## Sprint 3: Combat System
**Goal: COMPLETED** - Implement shooting and enemy interactions.
- [x] **Task 3.1:** Implement projectile pooling and rendering (CSS projectiles).
- [x] **Task 3.2:** Add 8-way directional shooting logic for the player.
- [x] **Task 3.3:** Create the basic Grunt enemy (AI to move left/right).
- [x] **Task 3.4:** Implement projectile-to-enemy and enemy-to-player collision detection.
- [x] **Task 3.5:** Add health/life system and death states.

## Sprint 4: Level Design and Polish
**Goal: COMPLETED** - Create a playable level, add power-ups, and polish the user experience.
- [x] **Task 4.1:** Build a scrolling camera system that follows the player.
- [x] **Task 4.2:** Design a simple level layout (platforms, terrain) using HTML/CSS.
- [x] **Task 4.3:** Implement the Spread Gun and Machine Gun power-ups.
- [x] **Task 4.4:** Add UI overlay (Score, Lives).
- [x] **Task 4.5:** Final bug fixing, performance profiling, and visual enhancements (CSS effects like glow and screen shake).

## Sprint 5: Deployment and Cross-Platform Support
**Goal: COMPLETED** - Automate deployments and ensure the game plays perfectly across different screens.
- [x] **Task 5.1:** Set up automated CI/CD pipeline using GitHub Actions to deploy to itch.io via Butler.
- [x] **Task 5.2:** Implement responsive design using dynamic CSS `transform: scale()` calculations.
- [x] **Task 5.3:** Ensure compatibility with embedded environments (iframes) by automatically capturing keyboard focus on click.
