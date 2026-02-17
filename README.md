# Task Manager – E2E Automation with CI Pipeline

🚀 Project Overview

This project demonstrates a complete End-to-End (E2E) Automation Pipeline built using:

- HTML, CSS, JavaScript (Vanilla) – Frontend application
- Playwright (Java) – E2E Automation Testing
- Maven – Build & Dependency Management
- GitHub Actions – Continuous Integration (CI)
- GitHub Pages – Application Deployment

The pipeline automatically runs E2E tests on every push to the main branch.

🌐 Live Application

🔗 Deployed via GitHub Pages

https://harsha-chikkala.github.io/Task-manager-e2e-ci/

🏗 Architecture

```
Frontend App (HTML/CSS/JS)
        ↓
Playwright Java Tests
        ↓
Maven Build
        ↓
GitHub Actions CI
        ↓
Automatic Test Execution on Push
```

📂 Project Structure

```
task-manager-e2e-ci/
│
├── index.html
├── style.css
├── script.js
│
├── pom.xml
├── src/
│   └── test/
│       └── java/
│           └── tests/
│               └── TaskManagerTest.java
│
└── .github/
    └── workflows/
        └── playwright.yml
```

🧩 Application Features

✅ Core Features

- Add Tasks
- Delete Individual Tasks
- Delete All (with confirmation modal)
- Mark Tasks as Completed
- Task Count (Total / Completed / Pending)
- Page Navigation (Home / Tasks / About)
- LocalStorage Persistence

🚀 Advanced UI Features

- Real-time Search
- Filter Tasks (All / Pending / Completed)
- Smart Empty State Messages
- Responsive Design
- Modal Confirmation System

🧪 E2E Test Coverage

The Playwright automation suite covers:

| Test Case | Description |
|-----------|-------------|
| Home Page Load | Verifies application loads correctly |
| Navigation | Validates page switching |
| Add Task | Confirms task creation flow |
| Search | Validates real-time search functionality |
| Filter | Tests completed/pending filtering |
| Delete All | Verifies modal confirmation behavior |

⚙️ Tech Stack

**Frontend**
- HTML5
- CSS3
- Vanilla JavaScript

**Automation**
- Playwright (Java)
- JUnit 5

**CI/CD**
- GitHub Actions
- Maven

🧠 Key Engineering Decisions

✅ **Cross-Platform File Navigation**

CI runs in a Linux environment.
Tests use:

```java
Paths.get("index.html").toAbsolutePath().toUri().toString();
```

to ensure compatibility across:
- macOS
- Linux (GitHub Runner)
- Windows

✅ **Headless Browser in CI**

CI runs with:

```java
.setHeadless(true)
```

to support non-GUI environments.

✅ **Isolated Browser Lifecycle**

- @BeforeAll → Launch Browser
- @BeforeEach → Create New Page
- @AfterEach → Close Page
- @AfterAll → Close Browser

Ensures clean test execution.

🔄 CI Workflow

Workflow File: `.github/workflows/playwright.yml`

**Trigger Conditions**
- On push to main
- Manual trigger (workflow_dispatch)

**Pipeline Steps**
1. Checkout repository
2. Setup Java 17
3. Build Maven project
4. Install Playwright browsers
5. Run E2E tests
6. Fail build if any test fails

🟢 CI Status

Add this badge to the top of your README:

```
![CI](https://github.com/<your-username>/task-manager-e2e-ci/actions/workflows/playwright.yml/badge.svg)
```

🛠 How to Run Locally

**1️⃣ Clone Repository**
```bash
git clone https://github.com/<your-username>/task-manager-e2e-ci.git
cd task-manager-e2e-ci
```

**2️⃣ Install Playwright Browsers**
```bash
mvn exec:java -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install"
```

**3️⃣ Run Tests**
```bash
mvn clean test
```

🏆 What This Project Demonstrates

- ✔ Frontend Development
- ✔ Automation Engineering
- ✔ CI/CD Integration
- ✔ Cross-Platform Compatibility
- ✔ Real-World Debugging
- ✔ Git Workflow Management

📈 Future Improvements

- Implement Page Object Model (POM)
- Add parallel browser execution
- Upload test reports as CI artifacts
- Add branch protection rules
- Add Dockerized execution
- Add Pull Request validation pipeline

