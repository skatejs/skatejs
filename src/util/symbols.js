//@flow
//todo: are these strings instead of actual Symbols for backward compatibility?

export const connected:string = '____skate_connected';
export const created:string = '____skate_created';
export const props:string = '____skate_props';

// DEPRECATED
//
// This is the only "symbol" that must stay a string. This is because it is
// relied upon across several versions. We should remove it, but ensure that
// it's considered a breaking change that whatever version removes it cannot
// be passed to vdom functions as tag names.
export const name:string = '____skate_name';

export const ref:string = '____skate_ref';
export const renderer:string = '____skate_renderer';
export const rendering:string = '____skate_rendering';
export const rendererDebounced:string = '____skate_rendererDebounced';
export const updated:string = '____skate_updated';
