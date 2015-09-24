import property from '../../../src/api/property';
import propertiesCreated from '../../../src/lifecycle/properties-created';
import propertiesReady from '../../../src/lifecycle/properties-ready';

describe('api/property', function () {
  it('should accept zero arguments', function () {
    property();
  });

  it('should return an function', function () {
    expect(property()).to.be.a('function');
  });

  describe('native property definition', function () {
    it('should define a getter', function () {
      expect(property()().get).to.be.a('function');
    });

    it('should define a setter', function () {
      expect(property()().set).to.be.a('function');
    });

    it('should be enumerable', function () {
      expect(property()().enumerable).to.equal(true);
    });

    it('should be configurable', function () {
      expect(property()().configurable).to.equal(true);
    });

    it('should not contain a value', function () {
      expect(property()().value).to.equal(undefined);
    });
  });

  describe('custom property definition', function () {
    it('should define a created() callback', function () {
      expect(property()().created).to.be.a('function');
    });

    it('should define a ready() callback', function () {
      expect(property()().ready).to.be.a('function');
    });
  });

  describe('api', function () {
    function create (definition) {
      let elem = document.createElement('div');
      let prop = { test: property(definition)('test') };
      propertiesCreated(elem, prop);
      propertiesReady(elem, prop);
      return elem;
    }

    describe('attr', function () {
      it('when true, links an attribute of the name (dash-cased)', function () {
        let elem = create({ attr: true });
        elem.test = 'something';
        expect(elem.getAttribute('test')).to.equal('something');
      });

      it('when a string, the value is used as the attribute name', function () {
        let elem = create({ attr: 'some-attr' });
        elem.test = 'something';
        expect(elem.getAttribute('some-attr')).to.equal('something');
      });
    });

    describe('emit', function () {
      it('when true, emits a skate.property event', function (done) {
        let elem = create({ emit: true });
        elem.addEventListener('skate.property', () => done());
        elem.test = true;
      });

      it('when a string, the value is used as the attribute name', function (done) {
        let elem = create({ emit: 'some.prop.event' });
        elem.addEventListener('some.prop.event', () => done());
        elem.test = true;
      });

      it('when an array, the values are the events that are emitted', function (done) {
        let elem = create({ emit: ['some.prop.event'] });
        elem.addEventListener('some.prop.event', () => done());
        elem.test = true;
      });
    });

    describe('init', function () {
      it('when a function, returns the initial value that the property should be initialised with', function () {
        let elem = create({ init: () => 'something' });
        expect(elem.test).to.equal('something');
      });

      it('when anything else, it is the initial value that the property should be initialised with', function () {
        let elem = create({ init: 'something' });
        expect(elem.test).to.equal('something');
      });

      it('context and arguments', function (done) {
        let opts = {
          init () {
            expect(this).to.equal(opts);
            expect(arguments.length).to.equal(0);
            done();
          }
        };
        create(opts);
      });
    });

    describe('type', function () {
      it('should return the value that the property will be set to', function () {
        let elem = create({ type: Boolean });
        elem.test = 'something';
        expect(elem.test).to.equal(true);
      });

      it('context and arguments', function (done) {
        let opts = {
          type (value) {
            expect(this).to.equal(opts);
            expect(arguments.length).to.equal(1);
            expect(value).to.equal(undefined);
            done();
          }
        };
        create(opts);
      });
    });

    describe('update()', function () {
      it('is called when the property is initialised', function (done) {
        create({ update: () => done() });
      });

      it('is called when the property is updated', function () {
        let calls = 0;
        let elem = create({ update: () => ++calls });
        elem.test = true;
        expect(calls).to.equal(2);
      });

      it('is not called if the property is set to the same value that it already is', function () {
        let calls = 0;
        let elem = create({ update: () => ++calls });
        elem.test = true;
        elem.test = true;
        expect(calls).to.equal(2);
      });

      it('context and arguments', function (done) {
        let opts = {
          update (elem, data) {
            expect(this).to.equal(opts);
            expect(arguments.length).to.equal(2);
            expect(elem.tagName).to.equal('DIV');
            expect(data).to.contain({
              name: 'test',
              newValue: undefined,
              oldValue: undefined
            });
            done();
          }
        };
        create(opts);
      });
    });
  });
});
