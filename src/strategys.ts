import { isArray, isString } from 'lodash'

export const string2Number = (str: string) => Number(str)
export const string2Null = (str: string) => (str ? str : null)
export const string2Undefined = (str: string) => (str ? str : undefined)
export const string2Array = (str: string, splitKey = ',') =>
  isString(str) ? str.split(splitKey) : [str]
export const string2ArrayoEmpty = (str: string, splitKey = ',') =>
  isString(str) && str ? string2Array(str, splitKey) : []
export const string2ArrayoNull = (str: string, splitKey = ',') =>
  isString(str) && str ? string2Array(str, splitKey) : null
export const string2ArrayoUndefined = (str: string, splitKey = ',') =>
  isString(str) && str ? string2Array(str, splitKey) : undefined
export const number2Null = (num: number) => (num ? num : null)
export const number2Undefined = (num: number) => (num ? num : undefined)
export const number2String = (num: number) => String(num)
export const array2String = <T>(arr: T[], joinKey = ',') =>
  isArray(arr) ? arr.join(joinKey) : arr
export const array2StringoNull = <T>(arr: T[], joinKey = ',') =>
  array2String(arr, joinKey) || null
export const array2StringoUndefined = <T>(arr: T[], joinKey = ',') =>
  array2String(arr, joinKey) || undefined

export const strategys = {
  string2Number,
  string2Null,
  string2Undefined,
  string2Array,
  string2ArrayoEmpty,
  string2ArrayoNull,
  string2ArrayoUndefined,
  number2String,
  number2Null,
  number2Undefined,
  array2String,
  array2StringoNull,
  array2StringoUndefined,
}
