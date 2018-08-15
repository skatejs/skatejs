/* @jsx h */

import { h } from 'preact';

export function style(...css: Array<string>) {
  return <style>{css.join('')}</style>;
}
