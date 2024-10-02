<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 400px;">
      <q-form @submit="onsubmit" class="q-gutter-md">
        <q-input v-model="name" label="Product Name" />
        <q-input v-model="description" label="Description" />
        <q-input v-model="price" label="Price" type="number" />
        <q-input v-model="category" label="Category" />
        <q-input label="Upload Image">
          <input type="file" @change="handleImageUpload" />
        </q-input>
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
const imageFile = ref(null); // เก็บไฟล์รูปภาพ

// ฟังก์ชันสำหรับจัดการการอัปโหลดรูปภาพ
const handleImageUpload = (event) => {
  imageFile.value = event.target.files[0]; // เก็บไฟล์ที่เลือก
};

const onsubmit = (event) => {
  event.preventDefault(); // ป้องกันการส่งฟอร์มแบบดั้งเดิม

  // ใช้ FormData สำหรับการอัปโหลดไฟล์
  const formData = new FormData();
  formData.append('name', name.value);
  formData.append('description', description.value);
  formData.append('price', parseFloat(price.value)); // แปลงราคาเป็นตัวเลข
  formData.append('category', category.value);
  if (imageFile.value) {
    formData.append('image', imageFile.value); // แนบไฟล์รูปภาพ
  }

  const requestOptions = {
    method: 'POST',
    body: formData, // ส่งข้อมูลเป็น formData
    redirect: 'follow',
  };

  fetch('http://localhost:8800/api/prod/products', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log('API Response:', result); // แสดงผลลัพธ์ของ API
      if (result.status === 'ok') {
        router.push('/product');
      } else {
        alert('Something went wrong');
      }
    })
    .catch((error) => console.error('Error:', error));
};
</script>
