import skate from '../../../../src/index';

export default skate('bs-label', {
  properties: {
    type: {
      attr: true,
      init: 'default',
      set (newValue) { this.className = `label label-${newValue}`; }
    }
  }
});
