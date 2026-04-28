package com.ecommerce.controller;
@RestController
public class HomeController {
        @GetMapping("/")
        public String home() {
            return "OK";
        }
}
