import { prop } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import assign from '../../../src/util/assign';
import element from '../../lib/element';

function create (prop) {
  return new (element().skate({
    props: {
      test: assign({ attribute: true }, prop)
    }
  }));
}

function testTypeValues (type, values) {
  const elem = create(prop[type]());
  values.forEach(function (value) {
    elem.test = value[0];
    expect(elem.test).to.equal(value[1], 'property');
    expect(elem.getAttribute('test')).to.equal(value[2], 'attribute');
  });
}

describe('api/prop', function () {
  describe('array', function () {
    let elem;

    beforeEach(function () {
      elem = create(prop.array());
    });

    it('default', function () {
      expect(elem.test).to.be.an('array');
      expect(elem.test.length).to.equal(0);
      expect(elem.getAttribute('test')).to.equal(null);
    });

    describe('coerce', function () {
      it('set array', function () {
        const arr = ['something'];
        elem.test = arr;
        expect(elem.test).to.equal(arr);
      });

      it('set non-array', function () {
        elem.test = 'something';
        expect(elem.test).to.be.an('array');
        expect(elem.test.length).to.equal(1);
        expect(elem.test[0]).to.equal('something');
      });
    });

    it('deserialize', function (done) {
      elem.setAttribute('test', '["val1","val2"]');
      afterMutations(
        () => expect(elem.test).to.be.an('array'),
        () => expect(elem.test).to.be.length(2),
        () => expect(elem.test[0]).to.equal('val1'),
        () => expect(elem.test[1]).to.equal('val2'),
        done
      );
    });

    it('serialize', function () {
      elem.test = ['val1', 'val2'];
      expect(elem.getAttribute('test')).to.be.a('string');
      expect(elem.getAttribute('test')).to.equal('["val1","val2"]');
    });
  });

  describe('boolean', function () {
    it('initial value', function () {
      const elem = create(prop.boolean());
      expect(elem.test).to.equal(false);
      expect(elem.getAttribute('test')).to.equal(null);
    });

    [undefined, null, false, 0, '', 'something'].forEach(function (value) {
      value = String(value);
      it('setting attribute to ' + value, function (done) {
        const elem = create(prop.boolean());
        elem.setAttribute('test', value);
        afterMutations(
          () => expect(elem.test).to.equal(true, 'property'),
          () => expect(elem.getAttribute('test')).to.equal(value, 'attribute'),
          done
        );
      });
      it('setting property to ' + value, function () {
        const elem = create(prop.boolean());
        elem.test = value;
        expect(elem.test).to.equal(!!value, 'property');
        expect(elem.getAttribute('test')).to.equal(value ? '' : null, 'attribute');
      });
    });

    it('removing attribute', function (done) {
      const elem = create(prop.boolean());
      afterMutations(
        () => elem.setAttribute('test', ''),
        () => expect(elem.test).to.equal(true),
        () => expect(elem.getAttribute('test')).to.equal(''),
        () => elem.removeAttribute('test'),
        () => expect(elem.test).to.equal(false),
        () => expect(elem.getAttribute('test')).to.equal(null),
        done
      );
    });
  });

  describe('number', function () {
    let elem;

    beforeEach(function () {
      elem = create(prop.number());
    });

    it('default', function () {
      expect(elem.test).to.be.a('number');
      expect(elem.test).to.equal(0);
      expect(elem.getAttribute('test')).to.equal(null);
    });

    it('values', function () {
      expect(elem.test).to.equal(0);
      expect(elem.getAttribute('test')).to.equal(null);
      testTypeValues('number', [
        [false, 0, '0'],
        [true, 1, '1'],
        [null, 0, null],
        [undefined, 0, null],
        [0.1, 0.1, '0.1'],
        ['test', undefined, null],
        ['', 0, '0']
      ]);
    });

    it('removing attribute', function (done) {
      afterMutations(
        () => elem.setAttribute('test', ''),
        () => expect(elem.test).to.equal(0),
        () => expect(elem.getAttribute('test')).to.equal(''),
        () => elem.removeAttribute('test'),
        () => expect(elem.test).to.equal(0),
        () => expect(elem.getAttribute('test')).to.equal(null),
        done
      );
    });
  });

  describe('string', function () {
    it('values', function () {
      const elem = create(prop.string());
      expect(elem.test).to.equal(undefined);
      expect(elem.getAttribute('test')).to.equal(null);
      testTypeValues('string', [
        [false, 'false', 'false'],
        [null, undefined, null],
        [undefined, undefined, null],
        [0, '0', '0'],
        ['', '', '']
      ]);
    });
  });

  describe('overriding', function () {
    it('boolean', function () {
      expect(prop.boolean({ default: true }).default).to.equal(true);
    });

    it('number', function () {
      expect(prop.number({ default: 1 }).default).to.equal(1);
    });

    it('string', function () {
      expect(prop.string({ default: 'test' }).default).to.equal('test');
    });
  });

  describe('property change event', function () {
    it('is not triggered when `opts.event` is not set', function () {
      const elem = create(prop.boolean());
      elem.test = false;

      let calls = 0;
      elem.addEventListener('propertychange', () => calls++);
      elem.test = true;

      expect(calls).to.equal(0);
    });

    it('the event name can be changed', function () {
      const elem = create(assign({ event: 'foo' }, prop.boolean()));
      elem.test = false;

      let propertyChangeCalled = false;
      let fooCalled = false;
      elem.addEventListener('propertychange', () => propertyChangeCalled = true);
      elem.addEventListener('foo', () => fooCalled = true);
      elem.test = true;

      expect(propertyChangeCalled).to.equal(false);
      expect(fooCalled).to.equal(true);
    });

    it('is triggered only when properties change', function () {
      const elem = create(assign({ event: 'propertychange' }, prop.boolean()));
      elem.test = false;

      let calls = 0;
      elem.addEventListener('propertychange', () => calls++);
      elem.test = true;

      expect(calls).to.equal(1);
      elem.test = true;
      expect(calls).to.equal(1);
      elem.test = false;
      expect(calls).to.equal(2);
    });

    it('does not bubble', function () {
      const elem = create(assign({ event: 'propertychange' }, prop.boolean()));
      elem.test = false;

      const parent = document.createElement('div');
      parent.appendChild(elem);

      let calls = 0;
      parent.addEventListener('propertychange', () => calls++);
      elem.test = true;

      expect(calls).to.equal(0);
    });

    it('can be cancelled', function () {
      const elem = create(assign({ event: 'propertychange' }, prop.boolean()));
      elem.test = false;
      elem.addEventListener('propertychange', e => e.preventDefault());
      elem.test = true;
      expect(elem.test).to.equal(false);
    });

    it('after cancelling events, subsequent sets pass through', function () {
      const elem = create(assign({ event: 'propertychange' }, prop.boolean()));

      function preventOnce () {
        let alreadyPrevented = false;
        return function (e) {
          if (!alreadyPrevented) {
            alreadyPrevented = true;
            e.preventDefault();
          }
        };
      }

      elem.addEventListener('propertychange', preventOnce());

      elem.test = true;
      expect(elem.test).to.equal(false, 'prevented');

      elem.test = true;
      expect(elem.test).to.equal(true, 'passed through');
    });

    it('contains property name, and change details', function () {
      const elem = create(assign({ event: 'propertychange' }, prop.boolean()));
      let event = null;

      elem.test = false;
      elem.addEventListener('propertychange', (e) => event = e);
      elem.test = true;

      expect(event.detail).to.be.an('object');
      expect(event.detail.name).to.equal('test');
      expect(event.detail.oldValue).to.equal(false);
      expect(event.detail.newValue).to.equal(true);
    });
  });
});
