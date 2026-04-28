package com.ecommerce.service;

import com.ecommerce.dto.CategoryDto;
import com.ecommerce.entity.Category;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto.Response> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<CategoryDto.Response> getCategoriesByGroup(String groupName) {
        return categoryRepository.findByGroupName(groupName).stream().map(this::toResponse).toList();
    }

    public CategoryDto.Response getCategoryById(Long id) {
        return toResponse(findCategory(id));
    }

    @Transactional
    public CategoryDto.Response createCategory(CategoryDto.Request request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Category already exists: " + request.getName());
        }
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .groupName(request.getGroupName())
                .imageUrl(request.getImageUrl())
                .build();
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDto.Response updateCategory(Long id, CategoryDto.Request request) {
        Category category = findCategory(id);
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setGroupName(request.getGroupName());
        category.setImageUrl(request.getImageUrl());
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.delete(findCategory(id));
    }

    private Category findCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }

    public CategoryDto.Response toResponse(Category c) {
        CategoryDto.Response r = new CategoryDto.Response();
        r.setId(c.getId());
        r.setName(c.getName());
        r.setDescription(c.getDescription());
        r.setGroupName(c.getGroupName());
        r.setImageUrl(c.getImageUrl());
        return r;
    }
}
