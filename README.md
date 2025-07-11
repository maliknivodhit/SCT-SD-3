🧩 Automatic Sudoku Solver (TypeScript)
This project implements an automatic Sudoku solver capable of solving any valid Sudoku puzzle using a backtracking algorithm. It's built with TypeScript for type safety and provides a clear solution for given Sudoku grids.

🚀 Features
Solves Standard Sudoku Puzzles: Handles 9x9 Sudoku grids.

Backtracking Algorithm: Utilizes a robust backtracking approach to explore possible solutions.

Type-Safe: Developed in TypeScript for improved code quality and maintainability.

Input Flexibility: Accepts Sudoku puzzles as a 2D array (number[][]).

Clear Output: Prints the solved Sudoku grid or indicates if no solution exists.

💡 How It Works (Backtracking Algorithm)
The solver employs a recursive backtracking algorithm, a fundamental technique for solving constraint satisfaction problems like Sudoku.

Find Empty Cell: The algorithm begins by locating the next empty cell (typically represented by 0) in the grid.

Try Numbers: If an empty cell is found, it attempts to place numbers from 1 to 9 into that cell.

Check Validity: For each number tried, it performs checks to ensure the placement is valid according to Sudoku rules (no duplicate numbers in the current row, column, or 3x3 subgrid).

Recurse:

If the number is valid, the algorithm recursively calls itself to solve the remainder of the puzzle.

If the recursive call returns true (indicating a solution was found), then the current number choice was correct, and the overall solution is complete.

Backtrack:

If the number is not valid, or if the recursive call returns false (meaning no solution was found with that choice), the algorithm "backtracks." It resets the current cell to 0 and proceeds to try the next number for that cell.

No Solution: If all numbers from 1 to 9 have been attempted for a specific cell and none lead to a solution, the current path is a dead end. The function returns false, prompting backtracking in the preceding recursive call.

Solved: If no empty cells remain in the grid, it signifies that the entire grid has been successfully filled, and a valid solution has been discovered. The function returns true.

🛠️ How to Use
To use the Sudoku solver, you'll need Node.js and npm (or yarn) installed on your system.

Clone the Repository (if applicable):

git clone <repository_url>
cd sudoku-solver

(Replace <repository_url> with the actual URL if this were a GitHub project)

Install Dependencies:
Navigate to the project directory and install the necessary Node.js packages (primarily TypeScript).

npm install
# or
yarn install

Prepare Your Sudoku Puzzle:
Represent your Sudoku puzzle as a number[][] (a 2D array of numbers) where 0 represents an empty cell. You would typically define this in your index.ts or main.ts file.

Example Puzzle (src/index.ts or similar):

const grid: number[][] = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// Assuming your solver function is 'solveSudoku' and print function is 'printGrid'
// import { solveSudoku, printGrid } from './solver'; // Adjust path as needed

console.log("Original Sudoku:");
// printGrid(grid); // You'd implement this function

if (solveSudoku(grid)) {
    console.log("\nSolved Sudoku:");
    // printGrid(grid);
} else {
    console.log("\nNo solution exists for this Sudoku puzzle.");
}

(Note: You'll need to define your solveSudoku and printGrid functions within your TypeScript files.)

Compile and Run:
First, compile your TypeScript code to JavaScript:

npm run build
# or
tsc # if you have tsc globally installed

Then, run the compiled JavaScript file using Node.js:

npm start
# or
node dist/index.js # or wherever your main compiled file is

⚙️ Technologies Used
TypeScript

Node.js

npm (Node Package Manager)

🤝 Contributing
(Optional section for open-source projects)
Feel free to fork this repository and contribute!

📄 License
