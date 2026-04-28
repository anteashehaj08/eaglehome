package com.ecommerce.service;

import com.ecommerce.dto.CartDto;
import com.ecommerce.entity.*;
import com.ecommerce.exception.*;
import com.ecommerce.repository.*;
import com.ecommerce.security.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserContext userContext;
    private final ProductService productService;

    public CartDto.CartResponse getCart() {
        return toResponse(getOrCreateCart());
    }

    @Transactional
    public CartDto.CartResponse addItem(CartDto.AddItemRequest request) {

        Cart cart = getOrCreateCart();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundException("Product not found"));

        if (!product.getActive())
            throw new BadRequestException("Product inactive");

        if (product.getStockQuantity() < request.getQuantity())
            throw new BadRequestException("Not enough stock");

        cart.getItems().add(
                CartItem.builder()
                        .cart(cart)
                        .product(product)
                        .quantity(request.getQuantity())
                        .build()
        );

        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartDto.CartResponse updateItem(Long itemId, CartDto.UpdateItemRequest request) {

        Cart cart = getOrCreateCart();

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Item not found"));

        if (request.getQuantity() <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(request.getQuantity());
        }

        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartDto.CartResponse removeItem(Long itemId) {

        Cart cart = getOrCreateCart();
        cart.getItems().removeIf(i -> i.getId().equals(itemId));

        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart() {
        Cart cart = getOrCreateCart();
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart() {

        User user = userContext.getCurrentUser();

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .user(user)
                                .items(new ArrayList<>())
                                .build()
                ));
    }

    private CartDto.CartResponse toResponse(Cart cart) {

        CartDto.CartResponse res = new CartDto.CartResponse();

        var items = cart.getItems().stream().map(item -> {
            CartDto.CartItemResponse r = new CartDto.CartItemResponse();
            r.setId(item.getId());
            r.setProduct(productService.toResponse(item.getProduct()));
            r.setQuantity(item.getQuantity());
            r.setSubtotal(
                    item.getProduct().getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()))
            );
            return r;
        }).toList();

        res.setItems(items);
        res.setItemCount(items.stream().mapToInt(CartDto.CartItemResponse::getQuantity).sum());
        res.setTotal(items.stream()
                .map(CartDto.CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        return res;
    }
}