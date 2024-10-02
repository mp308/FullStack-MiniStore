-- AddForeignKey
ALTER TABLE `orderdetail` ADD CONSTRAINT `orderdetail_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
