import { component, h } from '../utils';

export const Hr = component(() => (
  <div class="hr">
    <style>{`
      .hr {
        letter-spacing: 10px;
        margin: 50px 0;
        text-align: center;
      }
    `}</style>
    &mdash;&mdash;&mdash;
  </div>
));
