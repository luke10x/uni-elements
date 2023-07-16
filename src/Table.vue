<template>
  <div>
    <h2>Beautiful Table</h2>
    {{ error }}
    <div v-if="error">
      Error: {{ error }}
    </div>

    <table v-if="names.length">
      <tr v-for="name in names" :key="name.id">
        <td >{{ name.name }}</td>
        <td >{{ name.desc }}</td>
        <td >⭐️</td>
      </tr>
    </table>
    <p v-else>No names found.</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'NamesList',
  setup() {
    const names = ref([]);
    const error = ref(undefined);

    // Fetch names data from the API
    const fetchNames = async () => {

      try {
        const response = await fetch('data.json');
        if (response.ok) {
          const data = await response.json();
          names.value = data;
        } else {
          throw new Error('Failed to fetch names');
        }
      } catch (e) {
        error.value = "problem with fetching: " + e
        console.log("bibgg gd")
      }
    };

    onMounted(fetchNames);

    return {
      names, error
    };
  }
};
</script>

<style scoped>
table tr td {
  border: 1px solid green;
}
h2 {
  font-size: 24px;
  margin-bottom: 16px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 8px;
}
</style>
