package com.crm.dev.service;

import com.crm.dev.models.Product;
import com.crm.dev.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    public Product saveProduct(Product product) {
        // Génère un code produit unique avant de sauvegarder le produit
        product.setProductCode(generateUniqueProductCode(product.getCategory()));
        return productRepository.save(product);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());
        product.setCategory(productDetails.getCategory());

        // Regenerate product code if the category is updated
        product.setProductCode(generateUniqueProductCode(product.getCategory()));

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    private String generateUniqueProductCode(String category) {
        String prefix = category.substring(0, Math.min(3, category.length())).toUpperCase();
        String uniqueNumber;
        String potentialCode;
        Random random = new Random();

        do {
            uniqueNumber = String.format("%04d", random.nextInt(10000));
            potentialCode = prefix + uniqueNumber;
        } while (productRepository.existsByProductCode(potentialCode));

        return potentialCode;
    }
}