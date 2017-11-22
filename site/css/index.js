import css from 'yocss';

export default css({
  '* a': {
    color: '#F2567C',
    textDecoration: 'none'
  },
  '* code': {
    backgroundColor: '#dce4c9',
    display: 'inline-block',
    fontFamily: 'monaco',
    fontSize: '.8em',
    padding: '0 8px'
  },
  '* h1': {
    fontSize: '2.5em',
    fontWeight: 'normal'
  },
  '* h2': {
    fontSize: '1.8em',
    fontWeight: 'lighter',
    lineHeight: '1.2em',
    margin: '60px 0 30px 0'
  },
  '* h3': {
    fontSize: '1.4em',
    fontWeight: 'lighter',
    margin: '50px 0 25px 0'
  },
  '* h4': {
    fontSize: '1.3em',
    fontWeight: 'lighter',
    margin: '40px 0 20px 0'
  },
  '* .logo': {
    display: 'block',
    margin: '0 auto'
  }
});
