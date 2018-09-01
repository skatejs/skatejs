import { Layout } from '../components/layout';
import { Marked } from '../components/marked';
import { Component, h } from './component';

export default function(title) {
  return function(parts: TemplateStringsArray, ...replacements: Array<any>) {
    const src = parts.reduce((prev, curr, indx) => {
      return prev + curr + (replacements ? replacements[indx] : '');
    }, '');
    return render(title, src);
  };
}

export function render(title, src) {
  return class extends Component {
    render() {
      return (
        <Layout title={title}>
          <Marked src={src} />
        </Layout>
      );
    }
  };
}
