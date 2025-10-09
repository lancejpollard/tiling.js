# Fibonacci Tree Pattern - Quick Reference

## The Core Pattern

```
WHITE node → 3 children: BLACK, WHITE, WHITE
BLACK node → 2 children: BLACK, WHITE
```

## Tree Construction Example

```
Level 0:  W₁                           (1 node)
          |
Level 1:  B₂────W₃                     (2 nodes)
          |      |
Level 2:  B₄─W₅  B₆─W₇─W₈              (3 nodes)
          |   |   |   |  |
Level 3:  ... (5 nodes total)
Level 4:  ... (8 nodes total)
```

## Node Numbering

Breadth-first, left-to-right:
- Root = 1 (white)
- Its children = 2 (black), 3 (white)
- Their children = 4,5,6,7,8...

## Fibonacci Codes

Each number → sum of non-consecutive Fibonacci numbers:

```
Node 1  = 1      = F₂       → Code: 1
Node 2  = 2      = F₃       → Code: 10  
Node 3  = 3      = F₄       → Code: 100
Node 4  = 3+1    = F₄+F₂    → Code: 101
Node 5  = 5      = F₅       → Code: 1000
Node 6  = 5+1    = F₅+F₂    → Code: 1001
Node 7  = 5+2    = F₅+F₃    → Code: 1010
Node 8  = 8      = F₆       → Code: 10000
```

## Preferred Son Rule

Parent code + "00" = Preferred son code

Examples:
- Parent: 101 → Preferred son: 10100
- Parent: 1001 → Preferred son: 100100

## Why This Works

1. **Tree growth = Fibonacci sequence** because:
   - Some nodes spawn 2 children
   - Some nodes spawn 3 children
   - The mix creates Fibonacci growth

2. **Each tile in heptagrid = one node** in tree
   - Center tile = root
   - Further out = deeper in tree

3. **Navigation = tree traversal**
   - Find neighbors by parent/child relations
   - Compute paths using tree structure

## Quick Build Algorithm

```
Start with node 1 (white)
For each node in order:
  If WHITE: add 3 children (B,W,W)
  If BLACK: add 2 children (B,W)
  Number children sequentially
```

That's it - this pattern maps the infinite hyperbolic plane to a simple tree!