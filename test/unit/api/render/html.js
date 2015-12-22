import html from '../../../../src/api/render/html';

describe('api/render/html', function () {
  it('should render hmlt to an element', function () {
    const elem = document.createElement('div');
    html(() => 'test')(elem);
    expect(elem.innerHTML).to.equal('test');
  });
  
  it('innerHTML should be available inside the render function', function () {
    const elem = document.createElement('div');
    elem.innerHTML = 'test';
    html(elem => `${elem.innerHTML}!`)(elem);
    expect(elem.innerHTML).to.equal('test!');
  });
});