# `withRender (Base = withProps())`

The `withRender` mixins adds render lifecycle callbacks so that you have things like post-render hooks and can create custom renderers.

## Custom renderers

We use Preact undert the hood, by default, in the `Component` base class, but we're not doing much more than something like this:

```js
import { render } from 'preact';
import { withRender } from 'skatejs';

class MyComponent extends withRender() {
  rendererCallback (renderCallbackResult) {
    return render(renderCallbackResult, this.shadowRoot);
  }
}
```

You could then extend that and implement only a `renderCallback()` to render your component using Preact:

```js
/** @jsx h **/

import { h } from 'preact';
import MyComponent from './my-component';

class Test extends MyComponent {
  renderCallback () {
    return <div />;
  }
}
```

## connectedCallback ()

The `connectedCallback()` is overridden so that the component can render when it is connected to the DOM. If you override this, you should make sure that you call it back.

## renderCallback (props)

The callback that returns the content that the `rendererCallback()` should render.

## rendererCallback (renderCallbackResult)

The callback that renders the result of the `renderCallback()`.

## renderedCallback ()

Called after the component has completed rendering.
