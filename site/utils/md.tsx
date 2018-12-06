import { Layout } from '../components/layout';
import { Marked } from '../components/marked';
import { Component, h } from './component';

export function md(markdown: Function | string) {
  return class extends Component {
    static props = { props: Object };
    props: {};
    render() {
      const src =
        typeof markdown === 'function' ? markdown(this.props) : markdown;
      const lines = src.split('\n');

      let title;
      for (let a = 0; a < lines.length; a++) {
        const trimmedLine = lines[a].trim();
        if (trimmedLine.indexOf('# ') === 0) {
          title = trimmedLine.substring(2);
          lines.splice(a, 1);
          break;
        }
      }

      return (
        <Layout title={title}>
          <Marked src={lines.join('\n').trim()} />
        </Layout>
      );
    }
  };
}
