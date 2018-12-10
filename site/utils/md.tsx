import { Layout } from '../components/layout';
import { Marked } from '../components/marked';
import { Component, h } from './component';

export function md(markdown: Function | string) {
  return class extends Component {
    static props = { props: Object };
    props: {};
    render() {
      let src = '';
      src = typeof markdown === 'function' ? markdown(this.props) : markdown;
      src = src.replace(/^\s*\n+/, '');
      const lines = src.split('\n');
      const indent = lines[0].match(/^(\s*)/)[1].length;

      let title;
      let formattedLines = [];
      for (let a = 0; a < lines.length; a++) {
        const trimmedLine = lines[a].substring(indent - 1);
        if (trimmedLine.indexOf('# ') === 0) {
          title = trimmedLine.substring(2);
        } else {
          formattedLines.push(lines[a]);
        }
      }

      return (
        <Layout title={title}>
          <Marked src={formattedLines.join('\n')} />
        </Layout>
      );
    }
  };
}
