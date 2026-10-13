package com.abysslearn.backend.repository

import com.abysslearn.backend.model.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): Optional<User>
    fun existsByEmail(email: String): Boolean
}

@Repository
interface OceanZoneRepository : JpaRepository<OceanZone, Long>

@Repository
interface CreatureRepository : JpaRepository<Creature, Long> {
    fun findByZoneName(zoneName: String): List<Creature>
}

@Repository
interface QuizQuestionRepository : JpaRepository<QuizQuestion, Long>

@Repository
interface QuizProgressRepository : JpaRepository<QuizProgress, Long> {
    fun findByUserIdOrderByCompletedAtDesc(userId: Long): List<QuizProgress>

    @Query("SELECT MAX(qp.score) FROM QuizProgress qp WHERE qp.userId = :userId")
    fun findMaxScoreByUserId(userId: Long): Int?

    @Query("SELECT AVG(qp.percentage) FROM QuizProgress qp WHERE qp.userId = :userId")
    fun findAvgPercentageByUserId(userId: Long): Double?
}
