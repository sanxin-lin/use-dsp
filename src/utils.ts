import {
  NO_INPUT_KEY,
  type TInputStrategy,
  type TOutputStrategy,
  type TProps,
  type TRequiredProps,
} from './types'
import { cloneDeep, isNil } from 'lodash'

export const correctMap = <S, P, D>(
  map: TProps<S, P, D>,
): TRequiredProps<S, P, D> => {
  const currentMap = cloneDeep(map)
  Object.keys(currentMap).forEach((key) => {
    const option = currentMap[key as keyof S]
    if (isNil(option.input)) {
      option.input = NO_INPUT_KEY
    }
    if (isNil(option.inputStrategy)) {
      option.inputStrategy = (v) => v
    }
    if (isNil(option.outputStrategy)) {
      option.outputStrategy = (v) => v
    }
  })
  return currentMap as TRequiredProps<S, P, D>
}

export const getInitState = <S, P, D>(map: TRequiredProps<S, P, D>) => {
  const currentMap = cloneDeep(map)
  return Object.keys(currentMap).reduce((pre, key) => {
    const currentKey = key as keyof S
    const option = currentMap[currentKey]
    pre[currentKey] = option.default
    return pre
  }, {} as S)
}

export const getFieldMap = <S, P, D>(map: TRequiredProps<S, P, D>) => {
  const currentMap = cloneDeep(map)
  const inputMap = {} as {
    [DK in keyof D]: {
      stateKey: keyof S
      inputStrategy?: TInputStrategy<D, D[DK]>
    }[]
  }
  const outputMap = {} as {
    [SK in keyof S]: {
      outputKey: keyof P
      outputStrategy?: TOutputStrategy<S, S[SK]>
    }
  }
  Object.keys(currentMap).forEach((key) => {
    const currentKey = key as keyof S
    const option = currentMap[currentKey]
    const input = option.input as keyof D
    const output = option.output as keyof P
    if (!inputMap[input]) {
      inputMap[input] = []
    }
    inputMap[input].push({
      stateKey: currentKey,
      inputStrategy: option.inputStrategy,
    })
    if (!isNil(output)) {
      outputMap[currentKey] = {
        outputKey: output,
        outputStrategy: option.outputStrategy,
      }
    }
  })
  return {
    inputMap,
    outputMap,
  }
}
