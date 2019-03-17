<template>
  <div id="app" class="bg-grey-lightest p-4">
    <h1 class="mb-2 lh-title text-grey-darkest">JSONtoCSS</h1>
    <div class="mb-4">
      This is a simple application to convert the JSON export from
      <a href="https://palettte.app" target="_blank">Palettte App</a> in
      Tailwind utility style CSS.
    </div>
    <div class="mb-2">
      <textarea
        v-model="code"
        class="border h-64 rounded text-sm w-full"
        name="code"
        id="code"
      >
      </textarea>
    </div>
    <div class="mb-6 text-right">
      <button
        class="border-blue border hover:bg-blue rounded text-blue hover:text-white p-3"
        type="button"
        @click="generateCss"
      >
        Convert
      </button>
    </div>
    <div>
      <pre class="bg-grey-lighter border h-64 overflow-auto p-4 rounded shadow-inner text-sm w-full">
        {{ convertedCss }} 
      </pre>
    </div>
    <div class="text-red-dark">{{ errors }}</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      code: '',
      convertedCss: '',
      errors: '',
      parsedCode: '',
    };
  },
  methods: {
    generateCss() {
      this.errors = '';

      try {
        this.parsedCode = JSON.parse(this.code);

        if (!Array.isArray(this.parsedCode)) {
          throw 'Must be a valid JSON array.';
        }

        this.convertedCss = this.parsedCode.reduce((carry, value, key) => {
          if (!value.paletteName || !value.swatches) {
            return carry;
          }

          const colorName = value.paletteName;

          carry += '\n';
          carry += `
/* ${colorName} */
`;

          const swatches = value.swatches.reduce(this.parseSwatches, '');

          carry += swatches;

          return carry;
        }, '');
      } catch (errors) {
        this.errors = errors;
        return '';
      }
    },

    /**
     * Generate CSS classes from the color swatches for color, background-color
     * and border color.
     */
    parseSwatches(carry, value, key) {
      const { name, color } = value;

      carry += `
.${name} {
  color: #${color};
}
`;
      carry += `
.bg-${name} {
  background-color: #${color};
}
`;

      carry += `
.border-${name} {
  border-color: #${color};
}
`;
      return carry;
    },
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
