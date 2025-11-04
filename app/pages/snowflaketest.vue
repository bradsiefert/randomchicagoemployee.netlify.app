<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Snowflake Connection Test</h1>
      
      <div v-if="loading" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p class="text-blue-800">Loading employee data from Snowflake...</p>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <h2 class="text-red-800 font-semibold mb-2">Error</h2>
        <p class="text-red-700">{{ error }}</p>
      </div>

      <div v-if="employee && !loading" class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 class="text-2xl font-semibold mb-4">Employee Data (1 Row)</h2>
        
        <div class="space-y-3">
          <div v-for="(value, key) in employee" :key="key" class="border-b border-gray-100 pb-2">
            <span class="font-semibold text-gray-700 capitalize">{{ key }}:</span>
            <span class="ml-2 text-gray-900">{{ value }}</span>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-200">
          <h3 class="font-semibold mb-2">Raw JSON:</h3>
          <pre class="bg-gray-50 p-4 rounded overflow-auto text-sm">{{ JSON.stringify(employee, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const employee = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchEmployee = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await $fetch('/api/employee');
    
    if (response.success && response.data) {
      employee.value = response.data;
    } else {
      error.value = 'No employee data returned from API';
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch employee data';
    console.error('Error fetching employee:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEmployee();
});
</script>

