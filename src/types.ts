import { strategys } from './strategys'

// eslint-disable-next-line @typescript-eslint/ban-types
export type TStrategy = keyof typeof strategys | Function

export interface IOption<
  S,
  P,
  D,
  SK extends keyof S,
  PK extends keyof P,
  DK extends keyof D,
> {
  default: S[SK]
  input: DK
  output: PK
  inputStrategy?: TStrategy
  ouputStrategy?: TStrategy
}

export type TProps<
  S,
  P,
  D,
  SK extends keyof S,
  PK extends keyof P,
  DK extends keyof D,
> = Record<SK, IOption<S, P, D, SK, PK, DK>>
