package mini_shop.mini_shop.services.impl;


import lombok.RequiredArgsConstructor;
import mini_shop.mini_shop.models.Order;
import mini_shop.mini_shop.models.OrderStatus;
import mini_shop.mini_shop.repositories.OrderRepository;
import mini_shop.mini_shop.repositories.ProductRepository;
import mini_shop.mini_shop.services.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final String SLIP_UPLOAD_DIR = "uploads/slips/";

    @Override
    @Transactional
    public Order placeOrder(Order order, MultipartFile slipFile) {


        order.getItems().forEach(item -> {
            var product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductName()));

            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Out of stock: " + product.getName());
            }

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        });


        try {
            java.io.File uploadDir = new java.io.File(SLIP_UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // ဖိုင်နာမည် မထပ်အောင် လက်ရှိအချိန် (Timestamp) နဲ့ တွဲ
            String fileName = System.currentTimeMillis() + "_" + slipFile.getOriginalFilename();
            java.nio.file.Path filePath = java.nio.file.Paths.get(SLIP_UPLOAD_DIR + fileName);
            java.nio.file.Files.copy(slipFile.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);


            String slipUrl = "/uploads/slips/" + fileName;
            order.setPaymentSlipUrl(slipUrl);

        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to store payment slip image: " + e.getMessage());
        }


        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Override
    public List<Order> getOrdersByUser(String email) {
        return orderRepository.findByCustomerEmailOrderByOrderDateDesc(email);
    }

    @Override
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));


        order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        return orderRepository.save(order);
    }



    @Override
    public List<Map<String, Object>> getDailyRevenueStats() {
        List<Object[]> results = orderRepository.getDailyRevenueStats();
        List<Map<String, Object>> stats = new ArrayList<>();

        for (Object[] result : results) {
            Map<String, Object> map = new HashMap<>();

            map.put("date", result[0].toString());
            map.put("amount", result[1]);
            stats.add(map);
        }
        return stats;
    }

}
        /*
@Override
public Double getTotalRevenue() {
    Double revenue = orderRepository.getTotalRevenue();
    return revenue != null ? revenue : 0.0;
}*/

