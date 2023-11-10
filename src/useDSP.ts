import { reactive } from 'vue'

import { strategys } from './strategys'
import type { TProps } from './types'
import { getFieldMap, getInitState } from './utils'
import { isFunction, isString } from 'lodash'

export const useDSP = <
  S extends object = Record<string, any>,
  P extends object = Record<string, any>,
  D extends object = Record<string, any>,
  SK extends keyof S = keyof S,
  PK extends keyof P = keyof P,
  DK extends keyof D = keyof D,
>(
  map: TProps<S, P, D, SK, PK, DK>,
) => {
  const { inputMap, outputMap } = getFieldMap(map)
  const state = reactive<S>(getInitState(map))

  const inputState = (inputData: D) => {
    const currentState = Object.keys(inputData).reduce((pre, key) => {
      const inputKey = key as DK
      const option = inputMap[inputKey]
      const stateKey = option.stateKey as SK
      const inputStrategy = option.inputStrategy
      if (isString(inputStrategy)) {
        pre[stateKey] = (strategys[inputStrategy] as any)(
          inputData[inputKey],
        ) as unknown as S[SK]
      } else if (isFunction(inputStrategy)) {
        pre[stateKey] = inputStrategy(inputData[inputKey]) as S[SK]
      } else {
        pre[stateKey] = inputData[inputKey] as unknown as S[SK]
      }
      return pre
    }, {} as S)
    Object.assign(state, currentState)
  }

  const resetState = () => {
    Object.assign(state, getInitState(map))
  }

  const ouputState = () => {
    const params = Object.keys(state).reduce((pre, key) => {
      const stateKey = key as SK
      const option = outputMap[stateKey]
      const outputKey = option.outputKey as PK
      const ouputStrategy = option.ouputStrategy
      if (isString(ouputStrategy)) {
        pre[outputKey] = (strategys[ouputStrategy] as any)(
          (state as S)[stateKey],
        ) as unknown as P[PK]
      } else if (isFunction(ouputStrategy)) {
        pre[outputKey] = ouputStrategy((state as S)[stateKey]) as P[PK]
      } else {
        pre[outputKey] = (state as S)[stateKey] as unknown as P[PK]
      }
      return pre
    }, {} as P)
    return params
  }

  return {
    state,
    resetState,
    inputState,
    ouputState,
  }
}

export default useDSP
