import { component, style } from '../utils';

export default component(function notFound() {
  return this.$`
    ${style(this.context.style)}
    <h2>Not found!</h2>
    <p>The requested page couldn't be found.</p>
  `;
});
