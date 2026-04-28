package com.ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

public class CartDto {

    @Data
    public static class AddItemRequest {
        @NotNull
        private Long productId;

        @NotNull @Min(1)
        private Integer quantity;
    }

    @Data
    public static class UpdateItemRequest {
        @NotNull @Min(0)
        private Integer quantity;
    }

    @Data
    public static class CartItemResponse {
        private Long id;
        private ProductDto.Response product;
        private Integer quantity;
        private BigDecimal subtotal;
    }

    @Data
    public static class CartResponse {
        private Long id;
        private List<CartItemResponse> items;
        private BigDecimal total;
        private Integer itemCount;
    }
}
