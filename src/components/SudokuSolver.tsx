import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Zap, RotateCcw, Download, Upload } from 'lucide-react';

type SudokuGrid = (number | null)[][];
type CellType = 'given' | 'solved' | 'empty';

interface SudokuCell {
  value: number | null;
  type: CellType;
  isValid: boolean;
}

const createEmptyGrid = (): SudokuCell[][] => {
  return Array(9).fill(null).map(() =>
    Array(9).fill(null).map(() => ({
      value: null,
      type: 'empty' as CellType,
      isValid: true,
    }))
  );
};

const samplePuzzle: SudokuGrid = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9],
];

export const SudokuSolver: React.FC = () => {
  const [grid, setGrid] = useState<SudokuCell[][]>(() => {
    const initialGrid = createEmptyGrid();
    // Load sample puzzle
    samplePuzzle.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell !== null) {
          initialGrid[i][j] = {
            value: cell,
            type: 'given',
            isValid: true,
          };
        }
      });
    });
    return initialGrid;
  });

  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const isValidMove = (grid: SudokuCell[][], row: number, col: number, num: number): boolean => {
    // Check row
    for (let j = 0; j < 9; j++) {
      if (j !== col && grid[row][j].value === num) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && grid[i][col].value === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if ((i !== row || j !== col) && grid[i][j].value === num) return false;
      }
    }

    return true;
  };

  const solveSudoku = async (grid: SudokuCell[][]): Promise<boolean> => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col].value === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValidMove(grid, row, col, num)) {
              grid[row][col] = {
                value: num,
                type: 'solved',
                isValid: true,
              };

              // Add minimal delay for visualization
              await new Promise(resolve => setTimeout(resolve, 5));
              setGrid([...grid]);

              if (await solveSudoku(grid)) {
                return true;
              }

              grid[row][col] = {
                value: null,
                type: 'empty',
                isValid: true,
              };
              setGrid([...grid]);
              await new Promise(resolve => setTimeout(resolve, 2));
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const handleSolve = async () => {
    setIsSolving(true);
    setIsSolved(false);

    try {
      const gridCopy = grid.map(row => row.map(cell => ({ ...cell })));
      const solved = await solveSudoku(gridCopy);

      if (solved) {
        setIsSolved(true);
        toast({
          title: "Puzzle Solved!",
          description: "The Sudoku puzzle has been successfully solved.",
        });
      } else {
        toast({
          title: "No Solution Found",
          description: "This puzzle doesn't have a valid solution.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while solving the puzzle.",
        variant: "destructive",
      });
    } finally {
      setIsSolving(false);
    }
  };

  const handleCellChange = useCallback((row: number, col: number, value: string) => {
    if (grid[row][col].type === 'given') return;

    const numValue = value === '' ? null : parseInt(value);

    if (numValue !== null && (numValue < 1 || numValue > 9)) return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => r.map(c => ({ ...c })));
      newGrid[row][col] = {
        value: numValue,
        type: numValue === null ? 'empty' : 'solved',
        isValid: numValue === null || isValidMove(newGrid, row, col, numValue),
      };
      return newGrid;
    });

    setIsSolved(false);
  }, [grid]);

  const handleClear = () => {
    setGrid(createEmptyGrid());
    setIsSolved(false);
    toast({
      title: "Grid Cleared",
      description: "The Sudoku grid has been reset.",
    });
  };

  const handleLoadSample = () => {
    const newGrid = createEmptyGrid();
    samplePuzzle.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell !== null) {
          newGrid[i][j] = {
            value: cell,
            type: 'given',
            isValid: true,
          };
        }
      });
    });
    setGrid(newGrid);
    setIsSolved(false);
    toast({
      title: "Sample Loaded",
      description: "A sample puzzle has been loaded.",
    });
  };

  const getCellClassName = (cell: SudokuCell, row: number, col: number) => {
    const baseClasses = "w-12 h-12 text-center text-lg font-bold border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary";
    
    const bgClass = cell.type === 'given' 
      ? 'bg-sudoku-cell-given text-sudoku-text-given' 
      : cell.type === 'solved'
      ? 'bg-sudoku-cell-solved text-sudoku-text-solved'
      : 'bg-sudoku-cell text-sudoku-text hover:bg-accent';

    const borderClass = [
      // Right border (thick for 3x3 sections)
      col === 2 || col === 5 ? 'border-r-2 border-r-sudoku-border-thick' : 'border-r border-r-sudoku-border-thin',
      // Bottom border (thick for 3x3 sections)  
      row === 2 || row === 5 ? 'border-b-2 border-b-sudoku-border-thick' : 'border-b border-b-sudoku-border-thin',
      // Top border (thick for first row)
      row === 0 ? 'border-t-2 border-t-sudoku-border-thick' : '',
      // Left border (thick for first column and 3x3 sections)
      col === 0 || col === 3 || col === 6 ? 'border-l-2 border-l-sudoku-border-thick' : 'border-l border-l-sudoku-border-thin',
      // Right border for last column
      col === 8 ? 'border-r-2 border-r-sudoku-border-thick' : '',
      // Bottom border for last row
      row === 8 ? 'border-b-2 border-b-sudoku-border-thick' : '',
    ].filter(Boolean).join(' ');

    const validityClass = !cell.isValid ? 'bg-sudoku-cell-error' : '';

    return `${baseClasses} ${bgClass} ${borderClass} ${validityClass}`;
  };

  return (
    <div className="min-h-screen bg-newspaper-bg flex flex-col items-center justify-center p-4 space-y-8" style={{
      backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--newspaper-accent)) 1px, transparent 0)`,
      backgroundSize: '20px 20px'
    }}>
      <Card className="w-full max-w-2xl bg-newspaper-bg border-sudoku-border-thick shadow-2xl">
        <CardHeader className="text-center border-b-2 border-sudoku-border-thick">
          <CardTitle className="text-4xl font-bold text-newspaper-text font-serif tracking-wider">
            ⚡ THE SUDOKU GAZETTE ⚡
          </CardTitle>
          <CardDescription className="text-lg text-newspaper-text font-serif italic">
            "Automatic Puzzle Solutions Since 1899" • Fast Backtracking Algorithm
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary">Backtracking Algorithm</Badge>
            <Badge variant="secondary">Visual Solving</Badge>
            {isSolved && <Badge className="bg-sudoku-cell-solved text-sudoku-text-solved">Solved!</Badge>}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Sudoku Grid */}
          <div className="flex justify-center">
            <div className="inline-block bg-sudoku-grid p-2 rounded-lg shadow-lg">
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => (
                    <input
                      key={`${rowIndex}-${colIndex}`}
                      type="text"
                      value={cell.value || ''}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      className={getCellClassName(cell, rowIndex, colIndex)}
                      maxLength={1}
                      disabled={cell.type === 'given' || isSolving}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              onClick={handleSolve} 
              disabled={isSolving || isSolved}
              className="min-w-[120px]"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isSolving ? 'Solving...' : 'Solve Puzzle'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleClear}
              disabled={isSolving}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Grid
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleLoadSample}
              disabled={isSolving}
            >
              <Download className="w-4 h-4 mr-2" />
              Load Sample
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center text-muted-foreground space-y-2">
            <p className="text-sm">
              <strong>Instructions:</strong> Enter numbers 1-9 in empty cells or load a sample puzzle
            </p>
            <p className="text-xs">
              Gray cells are given clues • Green cells are solved automatically • Invalid entries are highlighted in red
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SudokuSolver;