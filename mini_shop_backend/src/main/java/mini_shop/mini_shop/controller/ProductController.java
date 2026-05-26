package mini_shop.mini_shop.controller;

import mini_shop.mini_shop.models.Product;
import mini_shop.mini_shop.services.FileStorageService;
import mini_shop.mini_shop.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private FileStorageService fileStorageService;

    /* 1. Get All Products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
    */
    // 2. Get Product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Create Product
    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);

        if (image != null && !image.isEmpty()) {
            String fileName = fileStorageService.saveFile(image);

            product.setImageUrl("http://localhost:8080/api/products/images/" + fileName);
        }

        return ResponseEntity.ok(productService.saveProduct(product));
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> getImage(@PathVariable String filename) {
        try {

            java.nio.file.Path filePath = java.nio.file.Paths.get("uploads").resolve(filename);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "image/jpeg") // image type အလိုက် ပြောင်းပေးလို့ရပါတယ်
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 4. Update Product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("description") String description,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        return productService.getProductById(id).map(product -> {
            product.setName(name);
            product.setPrice(price);
            product.setDescription(description);
            product.setStock(stock);


            if (image != null && !image.isEmpty()) {
                try {
                    String fileName = fileStorageService.saveFile(image);
                    product.setImageUrl("http://localhost:8080/api/products/images/" + fileName);
                } catch (IOException e) {
                    throw new RuntimeException("Could not store image. Please try again!");
                }
            }


            return ResponseEntity.ok(productService.saveProduct(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. Delete Product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<Product> getFilteredProducts(@RequestParam(required = false) String name) {
        if (name != null && !name.isEmpty()) {
            return productService.searchProducts(name);
        }
        return productService.getAllProducts();
    }
}
