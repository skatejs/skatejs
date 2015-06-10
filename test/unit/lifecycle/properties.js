import lifecycleProperties from '../../../src/lifecycle/properties';

describe('lifecycle/properties', function () {
  var div;

  beforeEach(function () {
    div = document.createElement('div');
  });

  it('no arguments', function () {
    lifecycleProperties(div, {
      propName1: undefined
    });

    div.propName1 = 'testing';
    expect(div.propName1).to.equal('testing', 'Value should just be passed through');
    expect(div.getAttribute('prop-name1')).to.equal(null, 'Attribute linking should be off by default');
  });

  it('type', function () {
    lifecycleProperties(div, {
      propName1: Boolean,
      propName2: {
        type: Boolean
      }
    });

    div.propName1 = '';
    div.propName2 = 'something';
    expect(div.propName1).to.equal(false, 'Type function can be specified instead of object');
    expect(div.propName2).to.equal(true, 'Object with only type definition can be specified');
  });

  it('attribute', function () {
    lifecycleProperties(div, {
      propName1: {
        attr: true
      },
      propName2: {
        attr: 'my-attr'
      }
    });

    div.propName1 = 'testing1';
    div.propName2 = 'testing2';
    expect(div.getAttribute('prop-name1')).to.equal('testing1', 'Boolean true will use the property name in dash-case form');
    expect(div.getAttribute('my-attr')).to.equal('testing2', 'A string is used as the attribute name exactly');
  });

  it('Boolean + attribute', function () {
    lifecycleProperties(div, {
      propName1: {
        attr: true,
        type: Boolean
      }
    });

    div.propName1 = 'something';
    expect(div.propName1).to.equal(true, 'Value should just be converted to boolean true');
    expect(div.getAttribute('prop-name1')).to.equal('', 'Attribute should be added but no value should be set');

    div.propName1 = '';
    expect(div.propName1).to.equal(false, 'Value should be converted to boolean false');
    expect(div.getAttribute('prop-name1')).to.equal(null, 'Attribute should be removed if value is false');
  });

  it('events', function () {
    var triggered;

    lifecycleProperties(div, {
      propName1: {
        notify: true
      }
    });

    div.addEventListener('skate-property-propName1', function () {
      triggered = true;
    });

    div.propName1 = 'testing';
    expect(triggered).to.equal(true);
  });

  it('dependencies', function () {
    var triggered;

    lifecycleProperties(div, {
      propName1: {
        notify: true
      },
      propName2: {
        deps: ['propName1']
      }
    });

    div.addEventListener('skate-property-propName2', function () {
      triggered = true;
    });

    div.propName1 = 'testing';
    expect(triggered).to.equal(true);
  });

  it('attribute triggers property change', function () {
    var triggered;

    lifecycleProperties(div, {
      propName1: {
        attr: true,
        notify: true
      }
    });

    div.addEventListener('skate-property-propName1', function () {
      triggered = true;
    });

    div.setAttribute('prop-name1', 'some value');
    expect(triggered.to.equal(true));
  });
});
