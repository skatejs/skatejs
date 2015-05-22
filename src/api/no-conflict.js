var previousSkate = window.skate;
export default function () {
  window.skate = previousSkate;
  return this;
}
