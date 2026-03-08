package org.example.travelapp.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.travelapp.model.User;
import org.example.travelapp.dto.UserCreateDTO;
import org.example.travelapp.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin

public class UserController {
    private final UserService userService;

    @GetMapping("/user")
    public List<User> getUsers(){
        return userService.getAllUsers();
    }
    @PostMapping("/user")
    public User addUser( @Valid @RequestBody UserCreateDTO userDTO){
        return userService.addUser(userDTO);

    }

}
