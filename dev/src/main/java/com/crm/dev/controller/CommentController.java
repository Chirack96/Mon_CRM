package com.crm.dev.controller;

import com.crm.dev.models.Comment;
import com.crm.dev.models.Task;
import com.crm.dev.repository.TaskRepository;
import com.crm.dev.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:4200")
public class CommentController {

        @Autowired
        private CommentService commentService;

        @Autowired
        private TaskRepository taskRepository;

    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody Comment comment) {
        try {
            System.out.println("Received Comment: " + comment);

            if (comment.getTaskId() == null) {
                System.out.println("Task ID is null");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Task ID is missing.");
            }

            Long taskId = comment.getTaskId();
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            comment.setTask(task);
            comment.setCreatedAt(new Date());

            Comment savedComment = commentService.createComment(comment);
            return ResponseEntity.ok(savedComment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing request: " + e.getMessage());
        }
    }

}
