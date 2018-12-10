/* @jsx h */

import { h } from 'preact';
import { value } from 'yocss';

export function style(...css: Array<string>) {
  return <style>{css.map(a => value(a) || a).join('')}</style>;
}
