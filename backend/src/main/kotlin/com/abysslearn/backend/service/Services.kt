package com.abysslearn.backend.service

import com.abysslearn.backend.dto.*
import com.abysslearn.backend.exception.DuplicateEmailException
import com.abysslearn.backend.exception.InvalidCredentialsException
import com.abysslearn.backend.exception.ResourceNotFoundException
import com.abysslearn.backend.model.*
import com.abysslearn.backend.repository.*
import com.abysslearn.backend.security.JwtUtils
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.format.DateTimeFormatter

// ---- Auth Service ----
@Service
class AuthService(
    private val userRepo: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtUtils: JwtUtils
) {
    fun signup(req: SignupRequest): AuthResponse {
        if (userRepo.existsByEmail(req.email)) {
            throw DuplicateEmailException("Email '${req.email}' is already registered.")
        }
        val user = userRepo.save(User(
            name = req.name,
            email = req.email,
            password = passwordEncoder.encode(req.password),
            role = "USER"
        ))
        val token = jwtUtils.generateToken(user.email, user.id)
        return AuthResponse(token, user.id, user.name, user.email, user.role)
    }

    fun login(req: LoginRequest): AuthResponse {
        val user = userRepo.findByEmail(req.email)
            .orElseThrow { InvalidCredentialsException("Invalid email or password.") }
        if (!passwordEncoder.matches(req.password, user.password)) {
            throw InvalidCredentialsException("Invalid email or password.")
        }
        val token = jwtUtils.generateToken(user.email, user.id)
        return AuthResponse(token, user.id, user.name, user.email, user.role)
    }
}

// ---- Ocean Zone Service ----
@Service
class OceanZoneService(private val repo: OceanZoneRepository) {

    fun getAll(): List<OceanZoneResponse> = repo.findAll().map { it.toResponse() }

    fun getById(id: Long): OceanZoneResponse = repo.findById(id)
        .orElseThrow { ResourceNotFoundException("Ocean zone with ID $id not found.") }
        .toResponse()

    fun create(req: OceanZoneRequest): OceanZoneResponse = repo.save(OceanZone(
        name = req.name, minDepth = req.minDepth, maxDepth = req.maxDepth,
        description = req.description, temperature = req.temperature,
        pressure = req.pressure, organisms = req.organisms, interestingFact = req.interestingFact
    )).toResponse()

    fun update(id: Long, req: OceanZoneRequest): OceanZoneResponse {
        val existing = repo.findById(id)
            .orElseThrow { ResourceNotFoundException("Ocean zone with ID $id not found.") }
        return repo.save(existing.copy(
            name = req.name, minDepth = req.minDepth, maxDepth = req.maxDepth,
            description = req.description, temperature = req.temperature,
            pressure = req.pressure, organisms = req.organisms, interestingFact = req.interestingFact
        )).toResponse()
    }

    fun delete(id: Long) {
        if (!repo.existsById(id)) throw ResourceNotFoundException("Ocean zone with ID $id not found.")
        repo.deleteById(id)
    }

    private fun OceanZone.toResponse() = OceanZoneResponse(
        id, name, minDepth, maxDepth, description, temperature, pressure, organisms, interestingFact
    )
}

// ---- Creature Service ----
@Service
class CreatureService(private val repo: CreatureRepository) {

    fun getAll(): List<CreatureResponse> = repo.findAll().map { it.toResponse() }

    fun getById(id: Long): CreatureResponse = repo.findById(id)
        .orElseThrow { ResourceNotFoundException("Creature with ID $id not found.") }
        .toResponse()

    fun create(req: CreatureRequest): CreatureResponse = repo.save(Creature(
        name = req.name, scientificName = req.scientificName, imageUrl = req.imageUrl,
        depthRange = req.depthRange, habitat = req.habitat, adaptations = req.adaptations,
        description = req.description, zoneName = req.zoneName
    )).toResponse()

    fun update(id: Long, req: CreatureRequest): CreatureResponse {
        val existing = repo.findById(id)
            .orElseThrow { ResourceNotFoundException("Creature with ID $id not found.") }
        return repo.save(existing.copy(
            name = req.name, scientificName = req.scientificName, imageUrl = req.imageUrl,
            depthRange = req.depthRange, habitat = req.habitat, adaptations = req.adaptations,
            description = req.description, zoneName = req.zoneName
        )).toResponse()
    }

    fun delete(id: Long) {
        if (!repo.existsById(id)) throw ResourceNotFoundException("Creature with ID $id not found.")
        repo.deleteById(id)
    }

    private fun Creature.toResponse() = CreatureResponse(
        id, name, scientificName, imageUrl, depthRange, habitat, adaptations, description, zoneName
    )
}

// ---- Quiz Service ----
@Service
class QuizService(private val repo: QuizQuestionRepository) {

    fun getAll(): List<QuizQuestionResponse> = repo.findAll().map { it.toResponse() }

    fun getById(id: Long): QuizQuestionResponse = repo.findById(id)
        .orElseThrow { ResourceNotFoundException("Quiz question with ID $id not found.") }
        .toResponse()

    fun grade(answers: Map<Long, String>): QuizSubmissionResponse {
        val questions = repo.findAllById(answers.keys).associateBy { it.id }
        val results = answers.mapNotNull { (questionId, selected) ->
            val question = questions[questionId] ?: return@mapNotNull null
            val normalized = selected.trim().uppercase()
            val correct = normalized == question.correctAnswer.trim().uppercase()
            QuizAnswerResult(questionId, selected, question.correctAnswer, correct)
        }
        val total = results.size
        val score = results.count { it.isCorrect }
        return QuizSubmissionResponse(
            score = score,
            totalQuestions = total,
            percentage = if (total == 0) 0 else (score * 100.0 / total).toInt(),
            results = results
        )
    }

    private fun QuizQuestion.toResponse() = QuizQuestionResponse(
        id, question, optionA, optionB, optionC, optionD
    )
}

// ---- Progress Service ----
@Service
class ProgressService(private val repo: QuizProgressRepository) {
    private val formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")

    fun getForUser(userId: Long): ProgressSummary {
        val all = repo.findByUserIdOrderByCompletedAtDesc(userId)
        if (all.isEmpty()) {
            return ProgressSummary(0, 0, 0.0, 0, 0.0)
        }
        val latest = all.first()
        return ProgressSummary(
            quizzesCompleted = all.size,
            highestScore = repo.findMaxScoreByUserId(userId) ?: 0,
            averagePercentage = repo.findAvgPercentageByUserId(userId) ?: 0.0,
            latestScore = latest.score,
            latestPercentage = latest.percentage
        )
    }

    fun getHistoryForUser(userId: Long): List<ProgressResponse> =
        repo.findByUserIdOrderByCompletedAtDesc(userId).map { it.toResponse() }

    fun save(userId: Long, req: ProgressRequest): ProgressResponse {
        val progress = repo.save(QuizProgress(
            userId = userId,
            score = req.score,
            totalQuestions = req.totalQuestions,
            percentage = req.percentage
        ))
        return progress.toResponse()
    }

    private fun QuizProgress.toResponse() = ProgressResponse(
        id, userId, score, totalQuestions, percentage,
        completedAt.format(formatter)
    )
}
