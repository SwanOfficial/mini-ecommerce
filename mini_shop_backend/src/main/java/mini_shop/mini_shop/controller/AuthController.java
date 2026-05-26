package mini_shop.mini_shop.controller;

import lombok.RequiredArgsConstructor;
import mini_shop.mini_shop.models.AuthResponse;
import mini_shop.mini_shop.models.LoginRequest;
import mini_shop.mini_shop.models.User;
import mini_shop.mini_shop.services.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}