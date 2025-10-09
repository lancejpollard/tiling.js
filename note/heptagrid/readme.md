# The Fibonacci Tree Navigation System for the Heptagrid

## Overview

Maurice Margenstern developed an elegant system for navigating the {7,3} hyperbolic tiling (heptagrid) using a binary tree structure whose growth follows the Fibonacci sequence. This approach provides efficient coordinate systems and neighbor computation for tiles in hyperbolic space.

## The Black and White Node System

### Node Types

The Fibonacci tree uses two types of nodes, distinguished as **black** and **white**:

- **White nodes**: Have 3 children (1 black, 2 white)
- **Black nodes**: Have 2 children (1 black, 1 white)

### Branching Rules

```
White node → Black child, White child, White child
Black node → Black child, White child
```

This branching pattern creates a tree whose level populations follow the Fibonacci sequence.

## Tree Structure and Growth

### Level Populations

The number of nodes at each level follows the Fibonacci recurrence:

- Level 0: 1 node (root)
- Level 1: 2 nodes
- Level 2: 3 nodes
- Level 3: 5 nodes
- Level 4: 8 nodes
- Level n: F(n+2) nodes

### Why Fibonacci?

The alternating 2-child and 3-child branching naturally produces Fibonacci growth:
- Let W(n) = white nodes at level n
- Let B(n) = black nodes at level n
- Total at level n = W(n) + B(n) = F(n+2)

## Node Numbering and Coordinates

### Breadth-First Numbering

Nodes are numbered sequentially, level by level:
- Root = 1
- Level 1 = 2, 3
- Level 2 = 4, 5, 6
- And so on...

### Fibonacci Base Representation

Each node's number is converted to its **Zeckendorf representation** - a sum of non-consecutive Fibonacci numbers.

Example: Node 19
- 19 = 13 + 5 + 1
- Fibonacci positions: F(7) + F(5) + F(2)
- Binary code: 1010001

## The Preferred Son Concept

### Definition

The **preferred son** of a node is the child whose Fibonacci code is formed by appending "00" to the parent's code.

### Properties

- If parent has code C, preferred son has code C00
- To find parent from preferred son: remove trailing 00s
- Not every node is a preferred son
- Preferred sons create efficient navigation paths

### Example

- Parent: code 101 (node 5)
- Preferred son: code 10100
- This creates a direct hierarchical path through the tree

## Navigation in the Heptagrid

### Tile-to-Node Mapping

Each tile in a sector of the heptagrid corresponds to exactly one node in the Fibonacci tree:
- The central tile = root node
- Moving outward = traversing down the tree
- The tree structure mirrors the hyperbolic geometry

### Computing Neighbors

For any tile with number n:

1. **Parent neighbor**: The tile corresponding to n's parent in the tree
2. **Child neighbors**: Tiles corresponding to n's children (2 or 3 depending on color)
3. **Sibling neighbors**: Tiles at the same tree level
4. **Cross-sector neighbors**: Computed using sector symmetries

### Efficient Path Finding

Paths between tiles can be computed using:
- Lowest common ancestor in the tree
- Fibonacci code manipulation
- O(log n) time complexity for distance n

## Geometric Interpretation

### Sector Structure

- The heptagrid is divided into 7 identical sectors
- Each sector maps to one Fibonacci tree
- Sector boundaries align with tree structure

### Radial Layers

- Tree levels correspond to radial distance from center
- Level n contains tiles at approximately distance n from center
- Exponential growth matches hyperbolic area growth

### Angular Positioning

- Left-to-right position at each level encodes angular position
- Black/white coloring provides additional angular resolution
- Together they give unique polar-like coordinates

## Computational Advantages

### Efficiency
- Neighbor lookup: O(log n) time
- Path computation: O(log n) time
- No floating-point geometry required
- Pure combinatorial operations

### Scalability
- Works for arbitrarily large portions of the hyperbolic plane
- Memory usage grows logarithmically with distance
- Suitable for infinite computational grids

### Applications
- Cellular automata on hyperbolic grids
- Distributed algorithms in hyperbolic networks
- Navigation in hyperbolic virtual spaces
- Theoretical computer science on non-Euclidean geometries

## Implementation Notes

### Key Algorithms

1. **Number to Fibonacci code**: Greedy algorithm using largest Fibonacci numbers first
2. **Parent computation**: String manipulation on Fibonacci codes
3. **Neighbor enumeration**: Systematic application of tree relationships
4. **Sector transitions**: Modular arithmetic on tree positions

### Data Structures

- Fibonacci number cache for efficient conversion
- Tree node records: (number, code, color, parent, children)
- Sector boundary lookup tables
- Neighbor computation rules indexed by node type

The elegance of Margenstern's system lies in how it transforms the complex hyperbolic geometry into simple tree operations, making the infinite hyperbolic plane computationally tractable through the natural mathematics of Fibonacci sequences.
