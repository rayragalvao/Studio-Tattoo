package hub.orcana.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class GerenciadorTokenJwt {

    @Value("${orcana.jwt.secret}")
    private String secret;

    @Value("${orcana.jwt.validity}")
    private long jwtTokenValidity;

    public String getUsernameFromToken(String token) {
        return getClaimForToken(token, Claims::getSubject);
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimForToken(token, Claims::getExpiration);
    }

    public String gerarToken(final Authentication authentication) {
        final String authorities = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(Collectors.joining(","));

        return Jwts.builder().setSubject(authentication.getName())
                .signWith(parseSecret()).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtTokenValidity * 1000))
                .compact();
    }

    public <T> T getClaimForToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date(System.currentTimeMillis()));
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(parseSecret())
                .build()
                .parseClaimsJws(token).getBody();
    }

    private SecretKey parseSecret() {
        return Keys.hmacShaKeyFor(this.secret.getBytes(StandardCharsets.UTF_8));
    }
}