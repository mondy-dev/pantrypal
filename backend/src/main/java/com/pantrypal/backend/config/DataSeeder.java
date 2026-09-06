package com.pantrypal.backend.config;

import com.pantrypal.backend.model.Category;
import com.pantrypal.backend.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    private static final List<String> DEFAULT_CATEGORIES = List.of(
            "Rice & Grains",
            "Canned Goods",
            "Meat",
            "Seafood",
            "Vegetables",
            "Fruits",
            "Dairy",
            "Frozen Food",
            "Snacks",
            "Beverages",
            "Condiments",
            "Spices",
            "Baking",
            "Instant Food",
            "Other");

    public DataSeeder(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        for (String name : DEFAULT_CATEGORIES) {
            if (!categoryRepository.existsByNameAndHouseholdIsNull(name)) {
                categoryRepository.save(new Category(name, null));
            }
        }
    }
}