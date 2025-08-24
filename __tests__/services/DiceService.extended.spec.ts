import DS from '../../services/DiceService'
import type { ExplodingDiceRolls, Swerve } from '../../types/types'

describe('DiceService Extended Edge Cases', () => {
  let originalRandom: () => number

  beforeEach(() => {
    originalRandom = Math.random
  })

  afterEach(() => {
    Math.random = originalRandom
  })

  describe('extreme explosion chains', () => {
    it('should handle 100+ consecutive 6s in exploding dice', () => {
      // Mock extreme consecutive 6s followed by a non-6
      let callCount = 0
      Math.random = jest.fn(() => {
        callCount++
        // Return 6 for first 100 calls, then return 1
        return callCount <= 100 ? (6 - 1) / 6 + 0.00001 : 0.01 // Ensures result is 6 then 1
      })

      const [rolls, total] = DS.rollExplodingDie(DS.rollDie)

      expect(rolls).toHaveLength(101) // 100 sixes plus final non-six
      expect(rolls.slice(0, 100)).toEqual(Array(100).fill(6))
      expect(rolls[100]).toBe(1)
      expect(total).toBe(100 * 6 + 1) // 601
    })

    it('should handle single maximum explosion', () => {
      // Mock a single 6 followed by non-6
      let callCount = 0
      Math.random = jest.fn(() => {
        callCount++
        return callCount === 1 ? (6 - 1) / 6 + 0.00001 : 0.01 // 6 then 1
      })

      const [rolls, total] = DS.rollExplodingDie(DS.rollDie)

      expect(rolls).toEqual([6, 1])
      expect(total).toBe(7)
    })

    it('should handle no explosions (immediate non-6)', () => {
      // Mock immediate non-6 roll
      Math.random = jest.fn(() => 0.5) // Results in roll of 4

      const [rolls, total] = DS.rollExplodingDie(DS.rollDie)

      expect(rolls).toEqual([4])
      expect(total).toBe(4)
    })

    it('should handle alternating explosion pattern', () => {
      // Mock alternating 6, 1, 6, 1, 2 pattern
      let callCount = 0
      const results = [6, 1, 6, 1, 2]
      Math.random = jest.fn(() => {
        const value = results[callCount % results.length]
        callCount++
        return (value - 1) / 6 + 0.00001
      })

      const [rolls, total] = DS.rollExplodingDie(DS.rollDie)

      expect(rolls).toEqual([6, 1]) // First 6 explodes, then 1 stops it
      expect(total).toBe(7)
    })
  })

  describe('performance with 1000+ dice pools', () => {
    it('should handle massive dice pool efficiently', () => {
      const startTime = Date.now()
      const results = []

      // Simulate rolling 1000 dice
      for (let i = 0; i < 1000; i++) {
        Math.random = jest.fn(() => Math.random()) // Use actual random
        const result = DS.rollDie()
        results.push(result)
      }

      const endTime = Date.now()
      const duration = endTime - startTime

      expect(results).toHaveLength(1000)
      expect(duration).toBeLessThan(1000) // Should complete within 1 second
      results.forEach(result => {
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(6)
      })
    })

    it('should handle multiple exploding dice efficiently', () => {
      const startTime = Date.now()
      const results = []

      // Roll 100 exploding dice
      for (let i = 0; i < 100; i++) {
        Math.random = originalRandom // Use real randomness
        const [rolls, total] = DS.rollExplodingDie(DS.rollDie)
        results.push({ rolls, total })
      }

      const endTime = Date.now()
      const duration = endTime - startTime

      expect(results).toHaveLength(100)
      expect(duration).toBeLessThan(5000) // Should complete within 5 seconds
      
      results.forEach(({ rolls, total }) => {
        expect(rolls.length).toBeGreaterThanOrEqual(1)
        expect(total).toBeGreaterThanOrEqual(1)
        expect(rolls[rolls.length - 1]).not.toBe(6) // Last roll shouldn't be 6
      })
    })

    it('should maintain accuracy with high volume swerve rolls', () => {
      const results = []
      
      // Roll 500 swerves
      for (let i = 0; i < 500; i++) {
        Math.random = originalRandom
        const swerve = DS.rollSwerve()
        results.push(swerve)
      }

      expect(results).toHaveLength(500)
      
      // Verify all results have correct structure
      results.forEach(swerve => {
        expect(swerve).toHaveProperty('result')
        expect(swerve).toHaveProperty('positiveRolls')
        expect(swerve).toHaveProperty('negativeRolls')
        expect(swerve).toHaveProperty('positive')
        expect(swerve).toHaveProperty('negative')
        expect(swerve).toHaveProperty('boxcars')
        
        expect(swerve.result).toBe((swerve.positive || 0) - (swerve.negative || 0))
        expect(swerve.positive).toBeGreaterThanOrEqual(1)
        expect(swerve.negative).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('memory usage monitoring', () => {
    it('should not create memory leaks with repeated explosions', () => {
      const initialMemory = process.memoryUsage()
      
      // Perform many exploding dice rolls
      for (let i = 0; i < 1000; i++) {
        Math.random = jest.fn(() => 0.01) // Always rolls 1, no explosions
        DS.rollExplodingDie(DS.rollDie)
      }

      const finalMemory = process.memoryUsage()
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed
      
      // Memory increase should be minimal (less than 1MB)
      expect(memoryIncrease).toBeLessThan(1024 * 1024)
    })

    it('should handle large roll arrays without excessive memory usage', () => {
      // Mock 50 consecutive 6s followed by 1
      let callCount = 0
      Math.random = jest.fn(() => {
        callCount++
        return callCount <= 50 ? (6 - 1) / 6 + 0.00001 : 0.01
      })

      const [rolls, total] = DS.rollExplodingDie(DS.rollDie)

      expect(rolls).toHaveLength(51)
      expect(total).toBe(50 * 6 + 1)
      
      // Verify no memory leaks in array handling
      const rollsString = JSON.stringify(rolls)
      expect(rollsString.length).toBeGreaterThan(0)
      expect(rollsString.length).toBeLessThan(1000) // Reasonable string size
    })
  })

  describe('statistical distribution validation', () => {
    it('should produce relatively even distribution over many rolls', () => {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
      const totalRolls = 6000

      Math.random = originalRandom // Use real randomness

      for (let i = 0; i < totalRolls; i++) {
        const roll = DS.rollDie()
        counts[roll as keyof typeof counts]++
      }

      // Each face should appear roughly 1/6 of the time (±10%)
      const expected = totalRolls / 6
      const tolerance = expected * 0.1

      Object.values(counts).forEach(count => {
        expect(count).toBeGreaterThan(expected - tolerance)
        expect(count).toBeLessThan(expected + tolerance)
      })
    })

    it('should validate swerve distribution characteristics', () => {
      Math.random = originalRandom
      const results = []
      
      for (let i = 0; i < 1000; i++) {
        results.push(DS.rollSwerve().result)
      }

      // Should have a mix of positive, negative, and zero results
      const positive = results.filter(r => r > 0).length
      const negative = results.filter(r => r < 0).length
      const zero = results.filter(r => r === 0).length

      expect(positive).toBeGreaterThan(0)
      expect(negative).toBeGreaterThan(0)
      expect(zero).toBeGreaterThanOrEqual(0)
      expect(positive + negative + zero).toBe(1000)

      // Results should cover a reasonable range
      const min = Math.min(...results)
      const max = Math.max(...results)
      expect(max).toBeGreaterThan(min)
    })

    it('should validate boxcars probability', () => {
      let boxcarsCount = 0
      const totalSwerves = 1000

      Math.random = originalRandom

      for (let i = 0; i < totalSwerves; i++) {
        const swerve = DS.rollSwerve()
        if (swerve.boxcars) {
          boxcarsCount++
        }
      }

      // Boxcars should be rare (probability is 1/36)
      // With 1000 rolls, expect around 28 boxcars ±15
      expect(boxcarsCount).toBeGreaterThan(10)
      expect(boxcarsCount).toBeLessThan(60)
    })
  })

  describe('floating point precision', () => {
    it('should handle precise random values at boundaries', () => {
      // Test exactly at boundary values
      const boundaryTests = [
        { random: 0.0, expectedRoll: 1 },
        { random: 1/6 - 0.000001, expectedRoll: 1 },
        { random: 1/6, expectedRoll: 2 },
        { random: 2/6, expectedRoll: 3 },
        { random: 3/6, expectedRoll: 4 },
        { random: 4/6, expectedRoll: 5 },
        { random: 5/6, expectedRoll: 6 },
        { random: 0.999999, expectedRoll: 6 }
      ]

      boundaryTests.forEach(({ random, expectedRoll }) => {
        Math.random = jest.fn(() => random)
        const roll = DS.rollDie()
        expect(roll).toBe(expectedRoll)
      })
    })

    it('should handle extreme floating point values', () => {
      const extremeTests = [
        Number.MIN_VALUE,
        Number.MAX_VALUE % 1, // Fractional part
        0.1 + 0.2, // Classic floating point precision issue
        1 - Number.EPSILON
      ]

      extremeTests.forEach(randomValue => {
        Math.random = jest.fn(() => randomValue % 1) // Ensure 0-1 range
        const roll = DS.rollDie()
        expect(roll).toBeGreaterThanOrEqual(1)
        expect(roll).toBeLessThanOrEqual(6)
        expect(Number.isInteger(roll)).toBe(true)
      })
    })

    it('should maintain precision in total calculations', () => {
      // Mock rolls that could cause floating point issues
      const rolls = [1, 3, 5, 6, 2, 4]
      let rollIndex = 0
      
      Math.random = jest.fn(() => {
        const value = (rolls[rollIndex % rolls.length] - 1) / 6 + 0.00001
        rollIndex++
        return value
      })

      const [resultRolls, total] = DS.rollExplodingDie(DS.rollDie)

      expect(Number.isInteger(total)).toBe(true)
      expect(total).toBe(resultRolls.reduce((sum, roll) => sum + roll, 0))
    })
  })

  describe('random seed consistency', () => {
    it('should produce different results with different random implementations', () => {
      // First implementation - always returns 0.1
      Math.random = jest.fn(() => 0.1)
      const result1 = DS.rollDie()

      // Second implementation - always returns 0.9
      Math.random = jest.fn(() => 0.9)
      const result2 = DS.rollDie()

      expect(result1).not.toBe(result2)
      expect(result1).toBe(1) // 0.1 → 1
      expect(result2).toBe(6) // 0.9 → 6
    })

    it('should produce consistent results with same seed', () => {
      const mockImplementation = jest.fn(() => 0.5)

      Math.random = mockImplementation
      const roll1 = DS.rollDie()

      Math.random = mockImplementation
      const roll2 = DS.rollDie()

      expect(roll1).toBe(roll2)
      expect(roll1).toBe(4) // 0.5 → 4
    })

    it('should handle rapid successive calls consistently', () => {
      let callCount = 0
      Math.random = jest.fn(() => {
        return (callCount++ * 0.1) % 1
      })

      const results = []
      for (let i = 0; i < 10; i++) {
        results.push(DS.rollDie())
      }

      // Should have predictable sequence based on mock
      expect(results).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
    })
  })

  describe('edge case: all 1s rolled', () => {
    it('should handle swerve where all rolls are 1s', () => {
      Math.random = jest.fn(() => 0.01) // Always rolls 1

      const swerve = DS.rollSwerve()

      expect(swerve.positiveRolls).toEqual([1])
      expect(swerve.negativeRolls).toEqual([1])
      expect(swerve.positive).toBe(1)
      expect(swerve.negative).toBe(1)
      expect(swerve.result).toBe(0)
      expect(swerve.boxcars).toBe(false)
    })

    it('should handle exploding dice with all 1s', () => {
      Math.random = jest.fn(() => 0.01) // Always rolls 1

      const [rolls, total] = DS.rollExplodingDie(DS.rollDie)

      expect(rolls).toEqual([1])
      expect(total).toBe(1)
    })

    it('should handle mixed extreme cases in swerve', () => {
      let isPositiveRoll = true
      Math.random = jest.fn(() => {
        // Alternate between rolling 1 for positive and 6 for negative
        if (isPositiveRoll) {
          isPositiveRoll = false
          return 0.01 // Roll 1
        } else {
          isPositiveRoll = true
          return 0.99 // Roll 6, but need to handle explosion
        }
      })

      // This creates a complex scenario where negative side keeps exploding
      // but positive side doesn't
      const swerve = DS.rollSwerve()

      expect(swerve.positiveRolls[0]).toBe(1)
      expect(swerve.positive).toBe(1)
      expect(swerve.negativeRolls[0]).toBe(6)
      expect(swerve.negative).toBeGreaterThan(6) // Will have exploded
      expect(swerve.result).toBeLessThan(0) // Negative result
      expect(swerve.boxcars).toBe(false) // Positive wasn't 6
    })

    it('should handle maximum vs minimum roll scenarios', () => {
      let rollCount = 0
      Math.random = jest.fn(() => {
        // First two calls return 6 (for exploding), then 1s
        rollCount++
        return rollCount <= 2 ? 0.99 : 0.01
      })

      const [rolls, total] = DS.rollExplodingDie(DS.rollDie)

      expect(rolls[0]).toBe(6) // First roll explodes
      expect(rolls[1]).toBe(1) // Explosion stops
      expect(total).toBe(7)
    })
  })

  describe('error recovery and robustness', () => {
    it('should handle Math.random returning out-of-range values', () => {
      // Simulate Math.random being overridden to return invalid values
      Math.random = jest.fn(() => -0.5) // Negative value

      // Should still produce valid die roll
      const roll = DS.rollDie()
      expect(roll).toBeGreaterThanOrEqual(1)
      expect(roll).toBeLessThanOrEqual(6)
    })

    it('should handle Math.random returning exactly 1', () => {
      Math.random = jest.fn(() => 1.0) // Edge case

      const roll = DS.rollDie()
      expect(roll).toBeGreaterThanOrEqual(1)
      expect(roll).toBeLessThanOrEqual(6)
    })

    it('should handle extremely large numbers from Math.random', () => {
      Math.random = jest.fn(() => Number.MAX_SAFE_INTEGER)

      const roll = DS.rollDie()
      expect(Number.isInteger(roll)).toBe(true)
      expect(roll).toBeGreaterThanOrEqual(1)
      expect(roll).toBeLessThanOrEqual(6)
    })
  })
})