import { reactive } from 'vue'

import { strategys } from './strategys'
import type { TProps } from './types'
import { NO_INPUT_KEY } from './types'
import { correctMap, getFieldMap, getInitState } from './utils'
import { isArray, isFunction, isString } from 'lodash'

export const useDSP = <
  S extends object = Record<string, any>,
  P extends object = Record<string, any>,
  D extends object = Record<string, any>,
  SK extends keyof S = keyof S,
  PK extends keyof P = keyof P,
  DK extends keyof D = keyof D,
>(
  map: TProps<S, P, D>,
) => {
  const currenMap = correctMap(map)
  const { inputMap, outputMap } = getFieldMap(currenMap)
  const state = reactive<S>(getInitState(currenMap))

  const inputState = (inputData: D) => {
    const currentState = Object.keys(inputData).reduce((pre, key) => {
      const inputKey = key as DK
      const options = inputMap[inputKey]
      if (isArray(options)) {
        options.forEach((option) => {
          const stateKey = option.stateKey as SK
          const inputStrategy = option.inputStrategy
          if (isString(inputStrategy)) {
            pre[stateKey] = (strategys[inputStrategy] as any)(
              inputData[inputKey],
            ) as unknown as S[SK]
          } else if (isFunction(inputStrategy)) {
            pre[stateKey] = inputStrategy(
              inputData[inputKey],
              inputData,
            ) as S[SK]
          } else {
            pre[stateKey] = inputData[inputKey] as unknown as S[SK]
          }
        })
      }
      return pre
    }, {} as S)
    const noInputs = inputMap[NO_INPUT_KEY as DK]
    if (isArray(noInputs)) {
      noInputs.forEach((option) => {
        const { stateKey, inputStrategy } = option
        if (isFunction(inputStrategy)) {
          currentState[stateKey] = inputStrategy(
            undefined as D[DK],
            inputData,
          ) as S[SK]
        }
      })
    }
    Object.assign(state, currentState)
  }

  const resetState = () => {
    Object.assign(state, getInitState(currenMap))
  }

  const ouputState = () => {
    const params = Object.keys(state).reduce((pre, key) => {
      const stateKey = key as SK
      const option = outputMap[stateKey]
      if (option) {
        const outputKey = option.outputKey as PK
        const outputStrategy = option.outputStrategy
        if (isString(outputStrategy)) {
          pre[outputKey] = (strategys[outputStrategy] as any)(
            (state as S)[stateKey],
          ) as unknown as P[PK]
        } else if (isFunction(outputStrategy)) {
          pre[outputKey] = outputStrategy(
            (state as S)[stateKey],
            state as S,
          ) as P[PK]
        } else {
          pre[outputKey] = (state as S)[stateKey] as unknown as P[PK]
        }
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
