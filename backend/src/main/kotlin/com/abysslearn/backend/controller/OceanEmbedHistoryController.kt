
package com.abysslearn.backend.controller

import com.abysslearn.backend.model.User
import com.abysslearn.backend.service.OceanEmbedHistoryService
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/oceanembed/history")
class OceanEmbedHistoryController(
    private val historyService: OceanEmbedHistoryService
) {
    data class SaveHistoryRequest(
        val date: String,
        val latitude: Double,
        val longitude: Double,
        val predictions: List<Map<String, Any?>>
    )

    @PostMapping
    fun saveHistory(
        @AuthenticationPrincipal user: User?,
        @RequestBody request: SaveHistoryRequest
    ): Map<String, String> {
        val authenticatedUser = user
            ?: throw ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Please log in first."
            )

        val documentId = historyService.savePrediction(
            userId = authenticatedUser.id,
            date = request.date,
            latitude = request.latitude,
            longitude = request.longitude,
            predictions = request.predictions
        )

        return mapOf(
            "message" to "Prediction saved to Firebase successfully",
            "id" to documentId
        )
    }

    @GetMapping
    fun getHistory(
        @AuthenticationPrincipal user: User?
    ): List<Map<String, Any?>> {
        val authenticatedUser = user
            ?: throw ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Please log in first."
            )

        return historyService.getHistory(authenticatedUser.id)
    }
}
