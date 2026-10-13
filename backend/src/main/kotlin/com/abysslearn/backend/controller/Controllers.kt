package com.abysslearn.backend.controller

import com.abysslearn.backend.dto.*
import com.abysslearn.backend.model.User
import com.abysslearn.backend.service.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

// ---- Auth Controller ----
@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/signup")
    fun signup(@RequestBody req: SignupRequest): ResponseEntity<AuthResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(req))

    @PostMapping("/login")
    fun login(@RequestBody req: LoginRequest): ResponseEntity<AuthResponse> =
        ResponseEntity.ok(authService.login(req))
}

// ---- Ocean Zone Controller ----
@RestController
@RequestMapping("/api/zones")
class OceanZoneController(private val zoneService: OceanZoneService) {

    @GetMapping
    fun getAll(): ResponseEntity<List<OceanZoneResponse>> = ResponseEntity.ok(zoneService.getAll())

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<OceanZoneResponse> =
        ResponseEntity.ok(zoneService.getById(id))

    @PostMapping
    fun create(@RequestBody req: OceanZoneRequest): ResponseEntity<OceanZoneResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(zoneService.create(req))

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody req: OceanZoneRequest): ResponseEntity<OceanZoneResponse> =
        ResponseEntity.ok(zoneService.update(id, req))

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<MessageResponse> {
        zoneService.delete(id)
        return ResponseEntity.ok(MessageResponse("Ocean zone deleted successfully."))
    }
}

// ---- Creature Controller ----
@RestController
@RequestMapping("/api/creatures")
class CreatureController(private val creatureService: CreatureService) {

    @GetMapping
    fun getAll(): ResponseEntity<List<CreatureResponse>> = ResponseEntity.ok(creatureService.getAll())

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<CreatureResponse> =
        ResponseEntity.ok(creatureService.getById(id))

    @PostMapping
    fun create(@RequestBody req: CreatureRequest): ResponseEntity<CreatureResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(creatureService.create(req))

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody req: CreatureRequest): ResponseEntity<CreatureResponse> =
        ResponseEntity.ok(creatureService.update(id, req))

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<MessageResponse> {
        creatureService.delete(id)
        return ResponseEntity.ok(MessageResponse("Creature deleted successfully."))
    }
}

// ---- Quiz Controller ----
@RestController
@RequestMapping("/api/quizzes")
class QuizController(private val quizService: QuizService) {

    @GetMapping
    fun getAll(): ResponseEntity<List<QuizQuestionResponse>> = ResponseEntity.ok(quizService.getAll())

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<QuizQuestionResponse> =
        ResponseEntity.ok(quizService.getById(id))

    @PostMapping("/submit")
    fun submit(@RequestBody req: QuizSubmissionRequest): ResponseEntity<QuizSubmissionResponse> =
        ResponseEntity.ok(quizService.grade(req.answers))
}

// ---- Progress Controller ----
@RestController
@RequestMapping("/api/progress")
class ProgressController(private val progressService: ProgressService) {

    @GetMapping
    fun getSummary(@AuthenticationPrincipal user: User): ResponseEntity<ProgressSummary> =
        ResponseEntity.ok(progressService.getForUser(user.id))

    @GetMapping("/history")
    fun getHistory(@AuthenticationPrincipal user: User): ResponseEntity<List<ProgressResponse>> =
        ResponseEntity.ok(progressService.getHistoryForUser(user.id))

    @PostMapping
    fun save(
        @AuthenticationPrincipal user: User,
        @RequestBody req: ProgressRequest
    ): ResponseEntity<ProgressResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(progressService.save(user.id, req))
}
