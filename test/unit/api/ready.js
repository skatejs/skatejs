import ready from '../../../src/api/ready';

describe('api/ready', function () {
  it('should call the callback when the document is ready', function (done) {
    ready(done);
  });
});
