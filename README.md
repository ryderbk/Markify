# Internal Marks Calculator

A modern, glassmorphic web application to calculate internal marks for Theory and Integrated (TI) paper types.

## Features
- **Dual Modes**: Theory (Max 40) and Integrated (Max 50).
- **Smart Defaults**: Assignments default to 10 marks if left blank.
- **Data Tools**: Export to CSV, Save Snapshot as JSON, and Print support.
- **Visuals**: Dark mode glassmorphism design with smooth animations.

## Usage
1. Select your paper type: **Theory** or **Integrated / TI**.
2. Enter your obtained marks in the fields provided.
   - Inputs are clamped to their maximum values.
   - You can use the "Use Sample" button to fill with test data.
3. Click **Calculate Internal Marks** to see your final score.
4. Use the bottom bar to reset, export, or save your results.

## Conversion Rules

### Theory (Max 40)
| Component | Max Input | Weightage | Calculation |
|-----------|-----------|-----------|-------------|
| CIE 1     | 50        | 8         | (Obtained / 50) * 8 |
| CIE 2     | 50        | 8         | (Obtained / 50) * 8 |
| Assign 1  | 10        | 4         | (Obtained / 10) * 4 |
| Assign 2  | 10        | 4         | (Obtained / 10) * 4 |
| Assign 3  | 10        | 6         | (Obtained / 10) * 6 |
| Model     | 100       | 10        | (Obtained / 100) * 10 |

### Integrated / TI (Max 50)
| Component | Max Input | Weightage | Calculation |
|-----------|-----------|-----------|-------------|
| CIE 1     | 50        | 7         | (Obtained / 50) * 7 |
| CIE 2     | 50        | 7         | (Obtained / 50) * 7 |
| CIE 3     | 100       | 11        | (Obtained / 100) * 11 |
| Prac 1    | 50        | 7         | (Obtained / 50) * 7 |
| Prac 2    | 50        | 7         | (Obtained / 50) * 7 |
| Prac 3    | 100       | 11        | (Obtained / 100) * 11 |

## Sample Inputs

**Theory Test Case:**
- CIE 1: 45
- CIE 2: 42
- Assign 1: 9
- Assign 2: 10
- Assign 3: 8
- Model: 85
-> **Result: ~35.7 / 40**

**Integrated Test Case:**
- CIE 1: 40
- CIE 2: 38
- CIE 3: 90
- Prac 1: 45
- Prac 2: 48
- Prac 3: 95
-> **Result: ~43.9 / 50**
