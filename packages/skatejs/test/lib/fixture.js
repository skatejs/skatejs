module.exports = function(html, tagName) {
  var fixture = document.body;

  if (arguments.length) {
    if (typeof html === 'string') {
      if (typeof tagName !== 'undefined') {
        var openTagRegex = new RegExp('<' + tagName.unsafe + '\\b', 'g');
        var closeTagRegex = new RegExp('</' + tagName.unsafe + '>', 'g');

        html = html
          .replace(openTagRegex, '<' + tagName.safe)
          .replace(closeTagRegex, '</' + tagName.safe + '>');
      }

      fixture.innerHTML = html;
    } else if (typeof html === 'object') {
      fixture.innerHTML = '';
      fixture.appendChild(html);
    }
  }

  return fixture;
};
