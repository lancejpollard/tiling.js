# How to Derive Fibonacci Codes

## The Fibonacci Sequence

First, list the Fibonacci numbers (starting from F₂):
```
F₂ = 1
F₃ = 2  
F₄ = 3
F₅ = 5
F₆ = 8
F₇ = 13
F₈ = 21
...
```

## Zeckendorf Representation Rule

Every positive integer can be uniquely written as a sum of **non-consecutive** Fibonacci numbers.

## Converting Node Number to Fibonacci Code

### Algorithm: Greedy Approach
1. Start with your number
2. Find the largest Fibonacci number ≤ your number
3. Subtract it and mark that position as 1
4. Repeat with remainder
5. Skip consecutive Fibonacci numbers (ensure non-consecutive rule)

### Example: Node 5
```
5 = ?

Step 1: Largest Fib ≤ 5 is F₅ = 5
5 - 5 = 0 (done!)

So: 5 = F₅

Fibonacci positions: F₈ F₇ F₆ F₅ F₄ F₃ F₂
Code:                0  0  0  1  0  0  0
Final code: 1000 (reading right to left, dropping leading zeros)
```

### Example: Node 6
```
6 = ?

Step 1: Largest Fib ≤ 6 is F₅ = 5
6 - 5 = 1

Step 2: Largest Fib ≤ 1 is F₂ = 1
BUT F₂ is consecutive to F₃ (not allowed if we used F₃)
Since we didn't use F₃, we CAN use F₂
1 - 1 = 0 (done!)

So: 6 = F₅ + F₂

Fibonacci positions: F₅ F₄ F₃ F₂
Code:                1  0  0  1
```

### Example: Node 11
```
11 = ?

Step 1: Largest Fib ≤ 11 is F₆ = 8
11 - 8 = 3

Step 2: Largest Fib ≤ 3 is F₄ = 3
BUT F₄ and F₅ are consecutive to F₆ (skip both!)
Next available is F₃ = 2
3 - 2 = 1

Step 3: Largest Fib ≤ 1 is F₂ = 1
BUT F₂ is consecutive to F₃ (skip!)
Can't decompose further - ERROR!

Start over: 
Step 1: Use F₅ = 5 instead of F₆ = 8
11 - 5 = 6

Step 2: Use F₄ = 3 (not consecutive to F₅, OK!)
6 - 3 = 3

Step 3: Use F₂ = 1 (skip F₃ as consecutive to F₄)
3 - 1 = 2

Step 4: 2 = F₃ but that's consecutive to F₄...

Actually: 11 = 8 + 3 = F₆ + F₄
Fibonacci positions: F₆ F₅ F₄ F₃ F₂
Code:                1  0  1  0  0
Final: 10100
```

## Complete Examples for First Few Nodes

```
Node 1  = 1      = F₂           → 1
Node 2  = 2      = F₃           → 10
Node 3  = 3      = F₄           → 100
Node 4  = 3+1    = F₄ + F₂      → 101
Node 5  = 5      = F₅           → 1000
Node 6  = 5+1    = F₅ + F₂      → 1001
Node 7  = 5+2    = F₅ + F₃      → 1010
Node 8  = 8      = F₆           → 10000
Node 9  = 8+1    = F₆ + F₂      → 10001
Node 10 = 8+2    = F₆ + F₃      → 10010
Node 11 = 8+3    = F₆ + F₄      → 10100
Node 12 = 8+5    = F₆ + F₅ (NO! consecutive)
        = 8+3+1  = F₆ + F₄ + F₂ → 10101
```

## Key Rules

1. **Never use consecutive Fibonacci numbers**
2. **Greedy approach**: Always try largest possible first
3. **Read right-to-left**: F₂ is rightmost bit
4. **Unique representation**: Only one valid code per number

This Fibonacci coding gives each tile in the sector a unique address that encodes its position in the tree structure!