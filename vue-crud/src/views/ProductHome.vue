<template>
    <div class="q-pa-md">
      <div class="q-pa-md">
        <q-btn icon="add" @click="onCreate"/>
      </div>
      <q-table
        title="Product"
        :rows="rows"
        :columns="columns"
        row-key="name"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props"> 
            <q-btn icon="edit" @click="onEdit(props.row.product_id)"/>
            <q-btn icon="delete" @click="onDelete(props.row.product_id)"/>
          </q-td>
        </template>
      </q-table>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import router from '@/router';
  
  const columns = [
    { name: 'product_id', align: 'center', label: 'Product ID', field: 'product_id', sortable: true },
    { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
    { name: 'description', align: 'center', label: 'Description', field: 'description', sortable: true },
    { name: 'price', align: 'center', label: 'Price', field: 'price', sortable: true },
    { name: 'category', align: 'center', label: 'Category', field: 'category', sortable: true },
    { name: 'image_url', align: 'center', label: 'Image URL', field: 'image_url', sortable: true },
    { name: 'actions', align: 'center', label: 'Actions', field: 'actions' }
  ]
  
  const rows = ref([])
  
  // ดึงข้อมูลสินค้า
  const fetchData = () => {
    fetch('http://localhost:8800/api/prod/products')
      .then(res => res.json())
      .then(result => {
        rows.value = result;
      })
      .catch(error => console.error('Error fetching products:', error));
  }
  
  fetchData();
  
  // แก้ไขข้อมูลสินค้า
  const onEdit = (id) => {
    router.push('/update-product/' + id);
  }
  
  // ลบสินค้า
  const onDelete = (id) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };
  
    fetch(`http://localhost:8800/api/prod/products/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        alert(result.message);
        console.log(result);
        if (result.status === 'ok') {
          fetchData(); // อัปเดตข้อมูลหลังจากลบสินค้า
        }
      })
      .catch(error => console.error('Error deleting product:', error));
  }
  
  // สร้างสินค้าใหม่
  const onCreate = () => {
    router.push('/create-product');
  }
  </script>
  