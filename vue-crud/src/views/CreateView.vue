<template>
    <div class="q-pa-md">
      <div class="q-gutter-md" style="max-width: 400px;">
        <q-form @submit="onsubmit" class="q-gutter-md">
          <q-input v-model="first_name" label="First Name" />
          <q-input v-model="last_name" label="Last Name" />
          <q-input v-model="email" label="Email" />
          <q-input v-model="address" label="Address" />
          <q-input v-model="phone_number" label="Phone Number" />
          <q-btn label="Submit" type="submit" color="primary" />
        </q-form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import router from '@/router';

  
  const first_name = ref('');
  const last_name = ref('');
  const email = ref('');
  const address = ref('');
  const phone_number = ref('');
  
  const onsubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
  
    const raw = JSON.stringify({
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      address: address.value,
      phone_number: phone_number.value,
    });
  
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
  
    fetch('http://localhost:8800/api/v1/customers', requestOptions)
  .then((response) => response.json())
  .then((result) => {
    console.log('API Response:', result); // Log the API result to check the structure

    if (result.status === 'ok') {
      console.log('Redirecting to home...');
      router.push('/');
    } else {
      alert('Something went wrong');
    }
  })
  .catch((error) => console.error('Error:', error));

  };
  </script>
  