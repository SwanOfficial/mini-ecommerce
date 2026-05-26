package mini_shop.mini_shop.services;

import mini_shop.mini_shop.models.Order;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface OrderService {

    Order placeOrder(Order order, MultipartFile slipFile);
    List<Order> getAllOrders();
    Order getOrderById(Long id);
    List<Order> getOrdersByUser(String email);
    Order updateOrderStatus(Long id, String status);
    List<Map<String, Object>> getDailyRevenueStats();




}
