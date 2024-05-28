package com.crm.dev.service;

import com.crm.dev.models.User;
import com.crm.dev.repository.UserRepository;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {
        // Hasher le mot de passe avant de sauvegarder l'utilisateur
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByGroupe(String groupe) {
        return userRepository.findByGroupe(groupe);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<User> createMultipleUsers(int count) {
        List<User> users = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            User user = new User();
            user.setFirstname("Jeany" + i);
            user.setLastname("Duponyt" + i);
            user.setEmail("jean.duponyt" + i + "@eyxample.com");
            user.setPassword(bCryptPasswordEncoder.encode("mypasysword" + i));
            user.setGroupe("Employyé");

            users.add(userRepository.save(user));
        }
        return users;
    }

    public void deleteUsersByIdRange(Long startId, Long endId) {
        for (long id = startId; id <= endId; id++) {
            userRepository.deleteById(id);
        }
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userRepository
                .findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>()
        );
    }
}
