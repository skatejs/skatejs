export default function(el) {
  el.addEventListener('click', function(e) {
    window.open(el.getAttribute('href'));
    e.preventDefault();
  });
};
