import type { TProps, TStrategy } from './types'
import { cloneDeep } from 'lodash'

export const getInitState = <
  S,
  P,
  D,
  SK extends keyof S,
  PK extends keyof P,
  DK extends keyof D,
>(
  map: TProps<S, P, D, SK, PK, DK>,
) => {
  const currentMap = cloneDeep(map)
  return Object.keys(currentMap).reduce((pre, key) => {
    const currentKey = key as SK
    const option = currentMap[currentKey]
    pre[currentKey] = option.default
    return pre
  }, {} as S)
}

export const getFieldMap = <
  S,
  P,
  D,
  SK extends keyof S,
  PK extends keyof P,
  DK extends keyof D,
>(
  map: TProps<S, P, D, SK, PK, DK>,
) => {
  const currentMap = cloneDeep(map)
  const inputMap = {} as Record<
    DK,
    {
      stateKey: SK
      inputStrategy?: TStrategy
    }
  >
  const outputMap = {} as Record<
    SK,
    {
      outputKey: PK
      ouputStrategy?: TStrategy
    }
  >
  Object.keys(currentMap).forEach((key) => {
    const currentKey = key as SK
    const option = currentMap[currentKey]
    inputMap[option.input] = {
      stateKey: currentKey,
      inputStrategy: option.inputStrategy,
    }
    outputMap[currentKey] = {
      outputKey: option.output,
      ouputStrategy: option.ouputStrategy,
    }
  })
  return {
    inputMap,
    outputMap,
  }
}
