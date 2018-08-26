import { Layout } from '../components/layout';
import { Marked } from '../components/marked';
import { Component, h } from './component';

export default function(parts, replacements) {
  const src = parts.reduce((prev, curr, indx) => {
    return prev + curr + replacements[indx];
  }, '');
  return class extends Component {
    render() {
      return (
        <Layout title="Getting started">
          <Marked src={src} />
        </Layout>
      );
    }
  };
}
