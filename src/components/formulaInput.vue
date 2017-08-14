<template>
<div>
  <button class="btn btn-default formula_button" v-for="formula in formula_list" v-on:click="getValue(formula)">\[{{formula}}\]</button>
</div>
</template>

<script>
export default {
  name: 'formulaInput',
  data () {
    return {
      formula_list: ['\\sum\\limits_{i=1}^{n}', 'x_{i}', 'x^{i}', '\\int', '\\cap', '\\cup', '\\vee', '\\wedge', '\\odot', '\\oplus', '\\uplus', '\\sqrt{abc}', '\\sqrt[n]{abc}', 'f\'', '\\frac{abc}{xyz}', '\\mathrm{T}']
    }
  },
  methods: {
    getValue: function (latex) {
      this.$emit('laTexValue', latex)
    }
  }
}
</script>

<style scoped="scoped">
.formula_button{
  float: left;
  display: block;
  width: 60px;
  height: 80px;
}
</style>