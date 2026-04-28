package com.ecommerce.service;

import com.ecommerce.dto.CartDto;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public CartDto.CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return toResponse(cart);
    }

    @Transactional
    public CartDto.CartResponse addItem(Long userId, CartDto.AddItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getActive())
            throw new BadRequestException("Product is not available");
        if (product.getStockQuantity() < request.getQuantity())
            throw new BadRequestException("Insufficient stock. Available: " + product.getStockQuantity());

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(request.getProductId()))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + request.getQuantity());
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(item);
        }

        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartDto.CartResponse updateItem(Long userId, Long itemId, CartDto.UpdateItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (request.getQuantity() == 0) {
            cart.getItems().remove(item);
        } else {
            if (item.getProduct().getStockQuantity() < request.getQuantity())
                throw new BadRequestException("Insufficient stock");
            item.setQuantity(request.getQuantity());
        }

        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartDto.CartResponse removeItem(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // ── Fixed: properly links User when creating a new cart ──
    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            Cart newCart = Cart.builder()
                    .user(user)
                    .items(new ArrayList<>())
                    .build();
            return cartRepository.save(newCart);
        });
    }

    private CartDto.CartResponse toResponse(Cart cart) {
        CartDto.CartResponse response = new CartDto.CartResponse();
        response.setId(cart.getId());

        var items = cart.getItems().stream().map(item -> {
            CartDto.CartItemResponse r = new CartDto.CartItemResponse();
            r.setId(item.getId());
            r.setProduct(productService.toResponse(item.getProduct()));
            r.setQuantity(item.getQuantity());
            r.setSubtotal(item.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity())));
            return r;
        }).toList();

        response.setItems(items);
        response.setItemCount(items.stream().mapToInt(CartDto.CartItemResponse::getQuantity).sum());
        response.setTotal(items.stream()
                .map(CartDto.CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        return response;
    }
}