package com.ibm.ecms.service;

import com.ibm.ecms.entity.UserEntity;
import com.ibm.ecms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        String role = userEntity.getRole();
        if (role != null && role.startsWith("ROLE_")) {
            role = role.substring(5);
        }

        return User.builder()
                .username(userEntity.getUsername())
                .password(userEntity.getPassword())
                .roles(role != null ? role : "USER")
                .build();
    }
}
