package com.crm.dev.service;

import com.crm.dev.models.Role;
import com.crm.dev.models.Training;
import com.crm.dev.models.User;
import com.crm.dev.repository.RoleRepository;
import com.crm.dev.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            System.out.println("Utilisateur avec l'ID " + id + " non trouvé.");
        } else {
            System.out.println("Utilisateur trouvé : " + user.getFirstname() + " " + user.getLastname());
        }
        return user;
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
            user.setEmail("jean.duponyt" + i + "@example.com");
            user.setPassword(bCryptPasswordEncoder.encode("mypassword" + i));
            user.setGroupe("Employee");
            user.setImage("https://example.com/image" + i + ".png");
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
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }

    @Transactional
    public void addRoleToUser(String email, String roleName) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found with name: " + roleName));

        user.getRoles().add(role);
        userRepository.save(user);
    }

}
