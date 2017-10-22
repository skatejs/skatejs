import withPreact from '@skatejs/renderer-preact/umd';
import val from '@skatejs/val';
import { withComponent } from '../../src';

export const Component = withComponent(withPreact());

export { h } from 'preact';
export * from './sample';
export * from './script';
export * from './style';
export * from './with-rehydration';
