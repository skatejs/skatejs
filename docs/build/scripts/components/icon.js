import skate from '../../../../src/index';

export default skate('bs-icon', {
  properties: {
    from: {
      attr: true,
      value: 'fa'
    },
    prefix: {
      deps: 'from',
      get () {
        return this.from === 'bs' ? 'glyphicon' : this.from;
      }
    },
    type: {
      attr: true,
      deps: 'prefix',
      set (newValue) {
        this.className += ` ${this.prefix} ${this.prefix}-${newValue}`;
      }
    }
  }
});
