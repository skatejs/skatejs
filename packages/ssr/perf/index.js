function test(call) {
  setTimeout(() => {
    const t = performance.now();
    for (let a = 0; a < 10000; a++) document.body.appendChild(call(a));
    alert(Math.round(performance.now() - t) + 'ms');
  });
}
