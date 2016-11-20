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
  initial?: any; //|(elem:any, data:any) => any;
  serialize?: (v:any) => ?string;
}

/**
 * Property Definition
 * Used internally is the model that holds the metadata about a skate Property
 * Property Definitions are created and cached per Component Class
 * It is created from a Property Config
 * Once created a Property Definition should be considered immutable
 * Note: some members are the same as a IPropConfig but some are not!
 * Some members are required
 */
// todo: create an actual class ProprertyDefinition that implements IPropDef?
declare interface IPropDef {
  attrName: ?string; //name of the linked attribute if any
  coerce?: ?(v:any) => any;
  default: any; //|(elem:any, data:any) => any;
  deserialize: (v:?string) => any;
  initial?: any; //|(elem:any, data:any) => any;
  name: string|Symbol; //property name can also be a symbol!
  serialize: (v:any) => ?string;
}

/**
 * Property Descriptor
 * The native javascript Property Descriptor to use with Object.defineProperty()
 */
declare interface IPropertyDescriptor {
  configurable: boolean;
  enumerable: boolean;
  created: (elem:any) => void; //Note: called just before creating the native property
  get: () => any;
  set: (newValue:any) => void
}
