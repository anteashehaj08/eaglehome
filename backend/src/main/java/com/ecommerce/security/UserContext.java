package com.ecommerce.security;

import com.ecommerce.entity.User;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserContext {

    private final UserRepository userRepository;

    public User getCurrentUser() {

        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null ||
                !auth.isAuthenticated() ||
                auth.getName() == null ||
                auth.getName().equals("anonymousUser")) {
            throw new UnauthorizedException("Not authenticated");
        }

        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }
}