import FightEventService from "../../services/FightEventService"
import Client from "../../utils/Client"
import FS from "../../services/FightService"
import { Character, Vehicle, Fight, FightEvent } from "../../types/types"

jest.mock("../../utils/Client")
jest.mock("../../services/FightService")

const mockClient = new Client() as jest.Mocked<Client>
const mockFS = FS as jest.Mocked<typeof FS>

describe("FightEventService", () => {
  let mockFight: Fight
  let mockCharacter: Character
  let mockVehicle: Vehicle

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockFight = {
      id: "fight-1",
      name: "Test Fight",
      sequence: 1,
      shot: 5,
      active: true,
      effects: [],
      shot_order: [],
      character_effects: {},
      vehicle_effects: {}
    } as Fight

    mockCharacter = {
      id: "char-1",
      name: "Test Character",
      shot_id: "shot-1"
    } as Character

    mockVehicle = {
      id: "vehicle-1", 
      name: "Test Vehicle",
      shot_id: "shot-2"
    } as Vehicle

    mockFS.currentShot.mockReturnValue(5)
  })

  describe("getFightEvents", () => {
    it("should call client.getFightEvents with fight", async () => {
      const expectedEvents: FightEvent[] = [
        { id: "event-1", event_type: "test", description: "Test event" } as FightEvent
      ]
      mockClient.getFightEvents.mockResolvedValue(expectedEvents)

      const result = await FightEventService.getFightEvents(mockClient, mockFight)

      expect(mockClient.getFightEvents).toHaveBeenCalledWith(mockFight)
      expect(result).toEqual(expectedEvents)
    })
  })

  describe("createFight", () => {
    it("should create fight_created event", async () => {
      const expectedEvent = { id: "event-1", event_type: "fight_created" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)

      const result = await FightEventService.createFight(mockClient, mockFight)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "fight_created",
        description: "Fight Test Fight created",
        details: {
          fight: { id: "fight-1", name: "Test Fight" },
          sequence: 0,
          shot: 0
        }
      })
      expect(result).toEqual(expectedEvent)
    })
  })

  describe("addCharacter", () => {
    it("should create character_added event with current fight state", async () => {
      const expectedEvent = { id: "event-1", event_type: "character_added" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)

      const result = await FightEventService.addCharacter(mockClient, mockFight, mockCharacter)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "character_added",
        description: "Character Test Character added",
        details: {
          character: { id: "char-1", name: "Test Character" },
          sequence: 1,
          shot: 5
        }
      })
      expect(result).toEqual(expectedEvent)
    })
  })

  describe("addVehicle", () => {
    it("should create vehicle_added event with current fight state", async () => {
      const expectedEvent = { id: "event-1", event_type: "vehicle_added" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)

      const result = await FightEventService.addVehicle(mockClient, mockFight, mockVehicle)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "vehicle_added",
        description: "Vehicle Test Vehicle added",
        details: {
          vehicle: { id: "vehicle-1", name: "Test Vehicle" },
          sequence: 1,
          shot: 5
        }
      })
      expect(result).toEqual(expectedEvent)
    })
  })

  describe("removeCharacter", () => {
    it("should create character_removed event", async () => {
      const expectedEvent = { id: "event-1", event_type: "character_removed" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)

      const result = await FightEventService.removeCharacter(mockClient, mockFight, mockCharacter)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "character_removed",
        description: "Character Test Character removed",
        details: {
          character: { id: "char-1", name: "Test Character" },
          sequence: 1,
          shot: 5
        }
      })
      expect(result).toEqual(expectedEvent)
    })
  })

  describe("removeVehicle", () => {
    it("should create vehicle_removed event", async () => {
      const expectedEvent = { id: "event-1", event_type: "vehicle_removed" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)

      const result = await FightEventService.removeVehicle(mockClient, mockFight, mockVehicle)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "vehicle_removed",
        description: "Vehicle Test Vehicle removed",
        details: {
          vehicle: { id: "vehicle-1", name: "Test Vehicle" },
          sequence: 1,
          shot: 5
        }
      })
      expect(result).toEqual(expectedEvent)
    })
  })

  describe("startSequence", () => {
    it("should create fight_started event for given sequence", async () => {
      const expectedEvent = { id: "event-1", event_type: "fight_started" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)

      const result = await FightEventService.startSequence(mockClient, mockFight, 3)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "fight_started",
        description: "Sequence 3 started",
        details: {
          fight: { id: "fight-1", name: "Test Fight" },
          sequence: 3,
          shot: 5
        }
      })
      expect(result).toEqual(expectedEvent)
    })
  })

  describe("attack", () => {
    it("should create attack event with singular forms for 1 wound and shot", async () => {
      const expectedEvent = { id: "event-1", event_type: "attack" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)
      
      const target = { id: "target-1", name: "Target Character" } as Character

      const result = await FightEventService.attack(mockClient, mockFight, mockCharacter, target, 1, 1)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "attack",
        description: "Test Character attacked Target Character, doing 1 Wound and spending 1 Shot",
        details: {
          attacker: { id: "char-1", name: "Test Character" },
          target: { id: "target-1", name: "Target Character" },
          wounds: 1,
          shots: 1,
          sequence: 1,
          shot: 5
        }
      })
      expect(result).toEqual(expectedEvent)
    })

    it("should create attack event with plural forms for multiple wounds and shots", async () => {
      const expectedEvent = { id: "event-1", event_type: "attack" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)
      
      const target = { id: "target-1", name: "Target Character" } as Character

      const result = await FightEventService.attack(mockClient, mockFight, mockCharacter, target, 5, 3)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "attack",
        description: "Test Character attacked Target Character, doing 5 Wounds and spending 3 Shots",
        details: {
          attacker: { id: "char-1", name: "Test Character" },
          target: { id: "target-1", name: "Target Character" },
          wounds: 5,
          shots: 3,
          sequence: 1,
          shot: 5
        }
      })
      expect(result).toEqual(expectedEvent)
    })
  })

  describe("killMooks", () => {
    it("should create kill_mooks event with singular forms", async () => {
      const expectedEvent = { id: "event-1", event_type: "kill_mooks" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)
      
      const targetVehicle = { id: "target-vehicle-1", name: "Target Vehicle" } as Vehicle

      const result = await FightEventService.killMooks(mockClient, mockFight, mockVehicle, targetVehicle, 1, 1)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "kill_mooks",
        description: "Test Vehicle attacked Target Vehicle, eliminating 1 mook and spending 1 Shot",
        details: {
          attacker: { id: "vehicle-1", name: "Test Vehicle" },
          target: { id: "target-vehicle-1", name: "Target Vehicle" },
          count: 1,
          shots: 1,
          sequence: 1,
          shot: 5
        }
      })
      expect(result).toEqual(expectedEvent)
    })

    it("should create kill_mooks event with plural forms", async () => {
      const expectedEvent = { id: "event-1", event_type: "kill_mooks" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)
      
      const targetVehicle = { id: "target-vehicle-1", name: "Target Vehicle" } as Vehicle

      const result = await FightEventService.killMooks(mockClient, mockFight, mockVehicle, targetVehicle, 5, 3)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "kill_mooks",
        description: "Test Vehicle attacked Target Vehicle, eliminating 5 mooks and spending 3 Shots",
        details: {
          attacker: { id: "vehicle-1", name: "Test Vehicle" },
          target: { id: "target-vehicle-1", name: "Target Vehicle" },
          count: 5,
          shots: 3,
          sequence: 1,
          shot: 5
        }
      })
      expect(result).toEqual(expectedEvent)
    })
  })

  describe("spendShots", () => {
    it("should create Shots_spent event with singular form", async () => {
      const expectedEvent = { id: "event-1", event_type: "Shots_spent" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)

      const result = await FightEventService.spendShots(mockClient, mockFight, mockCharacter, 1)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "Shots_spent",
        description: "Test Character spent 1 Shot",
        details: {
          character: { id: "char-1", name: "Test Character" },
          shots: 1,
          sequence: 1,
          shot: 5
        }
      })
      expect(result).toEqual(expectedEvent)
    })

    it("should create Shots_spent event with plural form", async () => {
      const expectedEvent = { id: "event-1", event_type: "Shots_spent" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)

      const result = await FightEventService.spendShots(mockClient, mockFight, mockCharacter, 3)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "Shots_spent",
        description: "Test Character spent 3 Shots",
        details: {
          character: { id: "char-1", name: "Test Character" },
          shots: 3,
          sequence: 1,
          shot: 5
        }
      })
      expect(result).toEqual(expectedEvent)
    })
  })

  describe("dodge", () => {
    it("should create dodged event with singular form", async () => {
      const expectedEvent = { id: "event-1", event_type: "dodged" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)

      const result = await FightEventService.dodge(mockClient, mockFight, mockCharacter, 1)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "dodged",
        description: "Test Character dodged for 1 Shot",
        details: {
          character: { id: "char-1", name: "Test Character" },
          shots: 1,
          sequence: 1,
          shot: 5
        }
      })
      expect(result).toEqual(expectedEvent)
    })

    it("should create dodged event with plural form", async () => {
      const expectedEvent = { id: "event-1", event_type: "dodged" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)

      const result = await FightEventService.dodge(mockClient, mockFight, mockCharacter, 2)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "dodged",
        description: "Test Character dodged for 2 Shots",
        details: {
          character: { id: "char-1", name: "Test Character" },
          shots: 2,
          sequence: 1,
          shot: 5
        }
      })
      expect(result).toEqual(expectedEvent)
    })
  })

  describe("event", () => {
    it("should create generic message event with custom description and details", async () => {
      const expectedEvent = { id: "event-1", event_type: "message" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)

      const customDetails = { customProperty: "value", anotherProp: 42 }
      const result = await FightEventService.event(mockClient, mockFight, mockCharacter, "Custom event description", customDetails)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "message",
        description: "Custom event description",
        details: {
          character: { id: "char-1", name: "Test Character" },
          sequence: 1,
          shot: 5,
          customProperty: "value",
          anotherProp: 42
        }
      })
      expect(result).toEqual(expectedEvent)
    })
  })

  describe("chaseAttack", () => {
    it("should create chase_attack event with singular shots", async () => {
      const expectedEvent = { id: "event-1", event_type: "chase_attack" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)
      
      const targetVehicle = { id: "target-vehicle-1", name: "Target Vehicle" } as Vehicle

      const result = await FightEventService.chaseAttack(mockClient, mockFight, mockVehicle, targetVehicle, 10, 5, "ram", 1)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "chase_attack",
        description: "Test Vehicle used ram on Target Vehicle, doing 10 Chase Points and 5 Condition Points, spending 1 Shot",
        details: {
          attacker: { id: "vehicle-1", name: "Test Vehicle" },
          target: { id: "target-vehicle-1", name: "Target Vehicle" },
          chasePoints: 10,
          conditionPoints: 5,
          method: "ram",
          sequence: 1,
          shot: 5,
          shots: 1
        }
      })
      expect(result).toEqual(expectedEvent)
    })

    it("should create chase_attack event with plural shots", async () => {
      const expectedEvent = { id: "event-1", event_type: "chase_attack" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)
      
      const targetVehicle = { id: "target-vehicle-1", name: "Target Vehicle" } as Vehicle

      const result = await FightEventService.chaseAttack(mockClient, mockFight, mockVehicle, targetVehicle, 15, 8, "sideswipe", 3)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "chase_attack",
        description: "Test Vehicle used sideswipe on Target Vehicle, doing 15 Chase Points and 8 Condition Points, spending 3 Shots",
        details: {
          attacker: { id: "vehicle-1", name: "Test Vehicle" },
          target: { id: "target-vehicle-1", name: "Target Vehicle" },
          chasePoints: 15,
          conditionPoints: 8,
          method: "sideswipe",
          sequence: 1,
          shot: 5,
          shots: 3
        }
      })
      expect(result).toEqual(expectedEvent)
    })
  })

  describe("chaseMooks", () => {
    it("should create chase_mooks event with singular mook and shot", async () => {
      const expectedEvent = { id: "event-1", event_type: "chase_mooks" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)
      
      const targetVehicle = { id: "target-vehicle-1", name: "Target Vehicle" } as Vehicle

      const result = await FightEventService.chaseMooks(mockClient, mockFight, mockVehicle, targetVehicle, 1, "ram", 1)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "chase_mooks",
        description: "Test Vehicle used ram on Target Vehicle, eliminating 1 mook, spending 1 Shot",
        details: {
          attacker: { id: "vehicle-1", name: "Test Vehicle" },
          target: { id: "target-vehicle-1", name: "Target Vehicle" },
          count: 1,
          sequence: 1,
          shot: 5,
          shots: 1
        }
      })
      expect(result).toEqual(expectedEvent)
    })

    it("should create chase_mooks event with plural mooks and shots", async () => {
      const expectedEvent = { id: "event-1", event_type: "chase_mooks" } as FightEvent
      mockClient.createFightEvent.mockResolvedValue(expectedEvent)
      
      const targetVehicle = { id: "target-vehicle-1", name: "Target Vehicle" } as Vehicle

      const result = await FightEventService.chaseMooks(mockClient, mockFight, mockVehicle, targetVehicle, 4, "sideswipe", 2)

      expect(mockClient.createFightEvent).toHaveBeenCalledWith(mockFight, {
        event_type: "chase_mooks",
        description: "Test Vehicle used sideswipe on Target Vehicle, eliminating 4 mooks, spending 2 Shots",
        details: {
          attacker: { id: "vehicle-1", name: "Test Vehicle" },
          target: { id: "target-vehicle-1", name: "Target Vehicle" },
          count: 4,
          sequence: 1,
          shot: 5,
          shots: 2
        }
      })
      expect(result).toEqual(expectedEvent)
    })
  })
})