<template>
  <div class="q-pa-md">
    <div class="q-pa-md">
      <q-btn icon="add" @click="onCreate" />
    </div>
    <q-table
      title="Product"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <!-- Render image in image_url column with full URL and fallback -->
      <template v-slot:body-cell-image_url="props">
        <q-td :props="props">
          <img 
            :src="`http://localhost:8800/${props.row.image_url}`" 
            alt="Product Image" 
            style="max-width: 100px; max-height: 100px;" 
            @error="this.src = '/path/to/default-image.jpg';"
          />
        </q-td>
      </template>

      <!-- Render action buttons -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" @click="onEdit(props.row.product_id)" />
          <q-btn icon="delete" @click="onDelete(props.row.product_id)" />
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
  { name: 'image_url', align: 'center', label: 'Image', field: 'image_url', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions' }
]

const rows = ref([]);

// Fetch product data
const fetchData = () => {
  fetch('http://localhost:8800/api/prod/products')
    .then(res => res.json())
    .then(result => {
      rows.value = result;
    })
    .catch(error => console.error('Error fetching products:', error));
}

fetchData();

// Edit product
const onEdit = (id) => {
  router.push('/update-product/' + id);
}

// Delete product
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
      if (result.status === 'ok') {
        fetchData(); // Update data after deleting product
      }
    })
    .catch(error => console.error('Error deleting product:', error));
}

// Create new product
const onCreate = () => {
  router.push('/create-product');
}
</script>
