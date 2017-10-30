import '../../node_modules/@polymer/polymer/lib/elements/custom-style.js';

const styles = `
<custom-style>
<style>
html {
  --tutoria-toolbar--normal_height: 64px;
  --tutoria-toolbar--short_height: 48px;
  
  --tutoria-toolbar_height-transition-duration: 200ms;
  --tutoria-toolbar_height-transition-timing-function: ease-out;
  
  --tutoria-toolbar_hide-toggling-duration: 200ms;
  --tutoria-toolbar_hide-toggling-timing-function: ease-out;



  --tutoria-toolbar__search-input--normal_margin: 8px;
  --tutoria-toolbar__search-input--short_margin: 4px;
}
</style>
</custom-style>
`;
document.head.insertAdjacentHTML('beforeend', styles);
