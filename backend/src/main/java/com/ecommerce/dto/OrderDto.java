package com.ecommerce.dto;

import com.ecommerce.entity.Order;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    @Data
    public static class CreateRequest {
        // Guest fields
        private String customerName;
        private String customerPhone;
        private String customerEmail;
        private String shippingAddress;

        // General order preferences/notes
        private String customerPreferences;

        @jakarta.validation.constraints.NotEmpty
        private List<OrderItemRequest> items;
    }

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        private String itemPreferences; // color, material, custom note
    }

    @Data
    public static class OrderItemResponse {
        private Long id;
        private ProductDto.Response product;
        private Integer quantity;
        private String itemPreferences;
    }

    @Data
    public static class Response {
        private Long id;
        private String customerName;
        private String customerPhone;
        private String customerEmail;
        private List<OrderItemResponse> items;
        private Order.OrderStatus status;
        private String shippingAddress;
        private String customerPreferences;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        // WhatsApp link generated server-side
        private String whatsappLink;
    }

    @Data
    public static class StatusUpdateRequest {
        private Order.OrderStatus status;
    }
}
