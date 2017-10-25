import { Link as SkLink } from '@skatejs/sk-router';
import { component, h } from '../utils';
import logoSrc from '../img/logo.png';

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

export const Link = component(function link(href) {
  return (
    <SkLink.is css={this.context.style} href={href}>
      <slot />
    </SkLink.is>
  );
});
