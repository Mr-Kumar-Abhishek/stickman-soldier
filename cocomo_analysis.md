# COCOMO Model Cost Analysis

## Overview
This document provides a cost and effort estimation for the **Stickman Soldier** project using the Basic COCOMO (Constructive Cost Model). COCOMO is an algorithmic software cost estimation model developed by Barry Boehm.

## Project Classification
The project is classified under the **Organic** mode. 
- **Organic:** Small teams, highly experienced, working in a highly familiar, in-house environment. The software requirements are well-understood and stable.

## Parameters for Organic Mode
The Basic COCOMO equations for Organic mode are:
- **Effort (E):** `E = a * (KLOC)^b` (in Person-Months)
- **Development Time (D):** `D = c * (E)^d` (in Months)
- **Staffing (P):** `P = E / D` (in Persons)

Constants for Organic mode:
- `a = 2.4`
- `b = 1.05`
- `c = 2.5`
- `d = 0.38`

## Estimations

### 1. Estimated Lines of Code (KLOC)
Based on the current source code (HTML, CSS, JavaScript, and Markdown configurations):
- **Total Lines of Code:** ~1,500 lines
- **KLOC:** 1.5

### 2. Effort Calculation (E)
- `E = 2.4 * (1.5)^1.05`
- `E ≈ 2.4 * 1.53`
- **E ≈ 3.67 Person-Months**

### 3. Development Time Calculation (D)
- `D = 2.5 * (3.67)^0.38`
- `D ≈ 2.5 * 1.64`
- **D ≈ 4.1 Months**

### 4. Average Staffing (P)
- `P = E / D`
- `P = 3.67 / 4.1`
- **P ≈ 0.9 Developers** (Effectively 1 Full-Time Developer)

## Cost Analysis
Assuming an average developer salary/cost of **$5,000 per month**:
- **Total Estimated Cost:** `E * Cost per Month`
- `Total Cost = 3.67 * $5,000`
- **Total Cost ≈ $18,350**

## Summary
According to the Basic COCOMO model, building a project of this scope from scratch with a single developer would typically take about **4.1 months**, requiring **3.67 person-months** of effort, with an estimated total development cost of **$18,350**. 

*(Note: Modern AI-assisted development drastically reduces these traditional estimation timelines.)*
