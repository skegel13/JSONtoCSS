<template>
  <div id="app" class="bg-grey-lightest h-full p-4">
    <h1 class="mb-2 lh-title text-grey-darkest">JSONtoCSS</h1>
    <div class="mb-4">
      This is a simple application to convert the JSON export from the
      <a href="https://palettte.app" target="_blank">Palettte App</a> to
      Tailwind utility style CSS.
    </div>
    <div class="mb-2">
      <label
        class="font-semibold text-grey-darker text-xs tracking-wide uppercase"
        for="code"
      >
        Paste JSON Code
      </label>
      <textarea
        v-model="code"
        id="code"
        class="border h-64 p-4 rounded text-sm w-full"
        name="code"
      >
      </textarea>
      <div class="font-semibold mb4 mt1 text-red-dark text-xs">
        {{ errors }}
      </div>
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
    <div v-if="convertedCss">
      <div
        class="font-semibold text-grey-darker text-xs tracking-wide uppercase"
        for="code"
      >
        Output
      </div>
      <div class="relative">
        <pre class="bg-grey-lighter border h-64 overflow-auto p-4 rounded shadow-inner text-sm w-full"
        @click="copyOutput"
             >
          {{ convertedCss }}
        </pre>
        <button
          class="absolute bg-blue-lightest hover:bg-blue-lighter border mr-5 mt-2 px-2 py-1 pin-r pin-t rounded text-blue-dark text-xs"
          type="button"
          @click="copyOutput"
        >
          Click to Copy
        </button>
      </div>
    </div>
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
    copyOutput() {
      this.$clipboard(this.convertedCss);
    },
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
      const { color } = value;
      let { name = 'name' } = value;
      name = name.replace(' ', '').trim();

      carry += `
.bg-${name},
.hover\\:bg-${name}:hover,
.focus\\:bg-${name}:focus {
  background-color: #${color};
}
`;

      carry += `
.border-${name},
.hover\\:border-${name}:hover,
.focus\\:border-${name}:focus {
  border-color: #${color};
}
`;
      carry += `
.text-${name},
.hover\\:text-${name}:hover,
.focus\\:text-${name}:focus {
  color: #${color};
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
