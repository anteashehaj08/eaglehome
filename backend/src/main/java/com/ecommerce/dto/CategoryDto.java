package com.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class CategoryDto {

    @Data
    public static class Request {
        @NotBlank
        private String name;
        private String description;
        private String groupName;  // INDOOR, OUTDOOR, LIGHTING, BOHO, ALL
        private String imageUrl;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private String groupName;
        private String imageUrl;
    }
}
