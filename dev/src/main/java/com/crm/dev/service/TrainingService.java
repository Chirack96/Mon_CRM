package com.crm.dev.service;

import com.crm.dev.models.Training;
import com.crm.dev.models.User;
import com.crm.dev.models.UserTraining;
import com.crm.dev.repository.TrainingRepository;
import com.crm.dev.repository.UserRepository;
import com.crm.dev.repository.UserTrainingRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainingService {

    private static final Logger logger = LoggerFactory.getLogger(TrainingService.class);

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserTrainingRepository userTrainingRepository;

    public List<Training> getAllTrainings() {
        return trainingRepository.findAll();
    }

    public Training getTrainingById(Long id) {
        return trainingRepository.findById(id).orElseThrow(() -> new RuntimeException("Training not found"));
    }

    public Training createTraining(Training training) {
        logger.info("Creating new training with title: {}", training.getTitle());
        return trainingRepository.save(training);
    }

    public Training updateTraining(Long id, Training trainingDetails) {
        Training training = trainingRepository.findById(id).orElseThrow(() -> new RuntimeException("Training not found"));
        logger.info("Updating training with ID: {}", id);
        training.setTitle(trainingDetails.getTitle());
        training.setDescription(trainingDetails.getDescription());
        training.setDate(trainingDetails.getDate());
        return trainingRepository.save(training);
    }

    public void deleteTraining(Long id) {
        Training training = trainingRepository.findById(id).orElseThrow(() -> new RuntimeException("Training not found"));
        logger.info("Deleting training with ID: {}", id);
        trainingRepository.delete(training);
    }

    @Transactional
    public void toggleEnrollment(Long trainingId, Long userId) {
        logger.info("Toggling enrollment for user with ID: {} in training with ID: {}", userId, trainingId);

        // Vérifie si l'utilisateur est déjà inscrit à la formation
        if (userTrainingRepository.existsByUserIdAndTrainingId(userId, trainingId)) {
            logger.info("User with ID: {} is already enrolled in training with ID: {}. Removing enrollment.", userId, trainingId);
            userTrainingRepository.deleteByUserIdAndTrainingId(userId, trainingId);
            logger.info("Enrollment removed for user with ID: {} in training with ID: {}", userId, trainingId);
        } else {
            // Cherche l'utilisateur et la formation
            User user = userRepository.findById(userId).orElseThrow(() -> {
                logger.error("User not found with ID: {}", userId);
                return new RuntimeException("User not found");
            });
            Training training = trainingRepository.findById(trainingId).orElseThrow(() -> {
                logger.error("Training not found with ID: {}", trainingId);
                return new RuntimeException("Training not found");
            });

            logger.info("User with ID: {} is not enrolled in training with ID: {}. Adding enrollment.", userId, trainingId);

            // Crée une nouvelle inscription
            UserTraining userTraining = new UserTraining();
            userTraining.setUser(user);
            userTraining.setTraining(training);
            userTrainingRepository.save(userTraining);
            logger.info("Enrollment added for user with ID: {} in training with ID: {}", userId, trainingId);
        }
    }

    public List<Training> getUserTrainings(Long userId) {
        List<UserTraining> userTrainings = userTrainingRepository.findByUserId(userId);
        return userTrainings.stream()
                .map(UserTraining::getTraining)
                .collect(Collectors.toList());
    }


}
