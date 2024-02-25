import {
  ProjectAdded as ProjectAddedEvent,
  RandomNumberReceived as RandomNumberReceivedEvent,
  RandomNumberRequested as RandomNumberRequestedEvent,
  Voted as VotedEvent,
  WinnerAnnounced as WinnerAnnouncedEvent
} from "../generated/ProjectVoting/ProjectVoting"
import {
  ProjectAdded,
  RandomNumberReceived,
  RandomNumberRequested,
  Voted,
  WinnerAnnounced
} from "../generated/schema"

export function handleProjectAdded(event: ProjectAddedEvent): void {
  let entity = new ProjectAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.projectId = event.params.projectId
  entity.projectName = event.params.projectName

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRandomNumberReceived(
  event: RandomNumberReceivedEvent
): void {
  let entity = new RandomNumberReceived(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.randomNumber = event.params.randomNumber

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRandomNumberRequested(
  event: RandomNumberRequestedEvent
): void {
  let entity = new RandomNumberRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoted(event: VotedEvent): void {
  let entity = new Voted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.voter = event.params.voter
  entity.name = event.params.name
  entity.projectId = event.params.projectId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWinnerAnnounced(event: WinnerAnnouncedEvent): void {
  let entity = new WinnerAnnounced(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.winner = event.params.winner
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
