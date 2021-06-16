import Vue from "vue";

Vue.mixin({
  methods: {
    srcSvg(iconName) {
      const src = require(`assets/icons/${iconName}.svg?raw`);
      return src;
    }
  }
});
