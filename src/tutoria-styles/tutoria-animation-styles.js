import '../../node_modules/@polymer/polymer/lib/elements/custom-style.js';

export const duration = '200ms';
export const timingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)';

document.head.insertAdjacentHTML('beforeend', `
<custom-style>
<style>
html {
  --tutoria-animation_duration: ${duration};
  --tutoria-animation_timing-function: ${timingFunction};
}
</custom-style>
</style>
`);
