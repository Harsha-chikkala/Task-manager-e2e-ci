/**
 * ========================================
 * Task Manager - script.js
 * ========================================
 * This file handles all the JavaScript functionality for the Task Manager app.
 * No frameworks or libraries used - pure vanilla JavaScript.
 */

// ========================================
// DOM Selection - Get references to all needed elements
// ========================================

// Navigation elements
const navLinks = document.querySelectorAll('.nav-links a');
const pageSections = document.querySelectorAll('.page-section');

// Task elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const deleteAllBtn = document.getElementById('deleteAllBtn');

// Search and filter elements
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.btn-filter');

// Stats elements
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

// Modal elements
const modal = document.getElementById('modal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');

// ========================================
// State Management - Store tasks and filter state
// ========================================
let tasks = [];
let currentFilter = 'all'; // 'all', 'pending', or 'completed'

// ========================================
// Page Navigation Functions
// ========================================

/**
 * Navigate to a specific page by updating section visibility
 * @param {string} pageId - The ID of the page to navigate to
 */
function navigateTo(pageId) {
    // Hide all sections
    pageSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation link active state
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });
    
    // Update stats when navigating to home or tasks page
    if (pageId === 'home' || pageId === 'tasks') {
        updateStats();
    }
}

// ========================================
// Event Listeners for Navigation
// ========================================

// Add click event listeners to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        const page = link.dataset.page;
        navigateTo(page);
    });
});

// ========================================
// Task Management Functions
// ========================================

/**
 * Add a new task to the tasks array and update the display
 */
function addTask() {
    // Get the task text and trim whitespace
    const taskText = taskInput.value.trim();
    
    // Validate input - don't allow empty tasks
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create a new task object
    const newTask = {
        id: Date.now(), // Use timestamp as unique ID
        text: taskText,
        completed: false
    };
    
    // Add task to the array
    tasks.push(newTask);
    
    // Clear the input field
    taskInput.value = '';
    
    // Save to localStorage for persistence
    saveTasks();
    
    // Update the task list display
    renderTasks();
    
    // Update the statistics
    updateStats();
}

/**
 * Delete a specific task by its ID
 * @param {number} taskId - The ID of the task to delete
 */
function deleteTask(taskId) {
    // Filter out the task with the matching ID
    tasks = tasks.filter(task => task.id !== taskId);
    
    // Save to localStorage for persistence
    saveTasks();
    
    // Update the task list display
    renderTasks();
    
    // Update the statistics
    updateStats();
}

/**
 * Toggle the completion status of a task
 * @param {number} taskId - The ID of the task to toggle
 */
function toggleTaskCompletion(taskId) {
    // Find the task and toggle its completed status
    tasks.forEach(task => {
        if (task.id === taskId) {
            task.completed = !task.completed;
        }
    });
    
    // Save to localStorage for persistence
    saveTasks();
    
    // Update the task list display
    renderTasks();
    
    // Update the statistics
    updateStats();
}

/**
 * Delete all tasks after confirmation
 */
function deleteAllTasks() {
    // Clear the tasks array
    tasks = [];
    
    // Save to localStorage for persistence
    saveTasks();
    
    // Update the task list display
    renderTasks();
    
    // Update the statistics
    updateStats();
    
    // Close the modal
    closeModal();
}

// ========================================
// Render Functions - Display tasks in the DOM
// ========================================

/**
 * Render all tasks to the task list container
 */
function renderTasks() {
    // Get filtered tasks based on search and filter
    const filteredTasks = getFilteredTasks();
    
    // Clear existing tasks
    taskList.innerHTML = '';
    
    // Show/hide empty state message
    // Show empty state only when no tasks exist at all (not filtered)
    if (tasks.length === 0) {
        emptyState.innerHTML = '<p>No tasks yet. Add your first task above!</p>';
        emptyState.style.display = 'block';
    } else if (filteredTasks.length === 0) {
        emptyState.innerHTML = '<p>No tasks match your search/filter!</p>';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
    
    // Create and append task cards for each filtered task
    filteredTasks.forEach(task => {
        const taskCard = createTaskCard(task);
        taskList.appendChild(taskCard);
    });
}

/**
 * Create a task card DOM element
 * @param {Object} task - The task object
 * @returns {HTMLElement} - The task card element
 */
function createTaskCard(task) {
    // Create the task card container
    const card = document.createElement('div');
    card.className = `task-card ${task.completed ? 'completed' : ''}`;
    
    // Create checkbox for marking completion
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
    
    // Create the task text span
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    // Create actions container
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    actions.appendChild(deleteBtn);
    
    // Assemble the card
    card.appendChild(checkbox);
    card.appendChild(taskText);
    card.appendChild(actions);
    
    return card;
}

// ========================================
// Statistics Functions
// ========================================

/**
 * Update the task count statistics on the home page
 */
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    // Update the DOM elements
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

// ========================================
// Modal Functions
// ========================================

/**
 * Open the delete confirmation modal
 */
function openModal() {
    modal.classList.add('show');
}

/**
 * Close the delete confirmation modal
 */
function closeModal() {
    modal.classList.remove('show');
}

// ========================================
// LocalStorage Functions - Persist data
// ========================================

/**
 * Save tasks to localStorage for data persistence
 */
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Load tasks from localStorage when the app starts
 */
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// ========================================
// Search and Filter Functions
// ========================================

/**
 * Filter tasks based on current filter and search term
 * @returns {Array} - Filtered array of tasks
 */
function getFilteredTasks() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    return tasks.filter(task => {
        // Apply search filter
        const matchesSearch = task.text.toLowerCase().includes(searchTerm);
        
        // Apply status filter
        let matchesFilter = true;
        if (currentFilter === 'pending') {
            matchesFilter = !task.completed;
        } else if (currentFilter === 'completed') {
            matchesFilter = task.completed;
        }
        
        return matchesSearch && matchesFilter;
    });
}

/**
 * Set the current filter and update display
 * @param {string} filter - The filter type: 'all', 'pending', or 'completed'
 */
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active button state
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    // Re-render tasks with new filter
    renderTasks();
}

// ========================================
// Event Listeners Setup
// ========================================

// Add task button click
addTaskBtn.addEventListener('click', addTask);

// Allow pressing Enter key to add task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Delete all button click - opens modal
deleteAllBtn.addEventListener('click', openModal);

// Modal confirm delete button
confirmDeleteBtn.addEventListener('click', deleteAllTasks);

// Modal cancel button
cancelDeleteBtn.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Search input - filter as user types
searchInput.addEventListener('input', () => {
    renderTasks();
});

// Filter buttons - switch between All/Pending/Completed
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

// ========================================
// Initialize the App
// ========================================

/**
 * Initialize the application when the page loads
 */
function init() {
    // Load saved tasks from localStorage
    loadTasks();
    
    // Render all tasks
    renderTasks();
    
    // Update statistics
    updateStats();
    
    // Show home page by default
    navigateTo('home');
}

// Run initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

