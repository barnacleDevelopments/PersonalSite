import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ProjectAdded } from "../generated/schema"
import { ProjectAdded as ProjectAddedEvent } from "../generated/ProjectVoting/ProjectVoting"
import { handleProjectAdded } from "../src/project-voting"
import { createProjectAddedEvent } from "./project-voting-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let projectId = "Example string value"
    let projectName = "Example string value"
    let newProjectAddedEvent = createProjectAddedEvent(projectId, projectName)
    handleProjectAdded(newProjectAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ProjectAdded created and stored", () => {
    assert.entityCount("ProjectAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ProjectAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "projectId",
      "Example string value"
    )
    assert.fieldEquals(
      "ProjectAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "projectName",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
