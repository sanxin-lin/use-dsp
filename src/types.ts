import { strategys } from './strategys'

export const NO_INPUT_KEY = Symbol('NO_INPUT_KEY')

// eslint-disable-next-line @typescript-eslint/ban-types
export type TStrategy = keyof typeof strategys
export type TInputStrategy<D, V = any> = TStrategy | ((v: V, data: D) => any)
export type TOutputStrategy<S, V = any> = TStrategy | ((v: V, data: S) => any)

export interface IOption<
  S,
  P,
  D,
  SK extends keyof S,
  PK extends keyof P = keyof P,
  DK extends keyof D = keyof D,
> {
  default: S[SK]
  input?: DK | typeof NO_INPUT_KEY
  output?: PK
  inputStrategy?: TInputStrategy<D>
  outputStrategy?: TOutputStrategy<S>
}

export type IRequiredOption<
  S,
  P,
  D,
  SK extends keyof S,
  PK extends keyof P = keyof P,
  DK extends keyof D = keyof D,
> = Required<IOption<S, P, D, SK, PK, DK>>

export type TProps<S, P, D> = {
  [SK in keyof S]: IOption<S, P, D, SK>
}
export type TRequiredProps<S, P, D> = {
  [SK in keyof S]: IRequiredOption<S, P, D, SK>
}

// interface IFetch {
//   i_name: string | null
//   i_age: number | null
//   i_id: number | null
//   i_hobbies: string | null
// }
// interface IState {
//   name: string | undefined
//   age: number | undefined
//   id: number | undefined
//   hobbies: string[]
//   password: string | undefined
// }
// interface IParams {
//   o_name: string | null
//   o_age: number | null
//   o_id: number | null
//   o_hobbies: string | null
// }

// const map: TProps<IState, IParams, IFetch> = {
//   name: {
//     default: 'sunshine_lin',
//     input: 'i_name',
//     output: 'o_name',
//     // inputStrategy: 'string2Null',
//     inputStrategy: (v) => {},
//     outputStrategy: 'string2Null',
//   },
// }

// console.log(map)

// // // eslint-disable-next-line @typescript-eslint/ban-types
// export type TStrategy = keyof typeof strategys
// export type TInputStrategy<D, DK extends keyof D> =
//   | TStrategy
//   | ((v: D[DK], data: D) => any)
// export type TOutputStrategy<S> = TStrategy | ((v: any, state: S) => any)

// interface IFetch {
//   i_name: string | null
//   i_age: number | null
//   i_id: number | null
//   i_hobbies: string[] | null
//   // ... 可能还有更多属性
// }

// // 创建一个类型，它的键可以是任意字符串，但值必须是 IFetch 的键
// type KeyMap<T> = { [P in keyof any]: keyof T }

// // 为 map 创建一个类型，它会根据 KeyMap 约束其属性和方法
// type IProps<S, P, D, DKM extends KeyMap<D>> = {
//   [P in keyof SKM]: {
//     field: KM[P]
//     fn: (value: T[KM[P]]) => void
//     default: S[SK]
//     input?: DK
//     output?: PK
//     inputStrategy?: TInputStrategy<D, DK>
//     outputStrategy?: TOutputStrategy<S>
//   }
// }
