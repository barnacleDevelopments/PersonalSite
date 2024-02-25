import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ProjectAdded,
  RandomNumberReceived,
  RandomNumberRequested,
  Voted,
  WinnerAnnounced
} from "../generated/ProjectVoting/ProjectVoting"

export function createProjectAddedEvent(
  projectId: string,
  projectName: string
): ProjectAdded {
  let projectAddedEvent = changetype<ProjectAdded>(newMockEvent())

  projectAddedEvent.parameters = new Array()

  projectAddedEvent.parameters.push(
    new ethereum.EventParam("projectId", ethereum.Value.fromString(projectId))
  )
  projectAddedEvent.parameters.push(
    new ethereum.EventParam(
      "projectName",
      ethereum.Value.fromString(projectName)
    )
  )

  return projectAddedEvent
}

export function createRandomNumberReceivedEvent(
  randomNumber: BigInt
): RandomNumberReceived {
  let randomNumberReceivedEvent = changetype<RandomNumberReceived>(
    newMockEvent()
  )

  randomNumberReceivedEvent.parameters = new Array()

  randomNumberReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "randomNumber",
      ethereum.Value.fromUnsignedBigInt(randomNumber)
    )
  )

  return randomNumberReceivedEvent
}

export function createRandomNumberRequestedEvent(
  requestId: BigInt
): RandomNumberRequested {
  let randomNumberRequestedEvent = changetype<RandomNumberRequested>(
    newMockEvent()
  )

  randomNumberRequestedEvent.parameters = new Array()

  randomNumberRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  )

  return randomNumberRequestedEvent
}

export function createVotedEvent(
  voter: Address,
  name: string,
  projectId: string
): Voted {
  let votedEvent = changetype<Voted>(newMockEvent())

  votedEvent.parameters = new Array()

  votedEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  )
  votedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  votedEvent.parameters.push(
    new ethereum.EventParam("projectId", ethereum.Value.fromString(projectId))
  )

  return votedEvent
}

export function createWinnerAnnouncedEvent(
  winner: Address,
  amount: BigInt
): WinnerAnnounced {
  let winnerAnnouncedEvent = changetype<WinnerAnnounced>(newMockEvent())

  winnerAnnouncedEvent.parameters = new Array()

  winnerAnnouncedEvent.parameters.push(
    new ethereum.EventParam("winner", ethereum.Value.fromAddress(winner))
  )
  winnerAnnouncedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return winnerAnnouncedEvent
}
