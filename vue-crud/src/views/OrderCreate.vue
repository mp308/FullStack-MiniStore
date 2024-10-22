<template>
    <div class="q-pa-md">
      <q-form @submit="onSubmit">
        <div class="q-gutter-md">
  
          <!-- Customer ID -->
          <q-input filled v-model="form.customerId" label="Customer ID" type="number" required />
  
          <!-- Order Date -->
          <q-input filled v-model="form.orderDate" label="Order Date" type="date" required />
  
          <!-- Total Amount -->
          <q-input filled v-model="form.totalAmount" label="Total Amount" type="number" required />
  
          <!-- Payment Method -->
          <q-select filled v-model="form.paymentMethod" :options="paymentMethods" label="Payment Method" required />
  
          <!-- Items (Product ID, Quantity, Unit Price) -->
          <q-card>
            <q-card-section>
              <h6>Items</h6>
              <q-btn icon="add" @click="addItem" label="Add Item" color="primary" />
            </q-card-section>
            <q-list>
              <q-item v-for="(item, index) in form.items" :key="index">
                <q-item-section>
                  <q-input filled v-model="item.productId" label="Product ID" type="number" />
                  <q-input filled v-model="item.quantity" label="Quantity" type="number" />
                  <q-input filled v-model="item.unitPrice" label="Unit Price" type="number" />
                </q-item-section>
                <q-item-section side>
                  <q-btn icon="delete" color="negative" @click="removeItem(index)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
  
          <!-- Submit Button -->
          <q-btn label="Submit" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </template>
  
  <script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

  
  // ฟอร์มข้อมูลคำสั่งซื้อ
  const form = ref({
    customerId: '',
    orderDate: '',
    totalAmount: '',
    paymentMethod: '',
    items: [
      {
        productId: '',
        quantity: '',
        unitPrice: ''
      }
    ]
  });
  
  // วิธีการชำระเงิน
  const paymentMethods = [
    'Credit Card',
    'Cash',
    'Paypal'
  ];
  
  // เพิ่มสินค้าในรายการสินค้า
  const addItem = () => {
    form.value.items.push({
      productId: '',
      quantity: '',
      unitPrice: ''
    });
  };
  
  // ลบสินค้าออกจากรายการ
  const removeItem = (index) => {
    form.value.items.splice(index, 1);
  };
  
  // ฟังก์ชันส่งข้อมูล
  const onSubmit = async () => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: parseInt(form.value.customerId),  // แปลง customerId เป็น Int
        orderDate: form.value.orderDate,  // ไม่ต้องแปลงเนื่องจากเป็นวันที่
        items: form.value.items.map(item => ({
          productId: parseInt(item.productId),  // แปลง productId เป็น Int
          quantity: parseInt(item.quantity),    // แปลง quantity เป็น Int
          unitPrice: parseFloat(item.unitPrice) // แปลง unitPrice เป็น Float
        })),
        paymentMethod: form.value.paymentMethod,  // ไม่ต้องแปลงเนื่องจากเป็นข้อความ
        totalAmount: parseFloat(form.value.totalAmount)  // แปลง totalAmount เป็น Float
      })
    };

    const response = await fetch('http://localhost:8800/api/v1/orders', requestOptions);
    const result = await response.json();

    if (response.ok) {
      alert('Order created successfully.');
      router.push('/orders'); // เปลี่ยนหน้าไปยังหน้ารายการ orders
    } else {
      alert(result.message || 'Failed to create order.');
    }
  } catch (error) {
    console.error('Error creating order:', error);
    alert('Error creating order.');
  }
};

  </script>
  
  <style scoped>
  .q-form {
    max-width: 600px;
    margin: auto;
  }
  </style>
