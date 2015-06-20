import skate from '../../../../src/index';

export default skate('bs-label', {
  properties: {
    type: {
      attr: true,
      set (newValue) { this.className = `label label-${newValue}`; },
      value: 'default'
    }
  }
});
