<template>
  <button @click="onClick" class="button">
    <slot />
  </button>
</template>

<script>
export default {
  name: "VButton",
  props: {
    color: String,
  },
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button {
  color: #fff;
  background-color: #eb6100;
  border-bottom: 5px solid #b84c00;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  padding: 8px;
  border-radius: 4px;
}
.button:active {
  margin-top: 3px;
  color: #fff;
  background: #f56500;
  border-bottom: 2px solid #b84c00;
}
</style>