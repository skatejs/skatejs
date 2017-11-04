import { Link as SkLink } from '@skatejs/sk-router';
import { component, h } from '../utils';

export const Hr = component(function hr() {
  return (
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
  );
});

export const Link = component(
  function link(css, href) {
    return (
      <SkLink.is css={this.context.style + css} href={href}>
        <slot />
      </SkLink.is>
    );
  },
  ['css', 'href']
);

export const Note = component(function note() {
  return (
    <em>
      <style>{`
        em {
          background-color: #DCE4CA;
          border-left: 3px solid #c6d3a8;
          display: block;
          margin: 20px 0;
          padding: 10px 15px;
        }
      `}</style>
      <slot />
    </em>
  );
});
