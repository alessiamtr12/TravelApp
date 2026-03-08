package org.example.travelapp.service;

import org.example.travelapp.model.User;
import org.example.travelapp.dto.UserCreateDTO;
import org.example.travelapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User addUser(UserCreateDTO userDTO) {
        User user = new User();

        user.setName(userDTO.getName());
        user.setAge(userDTO.getAge());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());

        return userRepository.save(user);
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id).orElse(null);
    }
}
