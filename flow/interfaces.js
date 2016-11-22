declare interface IGetData {
  name:string|Symbol;
  internalValue:any;
}

declare interface ISetData {
  name:string|Symbol;
  newValue:any;
  oldValue:any;
}

/**
 * Property Configuration
 * The options that can be used when configuring a property with skate
 * Note: every member of this interface is optional!
 */
declare interface IPropConfig {
  attribute?: boolean|string;
  coerce?: (v:any) => any;
  default?: any; //|(elem:any, data:any) => any;
  deserialize?: (v:?string) => any;
  get?: (elem:any, data:IGetData) => any;
  initial?: any; //|(elem:any, data:any) => any;
  serialize?: (v:any) => ?string;
  set?: (elem:any, data:ISetData) => void;
}
