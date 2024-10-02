const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const createOrder = async (req, res) => {
    const { orderId, customerId, orderDate, items, paymentMethod, totalAmount } = req.body;

    if (!customerId || !items || !orderId || !paymentMethod || !totalAmount) {
        return res.status(400).json({ message: 'Invalid order data' });
    }
    try {
        const [order, payment] = await prisma.$transaction([
            prisma.orders.create({
                data: {
                    order_id: orderId,
                    customer_id: customerId,
                    order_date: new Date(orderDate),
                    order_status: 'processing',
                    total_amount: totalAmount,
                    orderdetail: {
                        create: items.map((item) => ({
                            product_id: item.productId,
                            quantity: item.quantity,
                            unit_price: item.unitPrice,
                        })),
                    },
                },
            }),
            prisma.payments.create({
                data: {
                    order_id: orderId,
                    amount: totalAmount,
                    payment_method: paymentMethod,
                    payment_status: 'pending',
                    amount: totalAmount
                },
            }),
        ]);
        console.log('Transaction committed:', { order, payment });
        res.status(200).json('Order created successfully.');
    } catch (err) {
        console.error('Failed to create orders:', err.message);
        res.status(500).json(err);
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                orderdetail: true,  // รวมรายละเอียดสินค้าในคำสั่งซื้อ
                payments: true,     // รวมข้อมูลการชำระเงิน
                customers: true,    // รวมข้อมูลลูกค้า
            },
        });
        res.status(200).json(orders);
    } catch (err) {
        console.error('Failed to retrieve orders:', err.message);
        res.status(500).json({ error: 'Failed to retrieve orders', message: err.message });
    }
};

const getOrderById = async (req, res) => {
    const id = req.params.id;

    try {
        // ตรวจสอบว่าค่า orderId ถูกส่งมาและแปลงเป็นตัวเลข
        const order = await prisma.orders.findUnique({
            where: {
                order_id: Number(id) // แปลง orderId ให้เป็น Int
            },
            include: {
                orderdetail: true,  // รวมรายละเอียดสินค้าในคำสั่งซื้อ
                payments: true,     // รวมข้อมูลการชำระเงิน
                customers: true,    // รวมข้อมูลลูกค้า
            },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (err) {
        console.error('Error retrieving order:', err.message);
        res.status(500).json({ error: 'Failed to retrieve order', message: err.message });
    }
};

const updateOrder = async (req, res) => {
    const id = req.params.id;
    const { customerId, orderDate, items, paymentMethod, totalAmount } = req.body;

    try {
        // เริ่มทำ transaction เพื่อให้การอัปเดตทั้งสองตาราง (orders และ orderdetail) เป็น atomic
        const [updatedOrder, updatedPayment] = await prisma.$transaction([
            // อัปเดตตาราง orders
            prisma.orders.update({
                where: { order_id: Number(id) },
                data: {
                    customer_id: parseInt(customerId),
                    order_date: new Date(orderDate),
                    total_amount: parseFloat(totalAmount),
                },
            }),
            // อัปเดตตาราง payments
            prisma.payments.updateMany({
                where: { order_id: Number(id) },
                data: {
                    payment_method: paymentMethod,
                    amount: parseFloat(totalAmount),
                },
            }),
        ]);

        // ลบรายการสินค้าเดิมทั้งหมดจาก orderdetail
        await prisma.orderdetail.deleteMany({
            where: { order_id: Number(id) },
        });

        // เพิ่มรายการสินค้าใหม่
        // ลบรายการสินค้าเดิมทั้งหมดจาก orderdetail
        await prisma.orderdetail.deleteMany({
            where: { order_id: Number(id) },
        });

        // เพิ่มรายการสินค้าใหม่ทีละรายการ
        for (const item of items) {
            await prisma.orderdetail.create({
                data: {
                    order_id: Number(id),
                    product_id: parseInt(item.productId),
                    quantity: parseInt(item.quantity),
                    unit_price: parseFloat(item.unitPrice),
                },
            });
        }


        res.status(200).json({ message: 'Order updated successfully.' });
    } catch (err) {
        console.error('Error updating order:', err.message);
        res.status(500).json({ error: 'Failed to update order', message: err.message });
    }
};




const deleteOrder = async (req, res) => {
    const id = req.params.id;

    try {
        await prisma.$transaction([
            prisma.orderdetail.deleteMany({ where: { order_id: Number(id) } }),
            prisma.payments.deleteMany({ where: { order_id: Number(id) } }),
            prisma.orders.delete({ where: { order_id: Number(id) } }),
        ]);
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete order', message: err.message });
    }
};


module.exports = { createOrder, getOrders, getOrderById, updateOrder, deleteOrder };

