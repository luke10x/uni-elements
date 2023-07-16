<template>
  <div>
    <h1>Counter App</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
    <ce-droplist>
      <option value="Internet Explorer">Internet Explorer</option>
      <option value="Chrome">Chrome</option>
      <option value="Safari">Safari</option>
      <option value="Microsoft Edge">Microsoft Edge</option>
      <option value="Firefox">Firefox</option>
      <option value="Opera">Opera</option>
      <option value="Mozilla">Mozilla</option>
      <option value="Vivaldi">Vivaldi</option>
      <option value="Brave">Brave</option>
    </ce-droplist>
  </div>
</template>

<script>
  import { ref } from 'vue';

  export default {
    name: 'Counter',
    setup() {
      const count = ref(0);

      const increment = () => {
        count.value++;
      };

      const decrement = () => {
        count.value--;
      };

      return {
        count,
        increment,
        decrement
      };
    }
  };
</script>

<style scoped>
  h1 {
    font-size: 24px;
  }
  p {
    font-size: 18px;
    margin-bottom: 16px;
  }
  button {
    font-size: 16px;
    padding: 8px 16px;
    margin-right: 8px;
  }
</style>