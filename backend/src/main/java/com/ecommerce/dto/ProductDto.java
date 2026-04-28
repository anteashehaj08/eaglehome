package com.ecommerce.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDto {

    @Data
    public static class CreateRequest {
        @NotBlank
        private String name;
        private String description;
        @NotNull @DecimalMin("0.01")
        private BigDecimal price;
        @NotNull @Min(0)
        private Integer stockQuantity;
        private String imageUrl;
        private String additionalImages;
        private String availableColors;
        private String availableMaterials;
        private String dimensions;
        @NotNull
        private Long categoryId;
        private Boolean featured = false;
    }

    @Data
    public static class UpdateRequest {
        private String name;
        private String description;
        private BigDecimal price;
        private Integer stockQuantity;
        private String imageUrl;
        private String additionalImages;
        private String availableColors;
        private String availableMaterials;
        private String dimensions;
        private Long categoryId;
        private Boolean active;
        private Boolean featured;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer stockQuantity;
        private String imageUrl;
        private String additionalImages;
        private String availableColors;
        private String availableMaterials;
        private String dimensions;
        private Boolean active;
        private Boolean featured;
        private LocalDateTime createdAt;
        private CategoryDto.Response category;
    }
}
