<template>
    <div class="q-pa-md">
      <div class="q-gutter-md" style="max-width: 400px;">
        <q-form @submit="onsubmit" class="q-gutter-md">
          <q-input v-model="name" label="Product Name" />
          <q-input v-model="description" label="Description" />
          <q-input v-model="price" label="Price" type="number" />
          <q-input v-model="category" label="Category" />
          <q-input v-model="image_url" label="Image URL" />
          <q-btn label="Submit" type="submit" color="primary" />
        </q-form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import router from '@/router';
  
  const name = ref('');
  const description = ref('');
  const price = ref('');
  const category = ref('');
  const image_url = ref('');
  
  const onsubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
  
    const raw = JSON.stringify({
      name: name.value,
      description: description.value,
      price: parseFloat(price.value),  // Ensure price is a number
      category: category.value,
      image_url: image_url.value,
    });
  
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
  
    fetch('http://localhost:8800/api/prod/products', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('API Response:', result); // Log the API result
  
        if (result.status === 'ok') {
            router.push('/product')
        } else {
          alert('Something went wrong');
        }
      })
      .catch((error) => console.error('Error:', error));
  };
  </script>
  