import './fills/history';

function mount() {
  import('./components/app').then();
}

if (window.customElements) {
  import('./fills/ce-es5-shim').then(mount);
} else {
  import('./fills/ce-sd-fill').then(mount);
}
