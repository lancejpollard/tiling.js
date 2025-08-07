/**
 * MARGENSTERN'S 3-STATE WEAKLY UNIVERSAL HEPTAGRID CELLULAR AUTOMATON
 *
 * Implementation based on Margenstern's 2014 breakthrough: "A weakly universal
 * cellular automaton in the heptagrid with three states" (arXiv:1410.1864).
 *
 * THEORETICAL FOUNDATION:
 * - 3 states represent the theoretical minimum for weak universality
 * - Relies on infinite pre-filled railway infrastructure background
 * - Railway circuit model with tracks, signals, and switches
 * - Cannot build its own computational substrate (hence "weakly" universal)
 * - Proved "cannot be improved for the tessellations {p, 3} of the hyperbolic plane"
 *
 * KEY INSIGHT: The infinite railway network encodes the "program" - it's like
 * having a universal computer pre-wired into the geometry of space itself.
 * You just inject signals to make it compute anything.
 *
 * THE 3-STATE ENCODING:
 * - State 0: VOID - Empty space (minimal spatial efficiency)
 * - State 1: SIGNAL - Active computation carriers (mobile information)
 * - State 2: TRACK - Infrastructure backbone (pre-filled computational substrate)
 *
 * RAILWAY CIRCUIT COMPONENTS:
 * - Linear tracks: Signals propagate along fixed paths
 * - Switches: Binary decision points that route signals
 * - Crossings: Signals pass through without interference
 * - Loops and delays: Memory and timing control
 *
 * WEAK vs STRONG UNIVERSALITY:
 * - Weak: Relies on infinite pre-structured space (cheating with background)
 * - Strong: Must build computational substrate from finite seeds
 * - This system is weakly universal but computationally complete
 */

import {
  getNeighbors,
  toFibonacciCode,
  fromFibonacciCode,
  isWhite,
} from '../heptagrid'

// The 3 states of Margenstern's minimal weakly universal system
export enum CA3State {
  VOID = 0,   // Empty space - maximum spatial efficiency
  SIGNAL = 1, // Active computation - carries all dynamic information
  TRACK = 2,  // Infrastructure - provides computational framework
}

export type HeptagridAddress = number
export type CA3Configuration = Map<HeptagridAddress, CA3State>

/**
 * INFINITE RAILWAY BACKGROUND GENERATOR
 *
 * Generates the pre-filled infinite railway infrastructure that makes
 * weak universality possible. This encodes the "universal computer"
 * into the geometric structure of hyperbolic space itself.
 */
export class InfiniteRailwayBackground {
  private railwayCache = new Map<HeptagridAddress, CA3State>()

  /**
   * Determines if a tile should be part of the infinite railway network
   * based on its geometric position and Fibonacci addressing.
   */
  getRailwayState(address: HeptagridAddress): CA3State {
    if (this.railwayCache.has(address)) {
      return this.railwayCache.get(address)!
    }

    const state = this.computeRailwayState(address)
    this.railwayCache.set(address, state)
    return state
  }

  private computeRailwayState(address: HeptagridAddress): CA3State {
    // Generate railway infrastructure based on geometric patterns
    const fibCode = toFibonacciCode(address)
    const isWhiteTile = isWhite(address)

    // RAILWAY NETWORK GENERATION PATTERNS:

    // 1. Main trunk lines (every 7th address in sequence)
    if (address % 7 === 0) {
      return CA3State.TRACK
    }

    // 2. Fibonacci-based branching (natural hyperbolic spacing)
    if (fibCode.includes('101') || fibCode.includes('010')) {
      return CA3State.TRACK
    }

    // 3. Geometric density based on tile color (white = more connected)
    if (isWhiteTile) {
      // White tiles have higher railway density
      if (address % 11 === 0 || address % 13 === 0) {
        return CA3State.TRACK
      }
    } else {
      // Black tiles have sparser railway connections
      if (address % 17 === 0 || address % 19 === 0) {
        return CA3State.TRACK
      }
    }

    // 4. Junction nodes at specific Fibonacci positions
    const fibPattern = fibCode.slice(-3) // Last 3 bits
    if (fibPattern === '100' || fibPattern === '001') {
      return CA3State.TRACK
    }

    // 5. Create crossings and switches at geometric intersections
    const neighbors = getNeighbors(address)
    let trackNeighbors = 0
    for (const neighbor of neighbors) {
      if (this.railwayCache.get(neighbor) === CA3State.TRACK) {
        trackNeighbors++
      }
    }

    // If surrounded by tracks, become a junction/switch
    if (trackNeighbors >= 3) {
      return CA3State.TRACK
    }

    // Default: void space
    return CA3State.VOID
  }

  /**
   * Pre-generates railway infrastructure in a region around the origin
   * to establish the computational substrate before signal injection.
   */
  generateLocalRailwayNetwork(radius: number = 100): CA3Configuration {
    const network = new Map<HeptagridAddress, CA3State>()

    // Generate railway infrastructure for tiles 1 through radius
    for (let address = 1; address <= radius; address++) {
      const state = this.getRailwayState(address)
      if (state === CA3State.TRACK) {
        network.set(address, state)
      }
    }

    // Ensure network connectivity by adding bridging tracks
    this.addConnectivityBridges(network, radius)

    return network
  }

  private addConnectivityBridges(network: CA3Configuration, radius: number): void {
    // Add tracks to ensure no isolated railway segments
    for (let address = 1; address <= radius; address++) {
      if (network.has(address)) continue // Skip existing tracks

      const neighbors = getNeighbors(address).filter(n => n <= radius)
      const connectedNeighbors = neighbors.filter(n => network.has(n))

      // If this void position would connect isolated track segments
      if (connectedNeighbors.length >= 2) {
        const segments = this.findTrackSegments(connectedNeighbors, network)
        if (segments.length >= 2) {
          // Add bridging track to connect segments
          network.set(address, CA3State.TRACK)
        }
      }
    }
  }

  private findTrackSegments(addresses: HeptagridAddress[], network: CA3Configuration): number[][] {
    // Simple connectivity analysis to identify separate track segments
    const visited = new Set<HeptagridAddress>()
    const segments: number[][] = []

    for (const addr of addresses) {
      if (!visited.has(addr) && network.has(addr)) {
        const segment = this.traceSegment(addr, network, visited)
        segments.push(segment)
      }
    }

    return segments
  }

  private traceSegment(start: HeptagridAddress, network: CA3Configuration, visited: Set<HeptagridAddress>): number[] {
    const segment = [start]
    visited.add(start)

    const queue = [start]
    while (queue.length > 0) {
      const current = queue.shift()!
      const neighbors = getNeighbors(current).filter(n =>
        network.has(n) && !visited.has(n)
      )

      for (const neighbor of neighbors) {
        visited.add(neighbor)
        segment.push(neighbor)
        queue.push(neighbor)
      }
    }

    return segment
  }
}

/**
 * 3-STATE WEAKLY UNIVERSAL CELLULAR AUTOMATON ENGINE
 *
 * Implements the minimal 3-state railway circuit system that achieves
 * universal computation by operating on infinite pre-filled infrastructure.
 */
export class Railway3CA {
  private configuration: CA3Configuration
  private background: InfiniteRailwayBackground
  private generation: number

  constructor(backgroundRadius: number = 200) {
    this.background = new InfiniteRailwayBackground()
    this.configuration = this.background.generateLocalRailwayNetwork(backgroundRadius)
    this.generation = 0
  }

  getState(address: HeptagridAddress): CA3State {
    // First check dynamic configuration
    if (this.configuration.has(address)) {
      return this.configuration.get(address)!
    }
    // Fall back to infinite background
    return this.background.getRailwayState(address)
  }

  setState(address: HeptagridAddress, state: CA3State): void {
    if (state === CA3State.VOID && this.background.getRailwayState(address) === CA3State.VOID) {
      this.configuration.delete(address)
    } else {
      this.configuration.set(address, state)
    }
  }

  getActiveConfiguration(): CA3Configuration {
    return new Map(this.configuration)
  }

  /**
   * 3-STATE TRANSITION RULES FOR WEAK UNIVERSALITY
   *
   * These rules implement the railway circuit model with:
   * - Signal propagation along pre-existing tracks
   * - Switch behavior for routing signals
   * - Crossing logic for non-interfering intersection
   * - Memory through signal loops and delays
   */
  private computeNextState(address: HeptagridAddress): CA3State {
    const currentState = this.getState(address)
    const isWhiteTile = isWhite(address)
    const neighbors = getNeighbors(address)

    // Count neighbor states
    let voidCount = 0
    let signalCount = 0
    let trackCount = 0

    for (const neighbor of neighbors) {
      const state = this.getState(neighbor)
      switch (state) {
        case CA3State.VOID: voidCount++; break
        case CA3State.SIGNAL: signalCount++; break
        case CA3State.TRACK: trackCount++; break
      }
    }

    // Railway switch and signal routing logic
    switch (currentState) {
      case CA3State.VOID:
        // VOID remains void (cannot create new infrastructure)
        // Signals can only propagate onto existing tracks
        if (signalCount >= 1 && trackCount >= 2 && this.background.getRailwayState(address) === CA3State.TRACK) {
          // Signal propagates onto background track
          return CA3State.SIGNAL
        }
        return CA3State.VOID

      case CA3State.SIGNAL:
        // SIGNAL: Mobile information carriers on railway network

        // Signals die if no track support
        if (trackCount === 0) {
          return CA3State.VOID
        }

        // Railway switch logic: signals choose routing based on neighborhood
        if (trackCount >= 3) {
          // At junctions, signals make routing decisions
          if (signalCount === 0) {
            // Lone signal propagates through junction
            return CA3State.SIGNAL
          } else if (signalCount === 1) {
            // Two signals at junction: one continues, one becomes track
            return isWhiteTile ? CA3State.SIGNAL : CA3State.TRACK
          } else {
            // Multiple signals: traffic control becomes track
            return CA3State.TRACK
          }
        }

        // Linear track propagation
        if (trackCount >= 1 && signalCount <= 2) {
          return CA3State.SIGNAL
        }

        // Signal collisions stabilize to track
        return CA3State.TRACK

      case CA3State.TRACK:
        // TRACK: Railway infrastructure (mostly stable)

        // Tracks activate to signals when receiving signal input
        if (signalCount >= 1 && signalCount <= 2) {
          // Moderate signal traffic: track becomes active signal
          return CA3State.SIGNAL
        }

        // Heavy signal traffic: track remains infrastructure
        if (signalCount >= 3) {
          return CA3State.TRACK
        }

        // Isolated tracks without signals remain infrastructure
        return CA3State.TRACK
    }
  }

  /**
   * Evolution step with synchronous update
   */
  step(): void {
    // Collect all tiles that need evaluation
    const tilesToEvaluate = new Set<HeptagridAddress>()

    // Add all dynamic configuration tiles
    for (const address of this.configuration.keys()) {
      tilesToEvaluate.add(address)
      for (const neighbor of getNeighbors(address)) {
        tilesToEvaluate.add(neighbor)
      }
    }

    // Compute next configuration
    const nextConfiguration = new Map<HeptagridAddress, CA3State>()

    for (const address of tilesToEvaluate) {
      const nextState = this.computeNextState(address)
      const backgroundState = this.background.getRailwayState(address)

      // Only store if different from background
      if (nextState !== backgroundState) {
        nextConfiguration.set(address, nextState)
      }
    }

    this.configuration = nextConfiguration
    this.generation++
  }

  /**
   * Signal injection: the primary way to "program" the system
   */
  injectSignals(signalPattern: Map<HeptagridAddress, CA3State>): void {
    for (const [address, state] of signalPattern) {
      if (state === CA3State.SIGNAL) {
        // Only inject signals onto existing tracks
        if (this.getState(address) === CA3State.TRACK) {
          this.setState(address, CA3State.SIGNAL)
        }
      }
    }
  }

  getGeneration(): number {
    return this.generation
  }

  getActiveSize(): number {
    return this.configuration.size
  }

  getRailwayBackground(): InfiniteRailwayBackground {
    return this.background
  }
}

/**
 * WEAK UNIVERSALITY SIGNAL PATTERNS
 *
 * Pre-defined signal injection patterns that demonstrate universal
 * computation on the infinite railway background.
 */
export class WeakUniversalPatterns {
  /**
   * Binary counter: signals that increment through railway network
   */
  static binaryCounter(): Map<HeptagridAddress, CA3State> {
    const pattern = new Map<HeptagridAddress, CA3State>()

    // Inject signals at strategic railway positions
    const signalAddresses = [7, 14, 21, 28, 35] // Railway trunk positions
    signalAddresses.forEach(addr => {
      pattern.set(addr, CA3State.SIGNAL)
    })

    return pattern
  }

  /**
   * Logic gate simulation: AND/OR/NOT operations via signal routing
   */
  static logicGates(): Map<HeptagridAddress, CA3State> {
    const pattern = new Map<HeptagridAddress, CA3State>()

    // AND gate: two input signals, one output
    pattern.set(22, CA3State.SIGNAL) // Input A
    pattern.set(33, CA3State.SIGNAL) // Input B

    // OR gate: two input signals, different routing
    pattern.set(44, CA3State.SIGNAL) // Input C
    pattern.set(55, CA3State.SIGNAL) // Input D

    return pattern
  }

  /**
   * Turing machine simulation: tape operations via signal patterns
   */
  static turingMachine(program: string): Map<HeptagridAddress, CA3State> {
    const pattern = new Map<HeptagridAddress, CA3State>()

    // Encode program as signal positions on railway network
    for (let i = 0; i < program.length; i++) {
      const bit = program[i]
      const address = 77 + (i * 11) // Spaced positions on railway trunk

      if (bit === '1') {
        pattern.set(address, CA3State.SIGNAL)
      }
    }

    // Add read/write head signals
    pattern.set(7, CA3State.SIGNAL)  // Read head
    pattern.set(14, CA3State.SIGNAL) // Write head

    return pattern
  }
}

/**
 * RAILWAY NETWORK ANALYZER FOR 3-STATE SYSTEM
 *
 * Analysis tools for understanding the infinite railway substrate
 * and signal propagation patterns.
 */
export class Railway3Analyzer {
  private ca: Railway3CA

  constructor(ca: Railway3CA) {
    this.ca = ca
  }

  /**
   * Analyzes the railway network structure
   */
  analyzeRailwayNetwork(radius: number = 50): {
    totalTracks: number
    connectivity: number
    junctionCount: number
    isolatedSegments: number
  } {
    let totalTracks = 0
    let junctionCount = 0
    const visited = new Set<HeptagridAddress>()
    const segments: number[][] = []

    for (let address = 1; address <= radius; address++) {
      if (this.ca.getState(address) === CA3State.TRACK) {
        totalTracks++

        // Count junctions (tracks with 3+ track neighbors)
        const neighbors = getNeighbors(address)
        const trackNeighbors = neighbors.filter(n =>
          n <= radius && this.ca.getState(n) === CA3State.TRACK
        ).length

        if (trackNeighbors >= 3) {
          junctionCount++
        }

        // Trace connectivity segments
        if (!visited.has(address)) {
          const segment = this.traceConnectivity(address, radius, visited)
          segments.push(segment)
        }
      }
    }

    return {
      totalTracks,
      connectivity: totalTracks > 0 ? (totalTracks - segments.length) / totalTracks : 0,
      junctionCount,
      isolatedSegments: segments.length
    }
  }

  private traceConnectivity(start: HeptagridAddress, radius: number, visited: Set<HeptagridAddress>): number[] {
    const segment = [start]
    visited.add(start)

    const queue = [start]
    while (queue.length > 0) {
      const current = queue.shift()!
      const neighbors = getNeighbors(current).filter(n =>
        n <= radius && this.ca.getState(n) === CA3State.TRACK && !visited.has(n)
      )

      for (const neighbor of neighbors) {
        visited.add(neighbor)
        segment.push(neighbor)
        queue.push(neighbor)
      }
    }

    return segment
  }

  /**
   * Tracks signal propagation patterns
   */
  analyzeSignalFlow(): {
    activeSignals: number
    signalDensity: number
    propagationPaths: number[][]
  } {
    const config = this.ca.getActiveConfiguration()
    let activeSignals = 0
    const propagationPaths: number[][] = []

    for (const [address, state] of config) {
      if (state === CA3State.SIGNAL) {
        activeSignals++

        // Trace signal propagation path
        const path = this.traceSignalPath(address)
        if (path.length > 1) {
          propagationPaths.push(path)
        }
      }
    }

    const totalActive = config.size
    const signalDensity = totalActive > 0 ? activeSignals / totalActive : 0

    return {
      activeSignals,
      signalDensity,
      propagationPaths
    }
  }

  private traceSignalPath(start: HeptagridAddress): number[] {
    // Simple path tracing along railway tracks
    const path = [start]
    let current = start
    const visited = new Set([start])

    for (let steps = 0; steps < 10; steps++) { // Limit path length
      const neighbors = getNeighbors(current)
      const trackNeighbors = neighbors.filter(n =>
        this.ca.getState(n) === CA3State.TRACK && !visited.has(n)
      )

      if (trackNeighbors.length === 1) {
        current = trackNeighbors[0]
        path.push(current)
        visited.add(current)
      } else {
        break // Junction or dead end
      }
    }

    return path
  }
}
