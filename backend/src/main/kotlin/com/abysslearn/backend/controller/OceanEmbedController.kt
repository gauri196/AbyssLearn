package com.abysslearn.backend.controller

import com.abysslearn.backend.model.User
import com.abysslearn.backend.service.OceanEmbedHistoryService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping("/api/oceanembed")
class OceanEmbedController(
    private val historyService: OceanEmbedHistoryService
) {
    @GetMapping("/config")
    fun config(): ResponseEntity<Map<String, Any>> = ResponseEntity.ok(
        mapOf(
            "projectName" to "OceanEmbed",
            "region" to mapOf(
                "latitudeMin" to 5.0,
                "latitudeMax" to 30.0,
                "longitudeMin" to 45.0,
                "longitudeMax" to 105.0
            ),
            "gridResolutionDegrees" to 0.25,
            "temporalResolution" to "daily",
            "inputVariables" to listOf(
                "SST", "SSS", "SSH/SLA", "Surface current U",
                "Surface current V", "Surface wind U", "Surface wind V"
            ),
            "depthsMeters" to listOf(
                0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000
            ),
            "supportedArchitectures" to listOf(
                "CNN", "Vision Transformer", "Autoencoder",
                "Graph Neural Network", "Attention hybrid"
            ),
            "predictionReady" to false,
            "note" to "Configuration only. The current research model must be validated for scientific predictions."
        )
    )

    @GetMapping("/status")
    fun status(): ResponseEntity<Map<String, Any>> = ResponseEntity.ok(
        mapOf(
            "moduleAvailable" to true,
            "modelLoaded" to false,
            "datasetConfigured" to false,
            "independentValidationAvailable" to false,
            "state" to "SETUP_REQUIRED",
            "message" to "Configuration and history are available; model validation remains a separate research task."
        )
    )

    data class SaveHistoryRequest(
        val date: String,
        val latitude: Double,
        val longitude: Double,
        val predictions: List<Map<String, Any?>>
    )

    @PostMapping("/history")
    fun saveHistory(
        @AuthenticationPrincipal user: User?,
        @RequestBody request: SaveHistoryRequest
    ): ResponseEntity<Map<String, Any>> {
        if (user == null || user.id <= 0) {
            return ResponseEntity.status(401).body(
                mapOf("error" to "Authentication required")
            )
        }

        if (request.latitude !in 5.0..30.0 ||
            request.longitude !in 45.0..105.0 ||
            request.predictions.isEmpty()
        ) {
            return ResponseEntity.badRequest().body(
                mapOf("error" to "Invalid coordinates or empty predictions")
            )
        }

        try {
            LocalDate.parse(request.date)
        } catch (_: Exception) {
            return ResponseEntity.badRequest().body(
                mapOf("error" to "Date must use YYYY-MM-DD format")
            )
        }

        return try {
            val id = historyService.savePrediction(
                userId = user.id,
                date = request.date,
                latitude = request.latitude,
                longitude = request.longitude,
                predictions = request.predictions
            )

            ResponseEntity.ok(mapOf("id" to id, "message" to "Prediction history saved"))
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(
                mapOf("error" to "Could not save prediction history")
            )
        }
    }

    @GetMapping("/history")
    fun getHistory(
        @AuthenticationPrincipal user: User?
    ): ResponseEntity<Any> {
        if (user == null || user.id <= 0) {
            return ResponseEntity.status(401).body(
                mapOf("error" to "Authentication required")
            )
        }

        return try {
            ResponseEntity.ok(historyService.getHistory(user.id))
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(
                mapOf("error" to "Could not load prediction history")
            )
        }
    }
}