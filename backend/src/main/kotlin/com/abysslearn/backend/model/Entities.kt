package com.abysslearn.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val name: String = "",

    @Column(nullable = false, unique = true)
    val email: String = "",

    @Column(nullable = false)
    val password: String = "",

    @Column(nullable = false)
    val role: String = "USER"
)

@Entity
@Table(name = "ocean_zones")
data class OceanZone(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val name: String = "",

    @Column(nullable = false)
    val minDepth: Int = 0,

    @Column(nullable = false)
    val maxDepth: Int = 0,

    @Column(columnDefinition = "TEXT")
    val description: String = "",

    val temperature: String = "",
    val pressure: String = "",
    val organisms: String = "",

    @Column(columnDefinition = "TEXT")
    val interestingFact: String = ""
)

@Entity
@Table(name = "creatures")
data class Creature(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val name: String = "",

    val scientificName: String = "",
    val imageUrl: String = "",
    val depthRange: String = "",
    val habitat: String = "",

    @Column(columnDefinition = "TEXT")
    val adaptations: String = "",

    @Column(columnDefinition = "TEXT")
    val description: String = "",

    val zoneName: String = ""
)

@Entity
@Table(name = "quiz_questions")
data class QuizQuestion(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(columnDefinition = "TEXT", nullable = false)
    val question: String = "",

    val optionA: String = "",
    val optionB: String = "",
    val optionC: String = "",
    val optionD: String = "",
    val correctAnswer: String = ""
)

@Entity
@Table(name = "quiz_progress")
data class QuizProgress(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val userId: Long = 0,

    val score: Int = 0,
    val totalQuestions: Int = 0,
    val percentage: Double = 0.0,

    val completedAt: LocalDateTime = LocalDateTime.now()
)
