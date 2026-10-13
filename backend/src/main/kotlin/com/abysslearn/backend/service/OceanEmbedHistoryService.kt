package com.abysslearn.backend.service

import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Service
import java.util.Date

@Service
class OceanEmbedHistoryService(
    private val firestore: Firestore
) {

    fun savePrediction(
        userId: Long,
        date: String,
        latitude: Double,
        longitude: Double,
        predictions: List<Map<String, Any?>>
    ): String {
        require(userId > 0) { "Valid user ID is required" }
        require(latitude in -90.0..90.0) { "Invalid latitude" }
        require(longitude in -180.0..180.0) { "Invalid longitude" }

        val document = firestore
            .collection("oceanembed_prediction_history")
            .document()

        val record = mapOf(
            "userId" to userId,
            "date" to date,
            "latitude" to latitude,
            "longitude" to longitude,
            "predictions" to predictions,
            "createdAt" to Date()
        )

        document.set(record).get()

        return document.id
    }

    fun getHistory(userId: Long): List<Map<String, Any?>> {
        require(userId > 0) { "Valid user ID is required" }

        return firestore
            .collection("oceanembed_prediction_history")
            .whereEqualTo("userId", userId)
            .get()
            .get()
            .documents
            .map { document ->
                document.data + mapOf("id" to document.id)
            }
    }
}