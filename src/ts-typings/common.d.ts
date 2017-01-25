export type Key = string | number;
export type Ref<T> = ((instance: T) => any);

interface Attributes {
  key?: Key,
}
interface ClassAttributes<T> extends Attributes {
  ref?: Ref<T>,
  slot?: string,
}

//
// JSX Related types
// ----------------------------------------------------------------------

export type HTMLProps<T extends Element> = Partial<T> & IncrementalHyperscriptAttributes<T>;
export type IncrementalHyperscriptAttributes<T> = IncrementalDomHTMLAttributes<T> & HyperscriptHTMLAttributes & HyperscriptEventHandler<T>;

interface IncrementalDomHTMLAttributes<T> {
  key?: Key,
  ref?: Ref<T>,
  statics?: string[],
  skip?: boolean,
}
interface HyperscriptHTMLAttributes {
  class?: string,
  role?: string,
}

interface HyperscriptEventHandler<T> {
  onAbort?: typeof HTMLElement.prototype.onabort;
  onActivate?: typeof HTMLElement.prototype.onactivate;
  onBeforeactivate?: typeof HTMLElement.prototype.onbeforeactivate;
  onBeforecopy?: typeof HTMLElement.prototype.onbeforecopy;
  onBeforecut?: typeof HTMLElement.prototype.onbeforecut;
  onBeforedeactivate?: typeof HTMLElement.prototype.onbeforedeactivate;
  onBeforepaste?: typeof HTMLElement.prototype.onbeforepaste;
  onBlur?: typeof HTMLElement.prototype.onblur;
  onCanplay?: typeof HTMLElement.prototype.oncanplay;
  onCanplaythrough?: typeof HTMLElement.prototype.oncanplaythrough;
  onChange?: typeof HTMLElement.prototype.onchange;
  onClick?: typeof HTMLElement.prototype.onclick;
  onContextmenu?: typeof HTMLElement.prototype.oncontextmenu;
  onCopy?: typeof HTMLElement.prototype.oncopy;
  onCuechange?: typeof HTMLElement.prototype.oncuechange;
  onCut?: typeof HTMLElement.prototype.oncut;
  onDblclick?: typeof HTMLElement.prototype.ondblclick;
  onDeactivate?: typeof HTMLElement.prototype.ondeactivate;
  onDrag?: typeof HTMLElement.prototype.ondrag;
  onDragend?: typeof HTMLElement.prototype.ondragend;
  onDragenter?: typeof HTMLElement.prototype.ondragenter;
  onDragleave?: typeof HTMLElement.prototype.ondragleave;
  onDragover?: typeof HTMLElement.prototype.ondragover;
  onDragstart?: typeof HTMLElement.prototype.ondragstart;
  onDrop?: typeof HTMLElement.prototype.ondrop;
  onDurationchange?: typeof HTMLElement.prototype.ondurationchange;
  onEmptied?: typeof HTMLElement.prototype.onemptied;
  onEnded?: typeof HTMLElement.prototype.onended;
  onError?: typeof HTMLElement.prototype.onerror;
  onFocus?: typeof HTMLElement.prototype.onfocus;
  onInput?: typeof HTMLElement.prototype.oninput;
  onInvalid?: typeof HTMLElement.prototype.oninvalid;
  onKeydown?: typeof HTMLElement.prototype.onkeydown;
  onKeypress?: typeof HTMLElement.prototype.onkeypress;
  onKeyup?: typeof HTMLElement.prototype.onkeyup;
  onLoad?: typeof HTMLElement.prototype.onload;
  onLoadeddata?: typeof HTMLElement.prototype.onloadeddata;
  onLoadedmetadata?: typeof HTMLElement.prototype.onloadedmetadata;
  onLoadstart?: typeof HTMLElement.prototype.onloadstart;
  onMousedown?: typeof HTMLElement.prototype.onmousedown;
  onMouseenter?: typeof HTMLElement.prototype.onmouseenter;
  onMouseleave?: typeof HTMLElement.prototype.onmouseleave;
  onMousemove?: typeof HTMLElement.prototype.onmousemove;
  onMouseout?: typeof HTMLElement.prototype.onmouseout;
  onMouseover?: typeof HTMLElement.prototype.onmouseover;
  onMouseup?: typeof HTMLElement.prototype.onmouseup;
  onMousewheel?: typeof HTMLElement.prototype.onmousewheel;
  onMscontentzoom?: typeof HTMLElement.prototype.onmscontentzoom;
  onMsmanipulationstatechanged?: typeof HTMLElement.prototype.onmsmanipulationstatechanged;
  onPaste?: typeof HTMLElement.prototype.onpaste;
  onPause?: typeof HTMLElement.prototype.onpause;
  onPlay?: typeof HTMLElement.prototype.onplay;
  onPlaying?: typeof HTMLElement.prototype.onplaying;
  onProgress?: typeof HTMLElement.prototype.onprogress;
  onRatechange?: typeof HTMLElement.prototype.onratechange;
  onReset?: typeof HTMLElement.prototype.onreset;
  onScroll?: typeof HTMLElement.prototype.onscroll;
  onSeeked?: typeof HTMLElement.prototype.onseeked;
  onSeeking?: typeof HTMLElement.prototype.onseeking;
  onSelect?: typeof HTMLElement.prototype.onselect;
  onSelectstart?: typeof HTMLElement.prototype.onselectstart;
  onStalled?: typeof HTMLElement.prototype.onstalled;
  onSubmit?: typeof HTMLElement.prototype.onsubmit;
  onSuspend?: typeof HTMLElement.prototype.onsuspend;
  onTimeupdate?: typeof HTMLElement.prototype.ontimeupdate;
  onVolumechange?: typeof HTMLElement.prototype.onvolumechange;
  onWaiting?: typeof HTMLElement.prototype.onwaiting;
}
