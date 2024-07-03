package com.crm.dev.controller;

import com.crm.dev.models.Training;
import com.crm.dev.models.UserTraining;
import com.crm.dev.service.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainings")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class TrainingController {

    @Autowired
    private TrainingService trainingService;

    @GetMapping
    public List<Training> getAllTrainings() {
        return trainingService.getAllTrainings();
    }

    @GetMapping("/{id}")
    public Training getTrainingById(@PathVariable Long id) {
        return trainingService.getTrainingById(id);
    }

    @PostMapping
    public Training createTraining(@RequestBody Training training) {
        return trainingService.createTraining(training);
    }

    @PutMapping("/{id}")
    public Training updateTraining(@PathVariable Long id, @RequestBody Training trainingDetails) {
        return trainingService.updateTraining(id, trainingDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteTraining(@PathVariable Long id) {
        trainingService.deleteTraining(id);
    }

    @PostMapping("/{trainingId}/toggle-enrollment")
    public void toggleEnrollment(@PathVariable Long trainingId, @RequestParam Long userId) {
        trainingService.toggleEnrollment(trainingId, userId);
    }

    @GetMapping("/user/{userId}")
    public List<Training> getUserTrainings(@PathVariable Long userId) {
        return trainingService.getUserTrainings(userId);
    }
  
}
