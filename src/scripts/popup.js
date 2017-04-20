document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const selectionText = location.hash.slice(1);
    const wrapper = document.getElementById('wrapper');
    const loader = document.getElementById('loader');

    loader.addEventListener('transitionend', () => {
      loader.style.display = 'none';
    });
    const iframe = document.createElement('iframe');
    iframe.className = 'webview';
    iframe.src = `http://ejje.weblio.jp/small/content/${selectionText}`;
    iframe.setAttribute('sandbox', 'allow-forms');
    iframe.addEventListener('load', () => {
      loader.style.opacity = 0;
    });
    wrapper.appendChild(iframe);
  }, 0);
});
