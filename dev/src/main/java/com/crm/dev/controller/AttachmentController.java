package com.crm.dev.controller;

import com.crm.dev.models.Attachment;
import com.crm.dev.models.Task;
import com.crm.dev.repository.TaskRepository;
import com.crm.dev.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/attachments")
@CrossOrigin(origins = "http://localhost:4200")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    @Autowired
    private TaskRepository taskRepository;

    @PostMapping
    public ResponseEntity<Attachment> uploadAttachment(@RequestParam("file") MultipartFile file,
                                                       @RequestParam("taskId") Long taskId) {
        try {
            // Create a file in a local directory
            File convertFile = new File("uploads/" + file.getOriginalFilename());
            convertFile.createNewFile();
            FileOutputStream fout = new FileOutputStream(convertFile);
            fout.write(file.getBytes());
            fout.close();

            // Find the task by id
            Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));

            // Create a new attachment and link it to the task
            Attachment attachment = new Attachment();
            attachment.setFilename(file.getOriginalFilename());
            attachment.setFileUrl(convertFile.getAbsolutePath());
            attachment.setTask(task);

            Attachment savedAttachment = attachmentService.createAttachment(attachment);
            return new ResponseEntity<>(savedAttachment, HttpStatus.CREATED);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
