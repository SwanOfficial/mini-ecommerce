package mini_shop.mini_shop.repositories;

import mini_shop.mini_shop.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByCustomerEmail(String email);
    List<Order> findByCustomerEmailOrderByOrderDateDesc(String email);

    @Query("SELECT CAST(o.orderDate AS date) as date, SUM(o.totalAmount) as amount " +
            "FROM Order o " +
            "GROUP BY CAST(o.orderDate AS date) " +
            "ORDER BY CAST(o.orderDate AS date) ASC")
    List<Object[]> getDailyRevenueStats();


}
