package com.abysslearn.backend.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

data class ErrorResponse(val error: String, val message: String)

class ResourceNotFoundException(message: String) : RuntimeException(message)
class DuplicateEmailException(message: String) : RuntimeException(message)
class InvalidCredentialsException(message: String) : RuntimeException(message)

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException::class)
    fun handleNotFound(ex: ResourceNotFoundException): ResponseEntity<ErrorResponse> =
        ResponseEntity(ErrorResponse("NOT_FOUND", ex.message ?: "Resource not found"), HttpStatus.NOT_FOUND)

    @ExceptionHandler(DuplicateEmailException::class)
    fun handleDuplicate(ex: DuplicateEmailException): ResponseEntity<ErrorResponse> =
        ResponseEntity(ErrorResponse("CONFLICT", ex.message ?: "Email already exists"), HttpStatus.CONFLICT)

    @ExceptionHandler(InvalidCredentialsException::class)
    fun handleInvalidCreds(ex: InvalidCredentialsException): ResponseEntity<ErrorResponse> =
        ResponseEntity(ErrorResponse("UNAUTHORIZED", ex.message ?: "Invalid credentials"), HttpStatus.UNAUTHORIZED)

    @ExceptionHandler(Exception::class)
    fun handleGeneral(ex: Exception): ResponseEntity<ErrorResponse> =
        ResponseEntity(ErrorResponse("INTERNAL_ERROR", ex.message ?: "An unexpected error occurred"), HttpStatus.INTERNAL_SERVER_ERROR)
}
