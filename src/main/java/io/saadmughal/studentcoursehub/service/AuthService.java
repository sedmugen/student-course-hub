package io.saadmughal.studentcoursehub.service;

import io.saadmughal.studentcoursehub.config.JwtUtil;
import io.saadmughal.studentcoursehub.dto.LoginRequest;
import io.saadmughal.studentcoursehub.dto.LoginResponse;
import io.saadmughal.studentcoursehub.dto.RegisterRequest;
import io.saadmughal.studentcoursehub.entity.Users;
import io.saadmughal.studentcoursehub.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Optional<Users> userOpt = usersRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        Users user = userOpt.get();

        if (!user.getEnabled()) {
            throw new RuntimeException("Account is deactivated. Please contact administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        return new LoginResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // Check if email already exists
        if (usersRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Validate role
        String role = request.getRole().toUpperCase();
        if (!role.equals("ADMIN") && !role.equals("INSTRUCTOR") && !role.equals("STUDENT")) {
            throw new RuntimeException("Invalid role. Must be ADMIN, INSTRUCTOR, or STUDENT");
        }

        Users user = Users.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .enabled(true)
                .build();

        user = usersRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        return new LoginResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
