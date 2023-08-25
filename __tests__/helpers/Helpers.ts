import { defaultSwerve } from "@/types/types"

export function roll(result: number) {
  return {
    ...defaultSwerve,
    result: result
  }
}

