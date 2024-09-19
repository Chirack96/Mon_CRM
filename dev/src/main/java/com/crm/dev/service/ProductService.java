package com.crm.dev.service;

import com.crm.dev.models.Product;
import com.crm.dev.models.OrderProduct;
import com.crm.dev.repository.ProductRepository;
import com.crm.dev.repository.OrderProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderProductRepository orderProductRepository;

    public List<Product> findAllProducts() {
        return productRepository.findByActiveTrue();
    }

    public Product saveProduct(Product product) {
        product.setProductCode(generateUniqueProductCode(product.getCategory()));
        return productRepository.save(product);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());
        product.setCategory(productDetails.getCategory());

        product.setProductCode(generateUniqueProductCode(product.getCategory()));

        return productRepository.save(product);
    }

    public void deactivateProduct(Long id) {
        Product product = getProductById(id);
        product.setActive(false);
        productRepository.save(product);

        List<OrderProduct> orderProducts = orderProductRepository.findByProductId(id);
        for (OrderProduct orderProduct : orderProducts) {
            orderProduct.setProductName(product.getName());
            // Ne pas définir product à null ici
        }
        orderProductRepository.saveAll(orderProducts);
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
