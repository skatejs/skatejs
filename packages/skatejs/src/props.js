// @flow

const { parse } = JSON;

export const props = {
  any: (v: any) => v,
  array: parse,
  boolean: (v: string | null) => v === '',
  number: Number,
  object: parse,
  string: String
};
