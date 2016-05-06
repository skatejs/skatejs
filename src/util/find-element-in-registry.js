import customElements from '../native/custom-elements';

export default function (elem) {
  const tagName = elem.tagName;

  if (!tagName) {
    return;
  }

  const tagNameLc = tagName.toLowerCase();
  const tagNameDefinition = customElements.get(tagNameLc);

  if (tagNameDefinition) {
    return tagNameDefinition;
  }

  const isAttribute = elem.getAttribute('is');
  const isAttributeDefinition = customElements.get(isAttribute);

  if (isAttributeDefinition && isAttributeDefinition.extends === tagNameLc) {
    return isAttributeDefinition;
  }
}
