package hub.orcana.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice

public class GlobalHandlerException {
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUsernameNotFoundException(
            UsernameNotFoundException ex) {

        Map<String, String> response = new HashMap<>();
        response.put("message", "Credenciais inválidas");
        response.put("error", "INVALID_CREDENTIALS");

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentialsException(
            BadCredentialsException ex) {

        Map<String, String> response = new HashMap<>();
        response.put("message", "Email ou senha incorretos");
        response.put("error", "INVALID_CREDENTIALS");

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(
            AuthenticationException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Erro de autenticação");
        response.put("error", "AUTHENTICATION_ERROR");

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {

        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        response.put("message", "Dados inválidos");
        response.put("errors", errors);

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(DependenciaNaoEncontradaException.class)
    public ResponseEntity<Map<String, Object>> handleDependenciaNaoEncontrada(
            DependenciaNaoEncontradaException ex, HttpServletRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", HttpStatus.NOT_FOUND.getReasonPhrase());
        body.put("message", ex.getMessage());
        body.put("path", request.getRequestURI());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (ex instanceof ResponseStatusException) {
            org.springframework.http.HttpStatusCode statusCode = ((ResponseStatusException) ex).getStatusCode();
            HttpStatus resolved = (statusCode instanceof HttpStatus) ? (HttpStatus) statusCode : HttpStatus.resolve(statusCode.value());
            status = (resolved != null) ? resolved : HttpStatus.INTERNAL_SERVER_ERROR;
        } else {
            ResponseStatus rs = AnnotationUtils.findAnnotation(ex.getClass(), ResponseStatus.class);
            if (rs != null) {
                status = (rs.code() != HttpStatus.INTERNAL_SERVER_ERROR) ? rs.code() : rs.value();
            }
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", ex.getMessage());
        body.put("path", request.getRequestURI());

        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatusException(
            ResponseStatusException ex, HttpServletRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("status", ex.getStatusCode().value());
        body.put("error", ex.getStatusCode().toString());
        body.put("message", ex.getReason() != null ? ex.getReason() : "Erro interno");
        body.put("path", request.getRequestURI());

        return ResponseEntity.status(ex.getStatusCode()).body(body);
    }
}
