// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

export class ProjectAdded extends ethereum.Event {
  get params(): ProjectAdded__Params {
    return new ProjectAdded__Params(this);
  }
}

export class ProjectAdded__Params {
  _event: ProjectAdded;

  constructor(event: ProjectAdded) {
    this._event = event;
  }

  get projectId(): string {
    return this._event.parameters[0].value.toString();
  }

  get projectName(): string {
    return this._event.parameters[1].value.toString();
  }
}

export class RandomNumberReceived extends ethereum.Event {
  get params(): RandomNumberReceived__Params {
    return new RandomNumberReceived__Params(this);
  }
}

export class RandomNumberReceived__Params {
  _event: RandomNumberReceived;

  constructor(event: RandomNumberReceived) {
    this._event = event;
  }

  get randomNumber(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class RandomNumberRequested extends ethereum.Event {
  get params(): RandomNumberRequested__Params {
    return new RandomNumberRequested__Params(this);
  }
}

export class RandomNumberRequested__Params {
  _event: RandomNumberRequested;

  constructor(event: RandomNumberRequested) {
    this._event = event;
  }

  get requestId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class Voted extends ethereum.Event {
  get params(): Voted__Params {
    return new Voted__Params(this);
  }
}

export class Voted__Params {
  _event: Voted;

  constructor(event: Voted) {
    this._event = event;
  }

  get voter(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get name(): string {
    return this._event.parameters[1].value.toString();
  }

  get projectId(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class WinnerAnnounced extends ethereum.Event {
  get params(): WinnerAnnounced__Params {
    return new WinnerAnnounced__Params(this);
  }
}

export class WinnerAnnounced__Params {
  _event: WinnerAnnounced;

  constructor(event: WinnerAnnounced) {
    this._event = event;
  }

  get winner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class ProjectVoting extends ethereum.SmartContract {
  static bind(address: Address): ProjectVoting {
    return new ProjectVoting("ProjectVoting", address);
  }

  addressNames(param0: Address): string {
    let result = super.call("addressNames", "addressNames(address):(string)", [
      ethereum.Value.fromAddress(param0),
    ]);

    return result[0].toString();
  }

  try_addressNames(param0: Address): ethereum.CallResult<string> {
    let result = super.tryCall(
      "addressNames",
      "addressNames(address):(string)",
      [ethereum.Value.fromAddress(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  addressVotes(param0: Address): string {
    let result = super.call("addressVotes", "addressVotes(address):(string)", [
      ethereum.Value.fromAddress(param0),
    ]);

    return result[0].toString();
  }

  try_addressVotes(param0: Address): ethereum.CallResult<string> {
    let result = super.tryCall(
      "addressVotes",
      "addressVotes(address):(string)",
      [ethereum.Value.fromAddress(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  hasVoted(param0: Address): boolean {
    let result = super.call("hasVoted", "hasVoted(address):(bool)", [
      ethereum.Value.fromAddress(param0),
    ]);

    return result[0].toBoolean();
  }

  try_hasVoted(param0: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("hasVoted", "hasVoted(address):(bool)", [
      ethereum.Value.fromAddress(param0),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  projectIds(param0: BigInt): string {
    let result = super.call("projectIds", "projectIds(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(param0),
    ]);

    return result[0].toString();
  }

  try_projectIds(param0: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall("projectIds", "projectIds(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(param0),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  projectVotes(param0: string): BigInt {
    let result = super.call("projectVotes", "projectVotes(string):(uint256)", [
      ethereum.Value.fromString(param0),
    ]);

    return result[0].toBigInt();
  }

  try_projectVotes(param0: string): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "projectVotes",
      "projectVotes(string):(uint256)",
      [ethereum.Value.fromString(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  projects(param0: string): string {
    let result = super.call("projects", "projects(string):(string)", [
      ethereum.Value.fromString(param0),
    ]);

    return result[0].toString();
  }

  try_projects(param0: string): ethereum.CallResult<string> {
    let result = super.tryCall("projects", "projects(string):(string)", [
      ethereum.Value.fromString(param0),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  getVoteCount(projectId: string): BigInt {
    let result = super.call("getVoteCount", "getVoteCount(string):(uint256)", [
      ethereum.Value.fromString(projectId),
    ]);

    return result[0].toBigInt();
  }

  try_getVoteCount(projectId: string): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getVoteCount",
      "getVoteCount(string):(uint256)",
      [ethereum.Value.fromString(projectId)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getAll(): Array<string> {
    let result = super.call("getAll", "getAll():(string[])", []);

    return result[0].toStringArray();
  }

  try_getAll(): ethereum.CallResult<Array<string>> {
    let result = super.tryCall("getAll", "getAll():(string[])", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toStringArray());
  }

  checkHasVoted(): boolean {
    let result = super.call("checkHasVoted", "checkHasVoted():(bool)", []);

    return result[0].toBoolean();
  }

  try_checkHasVoted(): ethereum.CallResult<boolean> {
    let result = super.tryCall("checkHasVoted", "checkHasVoted():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getVote(): string {
    let result = super.call("getVote", "getVote():(string)", []);

    return result[0].toString();
  }

  try_getVote(): ethereum.CallResult<string> {
    let result = super.tryCall("getVote", "getVote():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  getBalance(): BigInt {
    let result = super.call("getBalance", "getBalance():(uint256)", []);

    return result[0].toBigInt();
  }

  try_getBalance(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getBalance", "getBalance():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getThreshold(): BigInt {
    let result = super.call("getThreshold", "getThreshold():(uint256)", []);

    return result[0].toBigInt();
  }

  try_getThreshold(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getThreshold", "getThreshold():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _vrfCoordinator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _subscriptionId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _keyHash(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class RawFulfillRandomWordsCall extends ethereum.Call {
  get inputs(): RawFulfillRandomWordsCall__Inputs {
    return new RawFulfillRandomWordsCall__Inputs(this);
  }

  get outputs(): RawFulfillRandomWordsCall__Outputs {
    return new RawFulfillRandomWordsCall__Outputs(this);
  }
}

export class RawFulfillRandomWordsCall__Inputs {
  _call: RawFulfillRandomWordsCall;

  constructor(call: RawFulfillRandomWordsCall) {
    this._call = call;
  }

  get requestId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get randomWords(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }
}

export class RawFulfillRandomWordsCall__Outputs {
  _call: RawFulfillRandomWordsCall;

  constructor(call: RawFulfillRandomWordsCall) {
    this._call = call;
  }
}

export class AddCall extends ethereum.Call {
  get inputs(): AddCall__Inputs {
    return new AddCall__Inputs(this);
  }

  get outputs(): AddCall__Outputs {
    return new AddCall__Outputs(this);
  }
}

export class AddCall__Inputs {
  _call: AddCall;

  constructor(call: AddCall) {
    this._call = call;
  }

  get projectName(): string {
    return this._call.inputValues[0].value.toString();
  }

  get projectId(): string {
    return this._call.inputValues[1].value.toString();
  }
}

export class AddCall__Outputs {
  _call: AddCall;

  constructor(call: AddCall) {
    this._call = call;
  }
}

export class VoteCall extends ethereum.Call {
  get inputs(): VoteCall__Inputs {
    return new VoteCall__Inputs(this);
  }

  get outputs(): VoteCall__Outputs {
    return new VoteCall__Outputs(this);
  }
}

export class VoteCall__Inputs {
  _call: VoteCall;

  constructor(call: VoteCall) {
    this._call = call;
  }

  get projectId(): string {
    return this._call.inputValues[0].value.toString();
  }

  get voterName(): string {
    return this._call.inputValues[1].value.toString();
  }
}

export class VoteCall__Outputs {
  _call: VoteCall;

  constructor(call: VoteCall) {
    this._call = call;
  }
}

export class VoteTestCall extends ethereum.Call {
  get inputs(): VoteTestCall__Inputs {
    return new VoteTestCall__Inputs(this);
  }

  get outputs(): VoteTestCall__Outputs {
    return new VoteTestCall__Outputs(this);
  }
}

export class VoteTestCall__Inputs {
  _call: VoteTestCall;

  constructor(call: VoteTestCall) {
    this._call = call;
  }
}

export class VoteTestCall__Outputs {
  _call: VoteTestCall;

  constructor(call: VoteTestCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class WithdrawCall extends ethereum.Call {
  get inputs(): WithdrawCall__Inputs {
    return new WithdrawCall__Inputs(this);
  }

  get outputs(): WithdrawCall__Outputs {
    return new WithdrawCall__Outputs(this);
  }
}

export class WithdrawCall__Inputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}

export class WithdrawCall__Outputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}