import { parseToNumber } from "@/utils/parseToNumber"

describe("parseToNumber", () => {
  describe("when value is already a number", () => {
    it("should return the number as is", () => {
      expect(parseToNumber(42)).toBe(42)
      expect(parseToNumber(0)).toBe(0)
      expect(parseToNumber(-15)).toBe(-15)
      expect(parseToNumber(3.14)).toBe(3.14)
    })
  })

  describe("when value is a valid string", () => {
    it("should parse integer strings correctly", () => {
      expect(parseToNumber("42")).toBe(42)
      expect(parseToNumber("0")).toBe(0)
      expect(parseToNumber("-15")).toBe(-15)
    })

    it("should parse string with leading/trailing spaces", () => {
      expect(parseToNumber(" 42 ")).toBe(42)
      expect(parseToNumber("\t123\n")).toBe(123)
    })

    it("should parse string with decimal point (truncated)", () => {
      expect(parseToNumber("3.14")).toBe(3)
      expect(parseToNumber("99.99")).toBe(99)
    })

    it("should parse string with valid prefix", () => {
      expect(parseToNumber("42px")).toBe(42)
      expect(parseToNumber("100%")).toBe(100)
      expect(parseToNumber("7abc")).toBe(7)
    })
  })

  describe("when value is invalid", () => {
    it("should return 0 for invalid string values", () => {
      expect(parseToNumber("")).toBe(0)
      expect(parseToNumber("abc")).toBe(0)
      expect(parseToNumber("NaN")).toBe(0)
      expect(parseToNumber("undefined")).toBe(0)
      expect(parseToNumber("null")).toBe(0)
    })

    it("should return 0 for string starting with non-numeric characters", () => {
      expect(parseToNumber("abc123")).toBe(0)
      expect(parseToNumber("!@#")).toBe(0)
      expect(parseToNumber("  abc")).toBe(0)
    })

    it("should return 0 for non-string, non-number types", () => {
      expect(parseToNumber(null as any)).toBe(0)
      expect(parseToNumber(undefined as any)).toBe(0)
      expect(parseToNumber({} as any)).toBe(0)
      expect(parseToNumber([] as any)).toBe(0)
      expect(parseToNumber(true as any)).toBe(0)
    })
  })

  describe("edge cases", () => {
    it("should handle very large numbers", () => {
      expect(parseToNumber("999999999")).toBe(999999999)
      expect(parseToNumber(999999999)).toBe(999999999)
    })

    it("should handle negative zero", () => {
      expect(parseToNumber("-0")).toBe(-0) // parseInt("-0") returns -0
      expect(parseToNumber(-0)).toBe(-0) // JavaScript -0 === 0 but Object.is() can distinguish
    })

    it("should handle hex-like strings (parseInt behavior)", () => {
      expect(parseToNumber("0x10")).toBe(0) // parseInt treats as base 10 unless base specified
      expect(parseToNumber("10")).toBe(10)
    })
  })
})