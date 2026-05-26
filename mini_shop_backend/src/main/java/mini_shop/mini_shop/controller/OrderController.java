package mini_shop.mini_shop.controller;

import lombok.RequiredArgsConstructor;
import mini_shop.mini_shop.models.Order;
import mini_shop.mini_shop.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    @Autowired
    private final OrderService orderService;

    @Autowired
    private final ObjectMapper objectMapper;

    @PostMapping(consumes = {"multipart/form-data"}) //
    public ResponseEntity<?> placeOrder(
            @RequestPart("order") String orderJson,
            @RequestPart("slip") MultipartFile slipFile) {

        try {

            Order order = objectMapper.readValue(orderJson, Order.class);


            if (slipFile == null || slipFile.isEmpty()) {
                return ResponseEntity.badRequest().body("Payment slip image is required!");
            }

            Order savedOrder = orderService.placeOrder(order, slipFile);
            return ResponseEntity.ok(savedOrder);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Order processing failed: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }


    // OrderController.java
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(@RequestParam String email) {
        return ResponseEntity.ok(orderService.getOrdersByUser(email));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // OrderController.java

    @GetMapping("/stats/daily-revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getDailyRevenue() {
        return ResponseEntity.ok(orderService.getDailyRevenueStats());
    }

}
