import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { Task, Comment, Attachment } from '../models/task.model';
import { User } from '../models/user.model';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from "@angular/forms";
import { DatePipe, NgClass, NgForOf, NgIf, TitleCasePipe } from "@angular/common";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    DatePipe,
    NgClass,
    TitleCasePipe,
    CdkDrag,
    CdkDropList,
    NgIf
  ],
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedTask: Task | null = null;
  searchTerm: string = '';
  filterStatus: string = 'all';
  filterPriority: string = 'all';
  newCommentText: string = '';
  selectedFile: File | null = null;
  currentUser: User | null = null;
  showCreateTaskForm: boolean = false;
  users: User[] = [];

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadCurrentUser();
    this.loadUsers();
  }

  async loadTasks() {
    try {
      this.tasks = await this.taskService.getAllTasks();
      console.log('Loaded tasks:', this.tasks);
      this.applyFilters();
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  }

  async loadCurrentUser() {
    try {
      this.currentUser = await this.userService.getUserProfile();
    } catch (error) {
      console.error('Failed to load current user:', error);
    }
  }

  async loadUsers() {
    try {
      this.users = await this.userService.getUsers();
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  async addComment() {
    if (this.selectedTask !== null && this.newCommentText.trim() && this.currentUser) {
      const newComment: Comment = {
        id: 0,
        text: this.newCommentText,
        author: `${this.currentUser.firstname} ${this.currentUser.lastname}`,
        createdAt: new Date().toISOString(),
        taskId: this.selectedTask.id
      };

      console.log('New Comment:', newComment);

      this.selectedTask.comments = this.selectedTask.comments || [];
      this.selectedTask.comments.push(newComment);
      this.newCommentText = '';

      try {
        const savedComment = await this.taskService.addComment(newComment);
        const commentIndex = this.selectedTask.comments.findIndex(comment => comment.text === newComment.text && comment.author === newComment.author);
        if (commentIndex !== -1) {
          this.selectedTask.comments[commentIndex].id = savedComment.id;
        }
        await this.updateTask(this.selectedTask);
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async uploadAttachment() {
    if (this.selectedTask !== null && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        const newAttachment = await this.taskService.uploadAttachment(formData, this.selectedTask.id);
        this.selectedTask.attachments = this.selectedTask.attachments || [];
        this.selectedTask.attachments.push(newAttachment);
        this.selectedFile = null;
        await this.updateTask(this.selectedTask);
      } catch (error) {
        console.error('Failed to upload attachment:', error);
      }
    }
  }

  applyFilters() {
    if (!Array.isArray(this.tasks)) {
      console.error('this.tasks is not an array:', this.tasks);
      return;
    }

    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.filterStatus === 'all' || task.status === this.filterStatus;
      const matchesPriority = this.filterPriority === 'all' || task.priority === this.filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  selectTask(task: Task) {
    this.selectedTask = task;
  }

  deselectTask() {
    this.selectedTask = null;
  }

  async createTask(taskData: { title: string, description: string, priority: 'high' | 'medium' | 'low', assignee: string, dueDate: string }) {
    const newTask: Task = {
      ...taskData,
      id: 0,
      status: 'pending',
      assigneeEmail: this.getAssigneeEmail(taskData.assignee),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      attachments: []
    };

    try {
      const createdTask = await this.taskService.createTask(newTask);
      this.tasks.push(createdTask);
      this.applyFilters();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  }

  getAssigneeEmail(assignee: string): string {
    const user = this.users.find(u => `${u.firstname} ${u.lastname}` === assignee);
    return user ? user.email : '';
  }

  async updateTask(task: Task) {
    try {
      const updatedTask = await this.taskService.updateTask(task.id, task);
      const index = this.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
        this.applyFilters();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }

  async deleteTask(taskId: number) {
    try {
      await this.taskService.deleteTask(taskId);
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      this.applyFilters();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }

  onSearchTermChange() {
    this.applyFilters();
  }

  onFilterStatusChange() {
    this.applyFilters();
  }

  onFilterPriorityChange() {
    this.applyFilters();
  }

  getTasksByStatus(status: string): Task[] {
    return this.filteredTasks.filter(task => task.status === status);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const task = event.container.data[event.currentIndex];
      task.status = event.container.id as 'pending' | 'in-progress' | 'completed';
      this.updateTask(task).catch(error => console.error('Failed to update task status:', error));
    }
  }
}
