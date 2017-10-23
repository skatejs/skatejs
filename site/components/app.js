import { component, h } from '../utils';
import { Router, Route } from '@skatejs/sk-router';
import logo from '../img/logo.png';

export default component(() => (
  <div class="outer">
    <style>{`
      .outer {
        border-top: 5px solid #F2567C;
        padding: 25px;
      }
      .inner {
        max-width: 800px;
        margin: 0 auto;
      }
      .hero {
        margin: 50px 0;
        text-align: center;
      }
      .title {
        margin-bottom: 30px;
      }
      h1 {
        font-size: 2.5em;
        font-weight: normal;
      }
      h2 {
        font-weight: lighter;
      }
    `}</style>
    <div class="inner">
      <div class="hero">
        <img height={100} src={logo} />
        <h1 class="title">SkateJS</h1>
        <h2>Effortless custom elements for modern view libraries.</h2>
      </div>
      <Router.is>
        <Route.is page={() => import('../pages')} path="/" />
        <Route.is page={() => import('../pages/mixins')} path="/mixins" />
      </Router.is>
    </div>
  </div>
));
