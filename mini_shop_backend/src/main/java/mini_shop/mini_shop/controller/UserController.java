package mini_shop.mini_shop.controller;


import mini_shop.mini_shop.models.User;
import mini_shop.mini_shop.repositories.UserRepository;
import mini_shop.mini_shop.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(Principal principal) {

        User user = userService.getMyProfile(principal.getName());


        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody java.util.Map<String, Object> payload,
            @RequestParam(required = false) String newPassword,
            Principal principal) {

        try {

            String updatedUsername = (String) payload.get("username");
            String phoneNumber = (String) payload.get("phoneNumber");
            String address = (String) payload.get("address");


            User updatedUser = userService.updateProfileV2(principal.getName(), updatedUsername, phoneNumber, address, newPassword);

            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
