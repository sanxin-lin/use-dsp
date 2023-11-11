import { useDSP } from './index'
import { isFunction, isPlainObject } from 'lodash'
import { expect, test } from 'vitest'

interface IFetch {
  is_name: string | null
  in_age: number | null
  in_id: number | null
  is_hobbies: string | null
}
interface IState {
  name: string | undefined
  age: number | undefined
  id: number | undefined
  hobbies: string[]
}
interface IParams {
  os_name: string | null
  on_age: number | null
  on_id: number | null
  os_hobbies: string | null
}

test('useDSP is a function', () => {
  expect(isFunction(useDSP)).toBeTruthy()
})

test('useDSP return type validate', () => {
  const useDSPReturn = useDSP<IState, IParams, IFetch>({
    id: {
      default: 1,
    },
    name: {
      default: 'sunshine_lin',
    },
    age: {
      default: 2,
    },
    hobbies: {
      default: [],
    },
  })
  expect(isPlainObject(useDSPReturn)).toBeTruthy()
  const { state, inputState, outputState, resetState } = useDSPReturn
  expect(isPlainObject(state)).toBeTruthy()
  expect(isFunction(inputState)).toBeTruthy()
  expect(isFunction(outputState)).toBeTruthy()
  expect(isFunction(resetState)).toBeTruthy()
})

test('useDSP inputState without strategy', () => {
  const { state, inputState } = useDSP<IState, IParams, IFetch>({
    id: {
      default: 1,
      input: 'in_id',
    },
    name: {
      default: 'sunshine_lin',
      input: 'is_name',
    },
    age: {
      default: 2,
      input: 'in_age',
    },
    hobbies: {
      default: [],
      input: 'is_hobbies',
    },
  })

  expect(state).toStrictEqual<IState>({
    id: 1,
    name: 'sunshine_lin',
    age: 2,
    hobbies: [],
  })

  inputState({
    in_id: 6,
    is_name: 'sanxin_lin',
    in_age: 20,
    is_hobbies: '1,2',
  })

  expect(state).toStrictEqual({
    id: 6,
    name: 'sanxin_lin',
    age: 20,
    hobbies: '1,2',
  })
})

test('useDSP inputState with strategy', () => {
  const { state, inputState } = useDSP<IState, IParams, IFetch>({
    id: {
      default: 1,
      input: 'in_id',
      inputStrategy: 'number2String',
    },
    name: {
      default: 'sunshine_lin',
      input: 'is_name',
      inputStrategy: (v: any, data) => {
        return `${v}-${data.in_age}`
      },
    },
    age: {
      default: 2,
      input: 'in_age',
      inputStrategy: 'number2String',
    },
    hobbies: {
      default: [],
      input: 'is_hobbies',
      inputStrategy: 'string2ArrayoEmpty',
    },
  })

  expect(state).toStrictEqual<IState>({
    id: 1,
    name: 'sunshine_lin',
    age: 2,
    hobbies: [],
  })

  inputState({
    in_id: 6,
    is_name: 'sanxin_lin',
    in_age: 20,
    is_hobbies: '1,2',
  })

  expect(state).toStrictEqual({
    id: '6',
    name: 'sanxin_lin-20',
    age: '20',
    hobbies: ['1', '2'],
  })
})

test('useDSP outputState without strategy', () => {
  const { state, outputState } = useDSP<IState, IParams, IFetch>({
    id: {
      default: 1,
      output: 'on_id',
    },
    name: {
      default: 'sunshine_lin',
      output: 'os_name',
    },
    age: {
      default: 2,
      output: 'on_age',
    },
    hobbies: {
      default: [],
      output: 'os_hobbies',
    },
  })

  expect(state).toStrictEqual<IState>({
    id: 1,
    name: 'sunshine_lin',
    age: 2,
    hobbies: [],
  })

  expect(outputState()).toStrictEqual({
    on_id: 1,
    os_name: 'sunshine_lin',
    on_age: 2,
    os_hobbies: [],
  })
})

test('useDSP outputState with strategy', () => {
  const { state, outputState } = useDSP<IState, IParams, IFetch>({
    id: {
      default: 1,
      output: 'on_id',
    },
    name: {
      default: 'sunshine_lin',
      output: 'os_name',
      outputStrategy: (v: any, state) => {
        return `${v}-${state.age}`
      },
    },
    age: {
      default: 2,
      output: 'on_age',
    },
    hobbies: {
      default: ['1', '2'],
      output: 'os_hobbies',
      outputStrategy: 'array2StringoNull',
    },
  })

  expect(state).toStrictEqual<IState>({
    id: 1,
    name: 'sunshine_lin',
    age: 2,
    hobbies: ['1', '2'],
  })

  expect(outputState()).toStrictEqual({
    on_id: 1,
    os_name: 'sunshine_lin-2',
    on_age: 2,
    os_hobbies: '1,2',
  })
})

const testDSP = () => {
  const dsp = useDSP<IState, IParams, IFetch>({
    id: {
      default: 1,
      input: 'in_id',
      output: 'on_id',
    },
    name: {
      default: 'sunshine_lin',
      input: 'is_name',
      output: 'os_name',
      inputStrategy: (v: any, data) => {
        return `${v}-${data.in_age}`
      },
      outputStrategy: (v: any, state) => {
        return `${v}-${state.age}`
      },
    },
    age: {
      default: 2,
      input: 'in_age',
      output: 'on_age',
      inputStrategy: 'number2String',
      outputStrategy: 'string2Number',
    },
    hobbies: {
      default: ['1', '2'],
      input: 'is_hobbies',
      output: 'os_hobbies',
      inputStrategy: 'string2ArrayoEmpty',
      outputStrategy: 'array2StringoNull',
    },
  })

  const { state, inputState, outputState } = dsp

  expect(state).toStrictEqual<IState>({
    id: 1,
    name: 'sunshine_lin',
    age: 2,
    hobbies: ['1', '2'],
  })

  inputState({
    in_id: 6,
    is_name: 'sanxin_lin',
    in_age: 20,
    is_hobbies: '',
  })

  expect(state).toStrictEqual({
    id: 6,
    name: 'sanxin_lin-20',
    age: '20',
    hobbies: [],
  })

  expect(outputState()).toStrictEqual({
    on_id: 6,
    os_name: 'sanxin_lin-20-20',
    on_age: 20,
    os_hobbies: null,
  })

  return dsp
}

test('useDSP inputState and outputState', testDSP)

test('useDSP resetState', () => {
  const { state, resetState } = testDSP()

  resetState()

  expect(state).toStrictEqual<IState>({
    id: 1,
    name: 'sunshine_lin',
    age: 2,
    hobbies: ['1', '2'],
  })
})
