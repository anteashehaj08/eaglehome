package com.ecommerce.service;

import com.ecommerce.dto.CategoryDto;
import com.ecommerce.dto.ProductDto;
import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductDto.Response> getAllProducts(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable).map(this::toResponse);
    }

    public List<ProductDto.Response> getFeaturedProducts() {
        return productRepository.findByActiveTrueAndFeaturedTrue().stream().map(this::toResponse).toList();
    }

    public Page<ProductDto.Response> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable).map(this::toResponse);
    }

    public Page<ProductDto.Response> getProductsByGroup(String groupName, Pageable pageable) {
        return productRepository.findByGroupNameAndActiveTrue(groupName, pageable).map(this::toResponse);
    }

    public Page<ProductDto.Response> searchProducts(String query, Pageable pageable) {
        return productRepository.searchProducts(query, pageable).map(this::toResponse);
    }

    public ProductDto.Response getProductById(Long id) {
        return toResponse(findProduct(id));
    }

    @Transactional
    public ProductDto.Response createProduct(ProductDto.CreateRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .additionalImages(request.getAdditionalImages())
                .availableColors(request.getAvailableColors())
                .availableMaterials(request.getAvailableMaterials())
                .dimensions(request.getDimensions())
                .category(category)
                .featured(request.getFeatured() != null && request.getFeatured())
                .active(true)
                .build();

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductDto.Response updateProduct(Long id, ProductDto.UpdateRequest request) {
        Product product = findProduct(id);

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getStockQuantity() != null) product.setStockQuantity(request.getStockQuantity());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getAdditionalImages() != null) product.setAdditionalImages(request.getAdditionalImages());
        if (request.getAvailableColors() != null) product.setAvailableColors(request.getAvailableColors());
        if (request.getAvailableMaterials() != null) product.setAvailableMaterials(request.getAvailableMaterials());
        if (request.getDimensions() != null) product.setDimensions(request.getDimensions());
        if (request.getActive() != null) product.setActive(request.getActive());
        if (request.getFeatured() != null) product.setFeatured(request.getFeatured());
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = findProduct(id);
        product.setActive(false);
        productRepository.save(product);
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    public ProductDto.Response toResponse(Product product) {
        ProductDto.Response r = new ProductDto.Response();
        r.setId(product.getId());
        r.setName(product.getName());
        r.setDescription(product.getDescription());
        r.setPrice(product.getPrice());
        r.setStockQuantity(product.getStockQuantity());
        r.setImageUrl(product.getImageUrl());
        r.setAdditionalImages(product.getAdditionalImages());
        r.setAvailableColors(product.getAvailableColors());
        r.setAvailableMaterials(product.getAvailableMaterials());
        r.setDimensions(product.getDimensions());
        r.setActive(product.getActive());
        r.setFeatured(product.getFeatured());
        r.setCreatedAt(product.getCreatedAt());

        if (product.getCategory() != null) {
            CategoryDto.Response cat = new CategoryDto.Response();
            cat.setId(product.getCategory().getId());
            cat.setName(product.getCategory().getName());
            cat.setDescription(product.getCategory().getDescription());
            cat.setGroupName(product.getCategory().getGroupName());
            cat.setImageUrl(product.getCategory().getImageUrl());
            r.setCategory(cat);
        }
        return r;
    }
}
