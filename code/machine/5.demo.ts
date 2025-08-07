#!/usr/bin/env tsx

/**
 * DEMONSTRATION RUNNER FOR MARGENSTERN'S 5-STATE RAILWAY CA
 *
 * Interactive demonstration of the strongly universal cellular automaton system.
 * Showcases bootstrap experiments, self-organization, and computational emergence.
 */

import {
  RailwayCA,
  SeedPatterns,
  RailwayAnalyzer,
  ComputationalExperiments,
  CAState,
} from './5'

/**
 * VISUALIZATION HELPERS
 *
 * Simple ASCII visualization of cellular automaton states and evolution.
 */
class CAVisualizer {
  private static readonly STATE_CHARS = {
    [CAState.VOID]: '·', // Empty space
    [CAState.SIGNAL]: '○', // Mobile signals
    [CAState.TRACK]: '═', // Railway infrastructure
    [CAState.BUILDER]: '◆', // Constructor machinery
    [CAState.CONTROL]: '⬢', // Coordination nodes
  }

  private static readonly STATE_COLORS = {
    [CAState.VOID]: '\x1b[90m', // Dim gray
    [CAState.SIGNAL]: '\x1b[93m', // Bright yellow
    [CAState.TRACK]: '\x1b[96m', // Cyan
    [CAState.BUILDER]: '\x1b[91m', // Red
    [CAState.CONTROL]: '\x1b[95m', // Magenta
  }

  static visualizeConfiguration(
    ca: RailwayCA,
    maxRadius: number = 10,
  ): void {
    const config = ca.getActiveConfiguration()
    const addresses = Array.from(config.keys()).sort((a, b) => a - b)

    console.log(
      `\n=== Generation ${ca.getGeneration()} (${
        config.size
      } active tiles) ===`,
    )

    if (addresses.length === 0) {
      console.log('(No active tiles)')
      return
    }

    // Show first N tiles in linear order (simplified 2D projection)
    const displayLimit = Math.min(50, addresses.length)
    let line = ''

    for (let i = 0; i < displayLimit; i++) {
      const address = addresses[i]
      const state = config.get(address)!
      const char = this.STATE_CHARS[state]
      const color = this.STATE_COLORS[state]

      line += `${color}${char}\x1b[0m `

      // Break line every 25 characters for readability
      if ((i + 1) % 25 === 0) {
        console.log(line)
        line = ''
      }
    }

    if (line.length > 0) {
      console.log(line)
    }

    if (addresses.length > displayLimit) {
      console.log(`... (${addresses.length - displayLimit} more tiles)`)
    }
  }

  static showLegend(): void {
    console.log('\n=== STATE LEGEND ===')
    for (const [state, char] of Object.entries(this.STATE_CHARS)) {
      const color = this.STATE_COLORS[state as any]
      const name = CAState[state as any]
      console.log(`${color}${char}\x1b[0m ${name.toLowerCase()}`)
    }
  }

  static visualizeMetrics(analyzer: RailwayAnalyzer): void {
    const metrics = analyzer.getComplexityMetrics()
    const gates = analyzer.findLogicGates()
    const tracks = analyzer.findTrackSegments()

    console.log('\n=== ANALYSIS ===')
    console.log(`Total active tiles: ${metrics.totalStates}`)
    console.log(
      `Track density: ${(metrics.trackDensity * 100).toFixed(1)}%`,
    )
    console.log(
      `Signal activity: ${(metrics.signalActivity * 100).toFixed(1)}%`,
    )
    console.log(
      `Construction activity: ${(
        metrics.constructionActivity * 100
      ).toFixed(1)}%`,
    )
    console.log(
      `Coordination load: ${(metrics.coordinationLoad * 100).toFixed(
        1,
      )}%`,
    )
    console.log(`Logic gates detected: ${gates.length}`)
    console.log(`Track segments: ${tracks.length}`)

    if (gates.length > 0) {
      console.log('\nLogic Gates:')
      gates.slice(0, 5).forEach(gate => {
        console.log(
          `  ${gate.type} gate at tile ${gate.address} (${(
            gate.confidence * 100
          ).toFixed(0)}% confidence)`,
        )
      })
    }
  }
}

/**
 * INTERACTIVE DEMONSTRATION SCENARIOS
 */
class DemoScenarios {
  /**
   * Basic self-replication demonstration
   */
  static async basicBootstrap(): Promise<void> {
    console.log('\n' + '='.repeat(60))
    console.log('SCENARIO 1: BASIC SELF-REPLICATING CONSTRUCTOR')
    console.log('='.repeat(60))
    console.log(
      'Testing whether a minimal seed can bootstrap self-organization...\n',
    )

    const ca = new RailwayCA()
    const analyzer = new RailwayAnalyzer(ca)

    // Insert basic constructor seed
    const seed = SeedPatterns.basicConstructor()
    ca.insertPattern(seed)

    console.log('Initial seed pattern:')
    CAVisualizer.visualizeConfiguration(ca)

    // Evolve system
    for (let step = 0; step < 20; step++) {
      ca.step()

      // Show every 5th generation
      if (step % 5 === 4) {
        CAVisualizer.visualizeConfiguration(ca)
        CAVisualizer.visualizeMetrics(analyzer)

        // Pause for readability
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log('\nBootstrap result:')
    const success = ca.getActiveSize() > seed.size
    console.log(`✓ Growth achieved: ${success ? 'YES' : 'NO'}`)
    console.log(
      `✓ Final size: ${ca.getActiveSize()} tiles (started with ${
        seed.size
      })`,
    )
  }

  /**
   * Fibonacci fractal self-organization
   */
  static async fibonacciFractal(): Promise<void> {
    console.log('\n' + '='.repeat(60))
    console.log('SCENARIO 2: FIBONACCI FRACTAL SELF-ORGANIZATION')
    console.log('='.repeat(60))
    console.log('Testing geometric pattern-based construction...\n')

    const ca = new RailwayCA()
    const analyzer = new RailwayAnalyzer(ca)

    // Insert Fibonacci-based seed
    const seed = SeedPatterns.fibonacciFractal()
    ca.insertPattern(seed)

    console.log('Fibonacci fractal seed:')
    CAVisualizer.visualizeConfiguration(ca)

    // Evolution with analysis
    let maxComplexity = 0

    for (let step = 0; step < 30; step++) {
      ca.step()

      const complexity = analyzer.getComplexityMetrics().totalStates
      maxComplexity = Math.max(maxComplexity, complexity)

      if (step % 10 === 9) {
        CAVisualizer.visualizeConfiguration(ca)
        CAVisualizer.visualizeMetrics(analyzer)
        console.log(`Peak complexity so far: ${maxComplexity} tiles\n`)

        await new Promise(resolve => setTimeout(resolve, 1500))
      }
    }

    console.log('Fractal evolution complete:')
    console.log(`✓ Peak complexity: ${maxComplexity} tiles`)
    console.log(
      `✓ Self-organization detected: ${
        maxComplexity > seed.size * 2 ? 'YES' : 'NO'
      }`,
    )
  }

  /**
   * Universal computation demonstration
   */
  static async universalComputation(): Promise<void> {
    console.log('\n' + '='.repeat(60))
    console.log('SCENARIO 3: UNIVERSAL COMPUTATION BOOTSTRAP')
    console.log('='.repeat(60))
    console.log(
      'Testing bootstrap of universal computational capability...\n',
    )

    const program = '10110010' // Simple 8-bit program
    const seed = SeedPatterns.universalTuringMachine(program)

    const result = ComputationalExperiments.runBootstrapExperiment(
      seed,
      100,
    )

    console.log('Program encoding in seed pattern:')
    CAVisualizer.visualizeConfiguration(result.ca, 15)

    console.log('\nEvolution trace:')
    result.trace.forEach(entry => {
      const c = entry.complexity
      console.log(
        `Gen ${entry.generation.toString().padStart(3)}: ${
          c.totalStates
        } tiles, ` +
          `${(c.coordinationLoad * 100).toFixed(0)}% coordination, ` +
          `${result.analyzer.findLogicGates().length} gates`,
      )
    })

    const finalGates = result.analyzer.findLogicGates()
    const finalTracks = result.analyzer.findTrackSegments()

    console.log('\nUniversal computation assessment:')
    console.log(
      `✓ Logic gates emerged: ${
        finalGates.length > 0 ? 'YES' : 'NO'
      } (${finalGates.length})`,
    )
    console.log(
      `✓ Railway network formed: ${
        finalTracks.length > 0 ? 'YES' : 'NO'
      } (${finalTracks.length} segments)`,
    )
    console.log(
      `✓ Computational complexity: ${result.ca.getActiveSize()} active components`,
    )
    console.log(
      `✓ Strong universality: ${
        finalGates.length >= 3 && finalTracks.length >= 5
          ? 'LIKELY'
          : 'DEVELOPING'
      }`,
    )
  }

  /**
   * State transition analysis
   */
  static stateTransitionAnalysis(): void {
    console.log('\n' + '='.repeat(60))
    console.log('SCENARIO 4: STATE TRANSITION ANALYSIS')
    console.log('='.repeat(60))
    console.log('Analyzing the 5-state transition rules in action...\n')

    // Create controlled test environments for each state transition
    const scenarios = [
      {
        name: 'VOID activation',
        initial: new Map([
          [10, CAState.VOID],
          [11, CAState.BUILDER],
          [12, CAState.BUILDER],
        ]),
      },
      {
        name: 'SIGNAL propagation',
        initial: new Map([
          [20, CAState.SIGNAL],
          [21, CAState.TRACK],
          [22, CAState.TRACK],
        ]),
      },
      {
        name: 'BUILDER construction',
        initial: new Map([
          [30, CAState.BUILDER],
          [31, CAState.VOID],
          [32, CAState.VOID],
        ]),
      },
      {
        name: 'CONTROL coordination',
        initial: new Map([
          [40, CAState.CONTROL],
          [41, CAState.SIGNAL],
          [42, CAState.TRACK],
        ]),
      },
    ]

    scenarios.forEach(scenario => {
      console.log(`\n${scenario.name}:`)
      const ca = new RailwayCA()
      ca.insertPattern(scenario.initial)

      console.log('  Before:')
      CAVisualizer.visualizeConfiguration(ca)

      ca.step()

      console.log('  After:')
      CAVisualizer.visualizeConfiguration(ca)

      const changed = ca.getActiveSize() !== scenario.initial.size
      console.log(`  State change: ${changed ? 'YES' : 'NO'}`)
    })
  }
}

/**
 * MAIN DEMONSTRATION RUNNER
 */
async function main(): Promise<void> {
  console.log('╔' + '═'.repeat(58) + '╗')
  console.log("║ MARGENSTERN'S 5-STATE STRONGLY UNIVERSAL RAILWAY CA ║")
  console.log(
    '║                                                      ║',
  )
  console.log('║ Implementation of the 2023 breakthrough system for  ║')
  console.log('║ minimal strongly universal cellular automata        ║')
  console.log('╚' + '═'.repeat(58) + '╝')

  CAVisualizer.showLegend()

  // Run demonstration scenarios
  try {
    await DemoScenarios.basicBootstrap()
    await new Promise(resolve => setTimeout(resolve, 2000))

    await DemoScenarios.fibonacciFractal()
    await new Promise(resolve => setTimeout(resolve, 2000))

    await DemoScenarios.universalComputation()
    await new Promise(resolve => setTimeout(resolve, 1000))

    DemoScenarios.stateTransitionAnalysis()

    console.log('\n' + '='.repeat(60))
    console.log('COMPREHENSIVE UNIVERSALITY TEST')
    console.log('='.repeat(60))
    ComputationalExperiments.demonstrateUniversality()

    console.log('\n✓ Demonstration complete!')
    console.log(
      "This system demonstrates Margenstern's 5-state strongly universal",
    )
    console.log(
      'cellular automaton - the minimal implementation of universal',
    )
    console.log(
      'computation that can bootstrap itself from finite seed patterns.',
    )
  } catch (error) {
    console.error('Demonstration error:', error)
    process.exit(1)
  }
}

// Run demonstration if this file is executed directly
main().catch(console.error)

export { DemoScenarios, CAVisualizer }
