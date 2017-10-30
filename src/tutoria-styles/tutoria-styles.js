import '../../node_modules/@polymer/polymer/lib/elements/custom-style.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-styles/color.js';

const styleString = `
<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/earlyaccess/notosanstc.css">

<custom-style>
<style>
html {

/* --namespace-component__sub-component--modifier_property */
  
/*
 * Typography
 */
--tutoria-text_font-family: 'Noto Sans TC', sans-serif;

--tutoria-text--common_font: {
  font-family: var(--tutoria-text_font-family);
};

--tutoria-text--display4_font: {
  @apply --paper-font-display4;
  @apply --tutoria-text--common_font;
};

--tutoria-text--display3_font: {
  @apply --paper-font-display3;
  @apply --tutoria-text--common_font;
};

--tutoria-text--display2_font: {
  @apply --paper-font-display2;
  @apply --tutoria-text--common_font;
};

--tutoria-text--display1_font: {
  @apply --paper-font-display1;
  @apply --tutoria-text--common_font;
};

--tutoria-text--headline_font: {
  @apply --paper-font-headline;
  @apply --tutoria-text--common_font;
};

--tutoria-text--title_font: {
  @apply --paper-font-title;
  @apply --tutoria-text--common_font;
};

--tutoria-text--subheading_font: {
  @apply --paper-font-subhead;
  @apply --tutoria-text--common_font;
};

--tutoria-text--body2_font: {
  @apply --paper-font-body2;
  @apply --tutoria-text--common_font;
};

--tutoria-text--body1_font: {
  @apply --paper-font-body1;
  @apply --tutoria-text--common_font;
};

--tutoria-text--caption_font: {
  @apply --paper-font-caption;
  @apply --tutoria-text--common_font;
};

--tutoria-text--menu_font: {
  @apply --paper-font-menu;
  @apply --tutoria-text--common_font;
};

--tutoria-text--button_font: {
  @apply --paper-font-button;
  @apply --tutoria-text--common_font;
};

/*
 * Theme & Color
 */
/* Light theme */
--tutoria-background--light-theme--primary_color_r: 255; /* white */
--tutoria-background--light-theme--primary_color_g: 255;
--tutoria-background--light-theme--primary_color_b: 255;
--tutoria-background--light-theme--primary_color: rgb(var(--tutoria-background--light-theme--primary_color_r),
                                                      var(--tutoria-background--light-theme--primary_color_g),
                                                      var(--tutoria-background--light-theme--primary_color_b));

--tutoria-background--light-theme--secondary_color_r: 250; /* --paper-grey-50 */
--tutoria-background--light-theme--secondary_color_g: 250;
--tutoria-background--light-theme--secondary_color_b: 250;
--tutoria-background--light-theme--secondary_color: rgb(var(--tutoria-background--light-theme--secondary_color_r),
                                                        var(--tutoria-background--light-theme--secondary_color_g),
                                                        var(--tutoria-background--light-theme--secondary_color_b));

--tutoria-text--light-theme--base_color_r: 0;
--tutoria-text--light-theme--base_color_g: 0;
--tutoria-text--light-theme--base_color_b: 0;
--tutoria-text--light-theme--base_color: rgb(var(--tutoria-text--light-theme--base_color_r),
                                             var(--tutoria-text--light-theme--base_color_g),
                                             var(--tutoria-text--light-theme--base_color_b));

--tutoria-text--light-theme--primary_opacity: var(--light-primary-opacity);
--tutoria-text--light-theme--primary_color: rgba(var(--tutoria-text--light-theme--base_color_r),
                                                 var(--tutoria-text--light-theme--base_color_g),
                                                 var(--tutoria-text--light-theme--base_color_b),
                                                 var(--tutoria-text--light-theme--primary_opacity));

--tutoria-text--light-theme--secondary_opacity: var(--light-secondary-opacity);
--tutoria-text--light-theme--secondary_color: rgba(var(--tutoria-text--light-theme--base_color_r),
                                                   var(--tutoria-text--light-theme--base_color_g),
                                                   var(--tutoria-text--light-theme--base_color_b),
                                                   var(--tutoria-text--light-theme--secondary_opacity));  /* for secondary text and icons */

--tutoria-text--light-theme--disabled_opacity: var(--light-disabled-opacity);
--tutoria-text--light-theme--disabled_color: rgba(var(--tutoria-text--light-theme--base_color_r),
                                                  var(--tutoria-text--light-theme--base_color_g),
                                                  var(--tutoria-text--light-theme--base_color_b),
                                                  var(--tutoria-text--light-theme--disabled_opacity));  /* disabled/hint text */

--tutoria-divider--light-theme_opacity: var(--light-divider-opacity);
--tutoria-divider--light-theme_color: rgba(var(--tutoria-text--light-theme--base_color_r),
                                           var(--tutoria-text--light-theme--base_color_g),
                                           var(--tutoria-text--light-theme--base_color_b),
                                           var(--tutoria-divider--light-theme_opacity));

/* Dark theme */

--tutoria-background--dark-theme--primary_color_r: 66; /* --paper-grep-800 */
--tutoria-background--dark-theme--primary_color_g: 66;
--tutoria-background--dark-theme--primary_color_b: 66;
--tutoria-background--dark-theme--primary_color: rgb(var(--tutoria-background--dark-theme--primary_color_r),
                                                     var(--tutoria-background--dark-theme--primary_color_g),
                                                     var(--tutoria-background--dark-theme--primary_color_b));

--tutoria-background--dark-theme--secondary_color_r: 48; /* #303030 */
--tutoria-background--dark-theme--secondary_color_g: 48;
--tutoria-background--dark-theme--secondary_color_b: 48;
--tutoria-background--dark-theme--secondary_color: rgb(var(--tutoria-background--dark-theme--secondary_color_r),
                                                       var(--tutoria-background--dark-theme--secondary_color_g),
                                                       var(--tutoria-background--dark-theme--secondary_color_b));

--tutoria-text--dark-theme--base_color_r: 255;
--tutoria-text--dark-theme--base_color_g: 255;
--tutoria-text--dark-theme--base_color_b: 255;
--tutoria-text--dark-theme--base_color: rgb(var(--tutoria-text--dark-theme--base_color_r),
                                            var(--tutoria-text--dark-theme--base_color_g),
                                            var(--tutoria-text--dark-theme--base_color_b));

--tutoria-text--dark-theme--primary_opacity: var(--dark-primary-opacity);
--tutoria-text--dark-theme--primary_color: rgba(var(--tutoria-text--dark-theme--base_color_r),
                                                var(--tutoria-text--dark-theme--base_color_g),
                                                var(--tutoria-text--dark-theme--base_color_b),
                                                var(--tutoria-text--dark-theme--primary_opacity));

--tutoria-text--dark-theme--secondary_opacity: var(--dark-secondary-opacity);
--tutoria-text--dark-theme--secondary_color: rgba(var(--tutoria-text--dark-theme--base_color_r),
                                                  var(--tutoria-text--dark-theme--base_color_g),
                                                  var(--tutoria-text--dark-theme--base_color_b),
                                                  var(--tutoria-text--dark-theme--secondary_opacity));  /* for secondary text and icons */

--tutoria-text--dark-theme--disabled_opacity: var(--dark-disabled-opacity);
--tutoria-text--dark-theme--disabled_color: rgba(var(--tutoria-text--dark-theme--base_color_r),
                                                 var(--tutoria-text--dark-theme--base_color_g),
                                                 var(--tutoria-text--dark-theme--base_color_b),
                                                 var(--tutoria-text--dark-theme--disabled_opacity));  /* disabled/hint text */

--tutoria-divider--dark-theme_opacity: var(--dark-divider-opacity);
--tutoria-divider--dark-theme_color: rgba(var(--tutoria-text--dark-theme--base_color_r),
                                          var(--tutoria-text--dark-theme--base_color_g),
                                          var(--tutoria-text--dark-theme--base_color_b),
                                          var(--tutoria-divider--dark-theme_opacity));

/* Current theme */
/*--tutoria-theme--light: {*/
  --tutoria-background--primary_color_r: var(--tutoria-background--light-theme--primary_color_r);
  --tutoria-background--primary_color_g: var(--tutoria-background--light-theme--primary_color_g);
  --tutoria-background--primary_color_b: var(--tutoria-background--light-theme--primary_color_b);
  --tutoria-background--primary_color: var(--tutoria-background--light-theme--primary_color);

  --tutoria-background--secondary_color_r: var(--tutoria-background--light-theme--secondary_color_r);
  --tutoria-background--secondary_color_g: var(--tutoria-background--light-theme--secondary_color_g);
  --tutoria-background--secondary_color_b: var(--tutoria-background--light-theme--secondary_color_b);
  --tutoria-background--secondary_color: var(--tutoria-background--light-theme--secondary_color);

  --tutoria-text--base_color_r: var(--tutoria-text--light-theme--base_color_r);
  --tutoria-text--base_color_g: var(--tutoria-text--light-theme--base_color_g);
  --tutoria-text--base_color_b: var(--tutoria-text--light-theme--base_color_b);
  --tutoria-text--base_color: var(--tutoria-text--light-theme--base_color);
  
  --tutoria-text--primary_opacity: var(--tutoria-text--light-theme--primary_opacity);
  --tutoria-text--primary_color: var(--tutoria-text--light-theme--primary_color);
  
  --tutoria-text--secondary_opacity: var(--tutoria-text--light-theme--secondary_opacity);
  --tutoria-text--secondary_color: var(--tutoria-text--light-theme--secondary_color);
  
  --tutoria-text--disabled_opacity: var(--tutoria-text--light-theme--disabled_opacity);
  --tutoria-text--disabled_color: var(--tutoria-text--light-theme--disabled_color);
  
  --tutoria-divider_opacity: var(--tutoria-divider--light-theme_opacity);
  --tutoria-divider_color: var(--tutoria-divider--light-theme_color);
/*};*/
/* --tutoria-theme--dark: {
  --tutoria-background--primary_color_r: var(--tutoria-background--dark-theme--primary_color_r);
  --tutoria-background--primary_color_g: var(--tutoria-background--dark-theme--primary_color_g);
  --tutoria-background--primary_color_b: var(--tutoria-background--dark-theme--primary_color_b);
  --tutoria-background--primary_color: var(--tutoria-background--dark-theme--primary_color);

  --tutoria-background--secondary_color_r: var(--tutoria-background--dark-theme--secondary_color_r);
  --tutoria-background--secondary_color_g: var(--tutoria-background--dark-theme--secondary_color_g);
  --tutoria-background--secondary_color_b: var(--tutoria-background--dark-theme--secondary_color_b);
  --tutoria-background--secondary_color: var(--tutoria-background--dark-theme--secondary_color);

  --tutoria-text--base_color_r: var(--tutoria-text--dark-theme--base_color_r);
  --tutoria-text--base_color_g: var(--tutoria-text--dark-theme--base_color_g);
  --tutoria-text--base_color_b: var(--tutoria-text--dark-theme--base_color_b);
  --tutoria-text--base_color: var(--tutoria-text--dark-theme--base_color);
  
  --tutoria-text--primary_opacity: var(--tutoria-text--dark-theme--primary_opacity);
  --tutoria-text--primary_color: var(--tutoria-text--dark-theme--primary_color);
  
  --tutoria-text--secondary_opacity: var(--tutoria-text--dark-theme--secondary_opacity);
  --tutoria-text--secondary_color: var(--tutoria-text--dark-theme--secondary_color);
  
  --tutoria-text--disabled_opacity: var(--tutoria-text--dark-theme--disabled_opacity);
  --tutoria-text--disabled_color: var(--tutoria-text--dark-theme--disabled_color);
  
  --tutoria-divider_opacity: var(--tutoria-divider--dark-theme_opacity);
  --tutoria-divider_color: var(--tutoria-divider--light-theme_color);
};
@apply --tutoria-theme--dark; */

/* app-theme */
--tutoria-accent_color_r: 63; /* --paper-indigo-500 */
--tutoria-accent_color_g: 81;
--tutoria-accent_color_b: 181;
--tutoria-accent_color: rgb(var(--tutoria-accent_color_r),
                            var(--tutoria-accent_color_g),
                            var(--tutoria-accent_color_b));

--tutoria-background--app-theme--primary_color_r: var(--tutoria-accent_color_r);
--tutoria-background--app-theme--primary_color_g: var(--tutoria-accent_color_g);
--tutoria-background--app-theme--primary_color_b: var(--tutoria-accent_color_b);
--tutoria-background--app-theme--primary_color: var(--tutoria-accent_color);

--tutoria-text--app-theme--base_color_r: 255;
--tutoria-text--app-theme--base_color_g: 255;
--tutoria-text--app-theme--base_color_b: 255;
--tutoria-text--app-theme--base_color: rgb(var(--tutoria-text--app-theme--base_color_r),
                                           var(--tutoria-text--app-theme--base_color_g),
                                           var(--tutoria-text--app-theme--base_color_b));

--tutoria-text--app-theme--primary_opacity: 1;
--tutoria-text--app-theme--primary_color: rgba(var(--tutoria-text--app-theme--base_color_r),
                                               var(--tutoria-text--app-theme--base_color_g),
                                               var(--tutoria-text--app-theme--base_color_b),
                                               var(--tutoria-text--app-theme--primary_opacity));

--tutoria-text--app-theme--secondary_opacity: 0.87;
--tutoria-text--app-theme--secondary_color: rgba(var(--tutoria-text--app-theme--base_color_r),
                                                 var(--tutoria-text--app-theme--base_color_g),
                                                 var(--tutoria-text--app-theme--base_color_b),
                                                 var(--tutoria-text--app-theme--secondary_opacity));

/*
 * Shadow
 */
--tutoria-shadow--elevation-0_box-shadow: none;

--tutoria-shadow--elevation-1_box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                                          0 1px 5px 0 rgba(0, 0, 0, 0.12),
                                          0 3px 1px -2px rgba(0, 0, 0, 0.2);

--tutoria-shadow--elevation-2_box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14),
                                          0 1px 8px 0 rgba(0, 0, 0, 0.12),
                                          0 3px 3px -2px rgba(0, 0, 0, 0.4);

--tutoria-shadow--elevation-3_box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                                          0 1px 10px 0 rgba(0, 0, 0, 0.12),
                                          0 2px 4px -1px rgba(0, 0, 0, 0.4);

--tutoria-shadow--elevation-4_box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
                                          0 1px 18px 0 rgba(0, 0, 0, 0.12),
                                          0 3px 5px -1px rgba(0, 0, 0, 0.4);

--tutoria-shadow--elevation-5_box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
                                          0 3px 14px 2px rgba(0, 0, 0, 0.12),
                                          0 5px 5px -3px rgba(0, 0, 0, 0.4);

--tutoria-shadow--elevation-6_box-shadow: 0 12px 16px 1px rgba(0, 0, 0, 0.14),
                                          0 4px 22px 3px rgba(0, 0, 0, 0.12),
                                          0 6px 7px -4px rgba(0, 0, 0, 0.4);

--tutoria-shadow--elevation-7_box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
                                          0  6px 30px 5px rgba(0, 0, 0, 0.12),
                                          0  8px 10px -5px rgba(0, 0, 0, 0.4);
                                           
--tutoria-shadow--elevation-8_box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
                                          0 9px 46px 8px rgba(0, 0, 0, 0.12),
                                          0 11px 15px -7px rgba(0, 0, 0, 0.4);

--tutoria-shadow--elevation-0: {
  box-shadow: var(--tutoria-shadow--elevation-0_box-shadow);
};

--tutoria-shadow--elevation-1: {
  box-shadow: var(--tutoria-shadow--elevation-1_box-shadow);
};

--tutoria-shadow--elevation-2: {
  box-shadow: var(--tutoria-shadow--elevation-2_box-shadow);
};

--tutoria-shadow--elevation-3: {
  box-shadow: var(--tutoria-shadow--elevation-3_box-shadow);
};

--tutoria-shadow--elevation-4: {
  box-shadow: var(--tutoria-shadow--elevation-4_box-shadow);
};

--tutoria-shadow--elevation-5: {
  box-shadow: var(--tutoria-shadow--elevation-5_box-shadow);
};

--tutoria-shadow--elevation-6: {
  box-shadow: var(--tutoria-shadow--elevation-6_box-shadow);
};

--tutoria-shadow--elevation-7: {
  box-shadow: var(--tutoria-shadow--elevation-7_box-shadow);
};

--tutoria-shadow--elevation-8: {
  box-shadow: var(--tutoria-shadow--elevation-8_box-shadow);
};

--tutoria-shadow_transition-duration: 0.28s; /* extract from --shadow-transition */
--tutoria-shadow_transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
--tutoria-shadow_transition: box-shadow var(--tutoria-shadow_transition-duration) var(--tutoria-shadow_transition-timing-function);

}



body {
  background-color: var(--tutoria-background--primary_color);
}

</style>
<custom-style>
`;

document.head.insertAdjacentHTML('beforeend', styleString);
