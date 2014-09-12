import './lib/polyfills';
import bootstrap from './unit/bootstrap';
import attributes from './unit/attributes';
// import './unit/components';
// import './unit/dom';
// import './unit/events';
// import './unit/ignoring';
// import './unit/init';
// import './unit/lifecycle';
// import './unit/registration';
// import './unit/templating';
// import './unit/version';

bootstrap();
attributes();

window.__karma__.start();
