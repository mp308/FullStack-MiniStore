<template>
    <div class="q-pa-md">
      <q-form @submit="onSubmit">
        <div class="q-gutter-md">
  
          <!-- Order ID (readonly) -->
          <q-input filled v-model="form.orderId" label="Order ID" type="number" readonly />
  
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
          <q-btn label="Save Changes" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  
  // ฟอร์มข้อมูลคำสั่งซื้อ
  const form = ref({
    orderId: '',
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
  
  // ฟังก์ชันสำหรับเพิ่มสินค้า
  const addItem = () => {
    form.value.items.push({
      productId: '',
      quantity: '',
      unitPrice: ''
    });
  };
  
  // ฟังก์ชันสำหรับลบสินค้า
  const removeItem = (index) => {
    form.value.items.splice(index, 1);
  };
  
  // ดึงข้อมูลคำสั่งซื้อเมื่อเปิดหน้าการแก้ไข
  const fetchOrderData = async () => {
    const orderId = route.params.id; // ดึง orderId จาก route params
    try {
      const response = await fetch(`http://localhost:8800/api/v1/orders/${orderId}`);
      const result = await response.json();
  
      // ตั้งค่าข้อมูลในฟอร์ม
      form.value.orderId = result.order_id;
      form.value.customerId = result.customer_id;
      form.value.orderDate = result.order_date.split('T')[0];  // แปลงวันที่ให้อยู่ในรูปแบบที่ถูกต้อง
      form.value.totalAmount = result.total_amount;
      form.value.paymentMethod = result.payments[0].payment_method;
      form.value.items = result.orderdetail.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        unitPrice: item.unit_price
      }));
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };
  
  // โหลดข้อมูลคำสั่งซื้อเมื่อเปิดหน้า
  onMounted(() => {
    fetchOrderData();
  });
  
  // ฟังก์ชันส่งข้อมูลการแก้ไข
  const onSubmit = async () => {
    const orderId = form.value.orderId;
    try {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: parseInt(form.value.customerId),
          orderDate: form.value.orderDate,
          items: form.value.items.map(item => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            unitPrice: parseFloat(item.unitPrice)
          })),
          paymentMethod: form.value.paymentMethod,
          totalAmount: parseFloat(form.value.totalAmount)
        })
      };
  
      const response = await fetch(`http://localhost:8800/api/v1/orders/${orderId}`, requestOptions);
      const result = await response.json();
  
      if (response.ok) {
        alert('Order updated successfully.');
        router.push('/orders'); // เปลี่ยนหน้าไปยังหน้ารายการ orders
      } else {
        alert(result.message || 'Failed to update order.');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order.');
    }
  };
  </script>
  
  <style scoped>
  .q-form {
    max-width: 600px;
    margin: auto;
  }
  </style>
