package com.ecommerce.controller;

import com.ecommerce.dto.OrderDto;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    // Public endpoint - guests can place orders
    @PostMapping
    public ResponseEntity<OrderDto.Response> placeOrder(
            @Valid @RequestBody OrderDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = null;
        if (userDetails != null) {
            userId = userRepository.findByEmail(userDetails.getUsername())
                    .map(User::getId).orElse(null);
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.placeOrder(request, userId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderDto.Response>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId).orElseThrow();
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }
}
