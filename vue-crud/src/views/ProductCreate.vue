<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 400px;">
      <q-form @submit="onsubmit" class="q-gutter-md">
        <q-input v-model="name" label="Product Name" />
        <q-input v-model="description" label="Description" />
        <q-input v-model="price" label="Price" type="number" />
        <q-input v-model="category" label="Category" />
        
        <!-- ใช้ q-uploader สำหรับอัปโหลดรูปภาพ -->
        <q-uploader
          v-model="imageFile"
          label="Image Upload"
          color="primary"
          accept="image/*"
          auto-upload
          @added="handleImageUpload"
        />
        
        <q-btn label="Submit" type="submit" color="primary" />
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref('');
const description = ref('');
const price = ref('');
const category = ref('');
const imageFile = ref(null); // เก็บไฟล์รูปภาพ

const handleImageUpload = (files) => {
  imageFile.value = files[0]; // เก็บไฟล์แรกที่เลือกไว้
};

const onsubmit = (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('name', name.value);
  formData.append('description', description.value);
  formData.append('price', parseFloat(price.value));
  formData.append('category', category.value);
  if (imageFile.value) {
    formData.append('image', imageFile.value);
  }

  const requestOptions = {
    method: 'POST',
    body: formData,
    redirect: 'follow',
  };

  fetch('http://localhost:8800/api/prod/products', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log('API Response:', result);
      if (result.status === 'ok') {
        router.push('/product');
      } else {
        alert('Something went wrong');
      }
    })
    .catch((error) => console.error('Error:', error));
};
</script>
