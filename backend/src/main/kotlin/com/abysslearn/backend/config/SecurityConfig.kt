package com.abysslearn.backend.config

import com.abysslearn.backend.security.JwtAuthFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtAuthFilter: JwtAuthFilter,
    @Value("\${app.cors.allowed-origins:http://localhost:5173}") private val allowedOrigins: String
) {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors { it.configurationSource(corsConfigurationSource()) }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/oceanembed/config", "/api/oceanembed/status").permitAll()
                    .requestMatchers("/api/oceanembed/history", "/api/oceanembed/history/**").authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/zones/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/creatures/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/quizzes/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/quizzes/submit").permitAll()
                    // Content management is an administrator-only capability.
                    .requestMatchers(HttpMethod.POST, "/api/zones", "/api/zones/**", "/api/creatures", "/api/creatures/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/zones", "/api/zones/**", "/api/creatures", "/api/creatures/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/zones", "/api/zones/**", "/api/creatures", "/api/creatures/**").hasRole("ADMIN")
                    .anyRequest().authenticated()
            }
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val config = CorsConfiguration()
        config.allowedOrigins = allowedOrigins.split(",").map { it.trim() }.filter { it.isNotEmpty() }
        config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        config.allowedHeaders = listOf("*")
        config.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)
        return source
    }
}
