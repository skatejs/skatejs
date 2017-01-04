export { }

type HTMLProps<T extends Element> = Partial<T> & HyperscriptEventHandler<T>;

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

declare global {
  // https://www.typescriptlang.org/docs/handbook/jsx.html
  namespace JSX {
    interface ElementClass {
    }

    interface ElementAttributesProperty<Props> {
      // Special hack for own components type checking.
      // more detail, see: https://www.typescriptlang.org/docs/handbook/jsx.html
      //               and https://github.com/skatejs/skatejs/pull/952#issuecomment-264500153
      readonly _props: Props,
    }

    interface Element {
    }

    interface IntrinsicElements {
      a: HTMLProps<HTMLAnchorElement>;
      abbr: HTMLProps<HTMLElement>;
      address: HTMLProps<HTMLElement>;
      area: HTMLProps<HTMLAreaElement>;
      article: HTMLProps<HTMLElement>;
      aside: HTMLProps<HTMLElement>;
      audio: HTMLProps<HTMLAudioElement>;
      b: HTMLProps<HTMLElement>;
      base: HTMLProps<HTMLBaseElement>;
      bdi: HTMLProps<HTMLElement>;
      bdo: HTMLProps<HTMLElement>;
      big: HTMLProps<HTMLElement>;
      blockquote: HTMLProps<HTMLElement>;
      body: HTMLProps<HTMLBodyElement>;
      br: HTMLProps<HTMLBRElement>;
      button: HTMLProps<HTMLButtonElement>;
      canvas: HTMLProps<HTMLCanvasElement>;
      caption: HTMLProps<HTMLElement>;
      cite: HTMLProps<HTMLElement>;
      code: HTMLProps<HTMLElement>;
      col: HTMLProps<HTMLTableColElement>;
      colgroup: HTMLProps<HTMLTableColElement>;
      data: HTMLProps<HTMLElement>;
      datalist: HTMLProps<HTMLDataListElement>;
      dd: HTMLProps<HTMLElement>;
      del: HTMLProps<HTMLElement>;
      details: HTMLProps<HTMLElement>;
      dfn: HTMLProps<HTMLElement>;
      dialog: HTMLProps<HTMLElement>;
      div: HTMLProps<HTMLDivElement>;
      dl: HTMLProps<HTMLDListElement>;
      dt: HTMLProps<HTMLElement>;
      em: HTMLProps<HTMLElement>;
      embed: HTMLProps<HTMLEmbedElement>;
      fieldset: HTMLProps<HTMLFieldSetElement>;
      figcaption: HTMLProps<HTMLElement>;
      figure: HTMLProps<HTMLElement>;
      footer: HTMLProps<HTMLElement>;
      form: HTMLProps<HTMLFormElement>;
      h1: HTMLProps<HTMLHeadingElement>;
      h2: HTMLProps<HTMLHeadingElement>;
      h3: HTMLProps<HTMLHeadingElement>;
      h4: HTMLProps<HTMLHeadingElement>;
      h5: HTMLProps<HTMLHeadingElement>;
      h6: HTMLProps<HTMLHeadingElement>;
      head: HTMLProps<HTMLHeadElement>;
      header: HTMLProps<HTMLElement>;
      hgroup: HTMLProps<HTMLElement>;
      hr: HTMLProps<HTMLHRElement>;
      html: HTMLProps<HTMLHtmlElement>;
      i: HTMLProps<HTMLElement>;
      iframe: HTMLProps<HTMLIFrameElement>;
      img: HTMLProps<HTMLImageElement>;
      input: HTMLProps<HTMLInputElement>;
      ins: HTMLProps<HTMLModElement>;
      kbd: HTMLProps<HTMLElement>;
      keygen: HTMLProps<HTMLElement>;
      label: HTMLProps<HTMLLabelElement>;
      legend: HTMLProps<HTMLLegendElement>;
      li: HTMLProps<HTMLLIElement>;
      link: HTMLProps<HTMLLinkElement>;
      main: HTMLProps<HTMLElement>;
      map: HTMLProps<HTMLMapElement>;
      mark: HTMLProps<HTMLElement>;
      menu: HTMLProps<HTMLElement>;
      menuitem: HTMLProps<HTMLElement>;
      meta: HTMLProps<HTMLMetaElement>;
      meter: HTMLProps<HTMLElement>;
      nav: HTMLProps<HTMLElement>;
      noscript: HTMLProps<HTMLElement>;
      object: HTMLProps<HTMLObjectElement>;
      ol: HTMLProps<HTMLOListElement>;
      optgroup: HTMLProps<HTMLOptGroupElement>;
      option: HTMLProps<HTMLOptionElement>;
      output: HTMLProps<HTMLElement>;
      p: HTMLProps<HTMLParagraphElement>;
      param: HTMLProps<HTMLParamElement>;
      picture: HTMLProps<HTMLElement>;
      pre: HTMLProps<HTMLPreElement>;
      progress: HTMLProps<HTMLProgressElement>;
      q: HTMLProps<HTMLQuoteElement>;
      rp: HTMLProps<HTMLElement>;
      rt: HTMLProps<HTMLElement>;
      ruby: HTMLProps<HTMLElement>;
      s: HTMLProps<HTMLElement>;
      samp: HTMLProps<HTMLElement>;
      script: HTMLProps<HTMLElement>;
      section: HTMLProps<HTMLElement>;
      select: HTMLProps<HTMLSelectElement>;
      small: HTMLProps<HTMLElement>;
      source: HTMLProps<HTMLSourceElement>;
      span: HTMLProps<HTMLSpanElement>;
      strong: HTMLProps<HTMLElement>;
      style: HTMLProps<HTMLStyleElement>;
      sub: HTMLProps<HTMLElement>;
      summary: HTMLProps<HTMLElement>;
      sup: HTMLProps<HTMLElement>;
      table: HTMLProps<HTMLTableElement>;
      tbody: HTMLProps<HTMLTableSectionElement>;
      td: HTMLProps<HTMLTableDataCellElement>;
      textarea: HTMLProps<HTMLTextAreaElement>;
      tfoot: HTMLProps<HTMLTableSectionElement>;
      th: HTMLProps<HTMLTableHeaderCellElement>;
      thead: HTMLProps<HTMLTableSectionElement>;
      time: HTMLProps<HTMLElement>;
      title: HTMLProps<HTMLTitleElement>;
      tr: HTMLProps<HTMLTableRowElement>;
      track: HTMLProps<HTMLTrackElement>;
      u: HTMLProps<HTMLElement>;
      ul: HTMLProps<HTMLUListElement>;
      "var": HTMLProps<HTMLElement>;
      video: HTMLProps<HTMLVideoElement>;
      wbr: HTMLProps<HTMLElement>;

      slot: HTMLProps<HTMLSlotElement>;
    }
  }
}
