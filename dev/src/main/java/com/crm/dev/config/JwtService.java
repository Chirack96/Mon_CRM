package com.crm.dev.config;

import com.crm.dev.models.User;
import com.crm.dev.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@AllArgsConstructor
@Service
public class JwtService {
    private final String EncryptionKey = "608f36e92dc66d933f06e6371493cb4fc05b1aa8f8de64014732472303a7c";

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> generate(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return this.generateJwt(user.getEmail(), user.getFirstname());
    }

    public Map<String, Object> generateJwt(String email, String firstname) {
        final long currentTime = System.currentTimeMillis();
        final long expirationTime = currentTime + 30 * 60 * 1000; // 30 minutes

        final Map<String, Object> claims = Map.of(
                "name", firstname,
                "groupe", userRepository.findByEmail(email).get().getGroupe()
        );

        final String bearer = Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(currentTime))
                .setExpiration(new Date(expirationTime))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
        return Map.of("token", bearer);
    }

    private Key getKey() {
        final byte[] decoder = Decoders.BASE64.decode(EncryptionKey);
        return Keys.hmacShaKeyFor(decoder);
    }

    public String loadUserFirstname(String token) {
        return this.getClaim(token, Claims::getSubject);
    }

    public boolean isTokenExpired(String token) {
        Date expirationDate = this.getClaim(token, Claims::getExpiration);
        return expirationDate.before(new Date());
    }

    private <T> T getClaim(String token, Function<Claims, T> function) {
        Claims claims = getAllClaims(token);
        return function.apply(claims);
    }

    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(this.getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
