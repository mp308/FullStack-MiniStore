<template>
    <div class="q-pa-md">
      <div class="q-pa-md">
        <q-btn icon="add" @click="onCreate" />
      </div>
      <q-table
        title="Orders"
        :rows="rows"
        :columns="columns"
        row-key="order_id"
      >
        <!-- Render order details in a collapsible row -->
        <template v-slot:body-cell-orderdetail="props">
          <q-td :props="props">
            <q-expansion-item label="View Items" icon="list">
              <div v-for="item in props.row.orderdetail" :key="item.product_id">
                Product ID: {{ item.product_id }}, Quantity: {{ item.quantity }}, Unit Price: {{ item.unit_price }}
              </div>
            </q-expansion-item>
          </q-td>
        </template>
  
        <!-- Render payment details -->
        <template v-slot:body-cell-payments="props">
          <q-td :props="props">
            <div v-if="props.row.payments.length">
              Method: {{ props.row.payments[0].payment_method }} <br>
              Status: {{ props.row.payments[0].payment_status }}
            </div>
          </q-td>
        </template>
  
        <!-- Render action buttons -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn icon="edit" @click="onEdit(props.row.order_id)" />
            <q-btn icon="delete" @click="onDelete(props.row.order_id)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import router from '@/router';
  
  const columns = [
    { name: 'order_id', align: 'center', label: 'Order ID', field: 'order_id', sortable: true },
    { name: 'customer_id', align: 'center', label: 'Customer id', field: 'customer_id', sortable: true },
    { name: 'order_date', align: 'center', label: 'Order Date', field: 'order_date', sortable: true },
    { name: 'total_amount', align: 'center', label: 'Total Amount', field: 'total_amount', sortable: true },
    { name: 'orderdetail', align: 'center', label: 'Order Items', field: 'orderdetail' },
    { name: 'payments', align: 'center', label: 'Payments', field: 'payments' },
    { name: 'actions', align: 'center', label: 'Actions', field: 'actions' }
  ]
  
  const rows = ref([]);
  
  // Fetch order data
  const fetchData = () => {
    fetch('http://localhost:8800/api/v1/orders')
      .then(res => res.json())
      .then(result => {
        rows.value = result;
      })
      .catch(error => console.error('Error fetching orders:', error));
  }
  
  
  
  // Edit order
  const onEdit = (id) => {
    router.push('/update-order/' + id);
  }
  
// Delete order
const onDelete = (id) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`http://localhost:8800/api/v1/orders/${id}`, requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json(); // Parse the response JSON if the request was successful
      } else {
        throw new Error('Failed to delete the order');
      }
    })
    .then(result => {
      alert('Order deleted successfully.');
      fetchData(); // Update data after deleting order
    })
    .catch(error => {
      console.error('Error deleting order:', error);
      alert('Error deleting order.');
    });
}


  fetchData();
  
  // Create new order
  const onCreate = () => {
    router.push('/create-order');
  }
  </script>
  
  <style scoped>
  .q-table {
    margin-top: 20px;
  }
  
  .q-expansion-item {
    padding: 10px;
  }
  </style>
  