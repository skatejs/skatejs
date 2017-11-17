import { component, h } from '../utils';

export default component(function notFound() {
  return (
    <div>
      <style>{this.context.style}</style>
      <h2>Not found!</h2>
      <p>The requested page couldn't be found.</p>
    </div>
  );
});
