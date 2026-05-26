package mini_shop.mini_shop.services;

import mini_shop.mini_shop.models.User;

public interface UserService {
    User getMyProfile(String email);


    User updateProfile(String currentEmail, User updateRequest, String newPassword);

    User updateProfileV2(String email, String newUsername, String phoneNumber, String address, String newPassword);
}
