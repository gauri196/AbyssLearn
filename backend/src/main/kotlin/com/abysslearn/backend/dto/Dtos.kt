package com.abysslearn.backend.dto

// ---- Auth DTOs ----
data class SignupRequest(
    val name: String,
    val email: String,
    val password: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class AuthResponse(
    val token: String,
    val id: Long,
    val name: String,
    val email: String,
    val role: String
)

// ---- OceanZone DTOs ----
data class OceanZoneRequest(
    val name: String,
    val minDepth: Int,
    val maxDepth: Int,
    val description: String,
    val temperature: String,
    val pressure: String,
    val organisms: String,
    val interestingFact: String
)

data class OceanZoneResponse(
    val id: Long,
    val name: String,
    val minDepth: Int,
    val maxDepth: Int,
    val description: String,
    val temperature: String,
    val pressure: String,
    val organisms: String,
    val interestingFact: String
)

// ---- Creature DTOs ----
data class CreatureRequest(
    val name: String,
    val scientificName: String,
    val imageUrl: String,
    val depthRange: String,
    val habitat: String,
    val adaptations: String,
    val description: String,
    val zoneName: String
)

data class CreatureResponse(
    val id: Long,
    val name: String,
    val scientificName: String,
    val imageUrl: String,
    val depthRange: String,
    val habitat: String,
    val adaptations: String,
    val description: String,
    val zoneName: String
)

// ---- Quiz DTOs ----
data class QuizQuestionResponse(
    val id: Long,
    val question: String,
    val optionA: String,
    val optionB: String,
    val optionC: String,
    val optionD: String
)

data class QuizSubmissionRequest(val answers: Map<Long, String>)

data class QuizAnswerResult(
    val questionId: Long,
    val selectedAnswer: String?,
    val correctAnswer: String,
    val isCorrect: Boolean
)

data class QuizSubmissionResponse(
    val score: Int,
    val totalQuestions: Int,
    val percentage: Int,
    val results: List<QuizAnswerResult>
)

// ---- Progress DTOs ----
data class ProgressRequest(
    val score: Int,
    val totalQuestions: Int,
    val percentage: Double
)

data class ProgressResponse(
    val id: Long,
    val userId: Long,
    val score: Int,
    val totalQuestions: Int,
    val percentage: Double,
    val completedAt: String
)

data class ProgressSummary(
    val quizzesCompleted: Int,
    val highestScore: Int,
    val averagePercentage: Double,
    val latestScore: Int,
    val latestPercentage: Double
)

data class MessageResponse(val message: String)
