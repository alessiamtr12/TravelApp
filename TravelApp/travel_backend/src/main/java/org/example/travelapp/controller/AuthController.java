package org.example.travelapp.controller;

import org.example.travelapp.dto.LoginRequest;
import org.example.travelapp.model.User;
import org.example.travelapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if(userRepository.existsByEmail(user.getEmail())){
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User newUser = userRepository.save(user);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if(userOptional.isPresent()){
            User user = userOptional.get();
            if(user.getPassword().equals(loginRequest.getPassword())){
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.badRequest().body("Wrong email or password");
    }

}
