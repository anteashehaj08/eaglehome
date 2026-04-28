package com.ecommerce.service;

import com.ecommerce.dto.OrderDto;
import com.ecommerce.entity.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    @Value("${app.whatsapp.number:+1234567890}")
    private String whatsappNumber;

    @Transactional
    public OrderDto.Response placeOrder(OrderDto.CreateRequest request, Long userId) {

        Order order = Order.builder()
                .shippingAddress(request.getShippingAddress())
                .customerPreferences(request.getCustomerPreferences())
                .status(Order.OrderStatus.PENDING)
                .build();

        // Link user if logged in
        if (userId != null) {
            userRepository.findById(userId).ifPresent(order::setUser);
        } else {
            order.setCustomerName(request.getCustomerName());
            order.setCustomerPhone(request.getCustomerPhone());
            order.setCustomerEmail(request.getCustomerEmail());
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one item");
        }

        List<OrderItem> orderItems = request.getItems().stream().map(itemReq -> {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.getProductId()));

            return OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .itemPreferences(itemReq.getItemPreferences())
                    .build();
        }).toList();

        order.setItems(orderItems);
        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    public List<OrderDto.Response> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    public OrderDto.Response getOrderById(Long orderId) {
        return toResponse(orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found")));
    }

    public Page<OrderDto.Response> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional
    public OrderDto.Response updateOrderStatus(Long orderId, OrderDto.StatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(request.getStatus());
        return toResponse(orderRepository.save(order));
    }

    private String buildWhatsAppLink(Order order) {
        StringBuilder msg = new StringBuilder();
        msg.append("Hello EagleFier! I'd like to place an order:\n\n");

        for (OrderItem item : order.getItems()) {
            msg.append("• ").append(item.getProduct().getName())
               .append(" x").append(item.getQuantity());
            if (item.getItemPreferences() != null && !item.getItemPreferences().isBlank()) {
                msg.append(" [").append(item.getItemPreferences()).append("]");
            }
            msg.append("\n");
        }

        if (order.getCustomerPreferences() != null && !order.getCustomerPreferences().isBlank()) {
            msg.append("\nNotes: ").append(order.getCustomerPreferences());
        }

        if (order.getShippingAddress() != null) {
            msg.append("\nDelivery to: ").append(order.getShippingAddress());
        }

        msg.append("\n\nOrder #").append(order.getId());

        String encoded = URLEncoder.encode(msg.toString(), StandardCharsets.UTF_8);
        return "https://wa.me/" + whatsappNumber.replace("+", "").replace(" ", "") + "?text=" + encoded;
    }

    private OrderDto.Response toResponse(Order order) {
        OrderDto.Response r = new OrderDto.Response();
        r.setId(order.getId());
        r.setCustomerName(order.getCustomerName());
        r.setCustomerPhone(order.getCustomerPhone());
        r.setCustomerEmail(order.getCustomerEmail());
        r.setStatus(order.getStatus());
        r.setShippingAddress(order.getShippingAddress());
        r.setCustomerPreferences(order.getCustomerPreferences());
        r.setCreatedAt(order.getCreatedAt());
        r.setUpdatedAt(order.getUpdatedAt());
        r.setWhatsappLink(buildWhatsAppLink(order));

        if (order.getItems() != null) {
            r.setItems(order.getItems().stream().map(item -> {
                OrderDto.OrderItemResponse ir = new OrderDto.OrderItemResponse();
                ir.setId(item.getId());
                ir.setProduct(productService.toResponse(item.getProduct()));
                ir.setQuantity(item.getQuantity());
                ir.setItemPreferences(item.getItemPreferences());
                return ir;
            }).toList());
        }
        return r;
    }
}
