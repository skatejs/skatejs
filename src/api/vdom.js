import * as IncrementalDOM from 'incremental-dom';
import internalData from './data';

// Could import these, but we have to import all of IncrementalDOM anyways so
// that we can export our configured IncrementalDOM.
const {
  applyProp,
  attr,
  attributes,
  elementClose,
  elementOpen,
  elementOpenEnd,
  elementOpenStart,
  skip,
  symbols,
  text
} = IncrementalDOM;

// Specify an environment for iDOM in case we haven't yet.
if (typeof process === 'undefined') {
  /* eslint no-undef: 0 */
  process = { env: { NODE_ENV: 'production' } };
}

const applyDefault = attributes[symbols.default];
const factories = {};

// Attributes that are not handled by Incremental DOM.
attributes.key = attributes.skip = attributes.statics = function () {};

// Attributes that *must* be set via a property on all elements.
attributes.checked = attributes.className = attributes.disabled = attributes.value = applyProp;

// Default attribute applicator.
attributes[symbols.default] = function (elem, name, value) {
  // Boolean false values should not set attributes at all.
  if (value === false) {
    return;
  }

  // Work with properties defined on the prototype chain. This includes event
  // handlers that can be bound via properties.
  if (name in elem) {
    return applyProp(elem, name, value);
  }

  // Handle custom events.
  if (name.indexOf('on') === 0) {
    return applyEvent(elem, name.substring(2), name, value);
  }

  // Custom element properties should be set as properties.
  const dataName = elem.tagName + '.' + name;
  if (internalData.applyProp[dataName]) {
    return applyProp(elem, name, value);
  }

  // Fallback to default IncrementalDOM behaviour.
  applyDefault(elem, name, value);
};

// Adds or removes an event listener for an element.
function applyEvent (elem, ename, name, value) {
  let events = elem.__events;

  if (!events) {
    events = elem.__events = {};
  }

  const eFunc = events[ename];

  // Remove old listener so they don't double up.
  if (eFunc) {
    elem.removeEventListener(ename, eFunc);
  }

  // Bind new listener.
  if (value) {
    elem.addEventListener(ename, events[ename] = function (e) {
      if (this === e.target) {
        value.call(this, e);
      }
    });
  }
}

// Creates a factory and returns it.
function bind (tname) {
  if (typeof tname === 'function') {
    tname = tname.id || tname.name;
  }

  return factories[tname] = function (attrs, chren) {
    if (attrs && typeof attrs === 'object') {
      elementOpenStart(tname, attrs.key, attrs.statics);
      for (let a in attrs) {
        attr(a, attrs[a]);
      }
      elementOpenEnd();
    } else {
      elementOpen(tname);
      chren = attrs;
      attrs = {};
    }

    if (attrs.skip) {
      skip();
    } else {
      const chrenType = typeof chren;
      if (chrenType === 'function') {
        chren();
      } else if (chrenType === 'string' || chrenType === 'number') {
        text(chren);
      }
    }

    return elementClose(tname);
  };
}

// The default function requries a tag name.
export default function create (tname, attrs, chren) {
  return (factories[tname] || bind(tname))(attrs, chren);
}

// Export the Incremental DOM text() function directly as we don't need to do
// any special processing for it.
export { text };

// We export IncrementalDOM in its entirety because we want the user to be able
// to user our configured version while still being able to use various other
// templating languages and techniques that compile down to it.
export { IncrementalDOM };

// Create factories for all HTML elements except for ones that match keywords
// such as "var".
export const a = bind('a');
export const abbr = bind('abbr');
export const address = bind('address');
export const area = bind('area');
export const article = bind('article');
export const aside = bind('aside');
export const audio = bind('audio');
export const b = bind('b');
export const base = bind('base');
export const bdi = bind('bdi');
export const bdo = bind('bdo');
export const bgsound = bind('bgsound');
export const blockquote = bind('blockquote');
export const body = bind('body');
export const br = bind('br');
export const button = bind('button');
export const canvas = bind('canvas');
export const caption = bind('caption');
export const cite = bind('cite');
export const code = bind('code');
export const col = bind('col');
export const colgroup = bind('colgroup');
export const command = bind('command');
export const content = bind('content');
export const data = bind('data');
export const datalist = bind('datalist');
export const dd = bind('dd');
export const del = bind('del');
export const details = bind('details');
export const dfn = bind('dfn');
export const dialog = bind('dialog');
export const div = bind('div');
export const dl = bind('dl');
export const dt = bind('dt');
export const element = bind('element');
export const em = bind('em');
export const embed = bind('embed');
export const fieldset = bind('fieldset');
export const figcaption = bind('figcaption');
export const figure = bind('figure');
export const font = bind('font');
export const footer = bind('footer');
export const form = bind('form');
export const h1 = bind('h1');
export const h2 = bind('h2');
export const h3 = bind('h3');
export const h4 = bind('h4');
export const h5 = bind('h5');
export const h6 = bind('h6');
export const head = bind('head');
export const header = bind('header');
export const hgroup = bind('hgroup');
export const hr = bind('hr');
export const html = bind('html');
export const i = bind('i');
export const iframe = bind('iframe');
export const image = bind('image');
export const img = bind('img');
export const input = bind('input');
export const ins = bind('ins');
export const kbd = bind('kbd');
export const keygen = bind('keygen');
export const label = bind('label');
export const legend = bind('legend');
export const li = bind('li');
export const link = bind('link');
export const main = bind('main');
export const map = bind('map');
export const mark = bind('mark');
export const marquee = bind('marquee');
export const menu = bind('menu');
export const menuitem = bind('menuitem');
export const meta = bind('meta');
export const meter = bind('meter');
export const multicol = bind('multicol');
export const nav = bind('nav');
export const nobr = bind('nobr');
export const noembed = bind('noembed');
export const noframes = bind('noframes');
export const noscript = bind('noscript');
export const object = bind('object');
export const ol = bind('ol');
export const optgroup = bind('optgroup');
export const option = bind('option');
export const output = bind('output');
export const p = bind('p');
export const param = bind('param');
export const picture = bind('picture');
export const pre = bind('pre');
export const progress = bind('progress');
export const q = bind('q');
export const rp = bind('rp');
export const rt = bind('rt');
export const rtc = bind('rtc');
export const ruby = bind('ruby');
export const s = bind('s');
export const samp = bind('samp');
export const script = bind('script');
export const section = bind('section');
export const select = bind('select');
export const shadow = bind('shadow');
export const slot = bind('slot');
export const small = bind('small');
export const source = bind('source');
export const span = bind('span');
export const strong = bind('strong');
export const style = bind('style');
export const sub = bind('sub');
export const summary = bind('summary');
export const sup = bind('sup');
export const table = bind('table');
export const tbody = bind('tbody');
export const td = bind('td');
export const template = bind('template');
export const textarea = bind('textarea');
export const tfoot = bind('tfoot');
export const th = bind('th');
export const thead = bind('thead');
export const time = bind('time');
export const title = bind('title');
export const tr = bind('tr');
export const track = bind('track');
export const u = bind('u');
export const ul = bind('ul');
export const video = bind('video');
export const wbr = bind('wbr');
