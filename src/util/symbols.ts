export const connected = '____skate_connected';
export const created = '____skate_created';

// DEPRECATED
//
// This is the only "symbol" that must stay a string. This is because it is
// relied upon across several versions. We should remove it, but ensure that
// it's considered a breaking change that whatever version removes it cannot
// be passed to vdom functions as tag names.
export const name = '____skate_name';

export const props = '____skate_props';
export const ref = '____skate_ref';
export const renderer = '____skate_renderer';
export const rendering = '____skate_rendering';
export const rendererDebounced = '____skate_rendererDebounced';
export const updated = '____skate_updated';
