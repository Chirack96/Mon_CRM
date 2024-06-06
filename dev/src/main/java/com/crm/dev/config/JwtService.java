package com.crm.dev.config;

import com.crm.dev.models.User;
import com.crm.dev.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;

@Service
public class JwtService {
    // Clé d'encryption doit être longue et sécurisée, ici juste pour exemple
    private final String EncryptionKey = "608f36e92dc66d933f06e6371493cb4fc05b1aa8f8de64014732472303a7c";

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> generate(String email, Long id, Collection<? extends GrantedAuthority> authorities) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        // Passer l'ID de l'utilisateur à la méthode generateJwt
        return generateJwt(user.getEmail(), user.getFirstname(), user.getId(), user.getAuthorities());
    }

    public Map<String, Object> generateJwt(String email, String firstname, Long userId, Collection<? extends GrantedAuthority> authorities) {
        final long currentTimeMillis = System.currentTimeMillis();
        final Date issuedAt = new Date(currentTimeMillis);
        final Date expiration = new Date(currentTimeMillis + 30 * 60 * 1000); // Expiration après 30 minutes

        List<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        Claims claims = Jwts.claims().setSubject(email);
        claims.put("name", firstname);
        claims.put("userId", userId);  // Ajout de l'ID de l'utilisateur dans le token
        claims.put("roles", roles);

        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();

        return Map.of("token", token);
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String extractUsername(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    private Date extractExpiration(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    Long extractUserId(String token) {
        return getClaimFromToken(token, claims -> claims.get("userId", Long.class));
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(EncryptionKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
