import { rowMap } from "@/utils/rowMap"

describe("rowMap utility", () => {
  describe("rowMap", () => {
    it("should split array into rows of specified size", () => {
      const array = [1, 2, 3, 4, 5, 6]
      const result = rowMap(array, 3)
      
      expect(result).toEqual([
        [1, 2, 3],
        [4, 5, 6],
        []
      ])
    })

    it("should handle array with remainder items", () => {
      const array = [1, 2, 3, 4, 5, 6, 7]
      const result = rowMap(array, 3)
      
      expect(result).toEqual([
        [1, 2, 3],
        [4, 5, 6],
        [7]
      ])
    })

    it("should handle empty array", () => {
      const array: number[] = []
      const result = rowMap(array, 3)
      
      expect(result).toEqual([[]])
    })

    it("should handle single item array", () => {
      const array = [1]
      const result = rowMap(array, 3)
      
      expect(result).toEqual([[1]])
    })

    it("should handle itemsPerRow of 1", () => {
      const array = [1, 2, 3]
      const result = rowMap(array, 1)
      
      expect(result).toEqual([
        [1],
        [2],
        [3],
        []
      ])
    })

    it("should handle itemsPerRow larger than array length", () => {
      const array = [1, 2]
      const result = rowMap(array, 5)
      
      expect(result).toEqual([[1, 2]])
    })

    it("should work with string array", () => {
      const array = ["a", "b", "c", "d", "e"]
      const result = rowMap(array, 2)
      
      expect(result).toEqual([
        ["a", "b"],
        ["c", "d"],
        ["e"]
      ])
    })

    it("should work with object array", () => {
      const array = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" }
      ]
      const result = rowMap(array, 2)
      
      expect(result).toEqual([
        [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }],
        [{ id: 3, name: "Charlie" }]
      ])
    })

    it("should handle zero itemsPerRow gracefully", () => {
      const array = [1, 2, 3]
      
      // Zero itemsPerRow causes infinite loop and errors, should not be used
      expect(() => rowMap(array, 0)).toThrow()
    })
  })
})