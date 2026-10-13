package com.abysslearn.backend.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.Firestore
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.File
import java.io.FileInputStream

@Configuration
class FirebaseConfig {

    @Bean
    fun firebaseApp(): FirebaseApp {
        val existingApp = FirebaseApp.getApps().firstOrNull()
        if (existingApp != null) {
            return existingApp
        }

        val configuredPath = System.getenv("FIREBASE_CREDENTIALS_PATH")

        val candidates = listOfNotNull(
            configuredPath?.let { File(it) },
            File("backend/firebase-service-account.json"),
            File("firebase-service-account.json")
        )

        val credentialsFile = candidates.firstOrNull { it.isFile }
            ?: error(
                "Firebase credentials not found. Set FIREBASE_CREDENTIALS_PATH " +
                "to the service-account JSON file path."
            )

        val options = FileInputStream(credentialsFile).use { input ->
            FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(input))
                .build()
        }

        return FirebaseApp.initializeApp(options)
    }

    @Bean
    fun firestore(firebaseApp: FirebaseApp): Firestore {
        return FirestoreClient.getFirestore(firebaseApp)
    }
}