package tests;

import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

public class TaskManagerTest {

    static Playwright playwright;
    static Browser browser;
    Page page;

    private final String BASE_URL = "https://harsha-chikkala.github.io/Task-manager-e2e-ci/";

    @BeforeAll
    static void launchBrowser() {
        playwright = Playwright.create();
        browser = playwright.webkit().launch(
                new BrowserType.LaunchOptions().setHeadless(true)
        );
    }

    @AfterAll
    static void closeBrowser() {
        browser.close();
        playwright.close();
    }

    @BeforeEach
    void createPage() {
        page = browser.newPage();
        page.navigate(BASE_URL);
    }

    @AfterEach
    void closePage() {
        page.close();
    }

    // 1️⃣ Verify Home Page Loads
    @Test
    void verifyHomePageLoads() {
        assertTrue(page.title().contains("Task Manager"));
    }

    // 2️⃣ Navigation Test
    @Test
    void verifyNavigationToTasksPage() {
        page.click("text=Tasks");
        assertTrue(page.locator("#tasks").isVisible());
    }

    // 3️⃣ Add Task Flow
    @Test
    void verifyAddTaskFlow() {
        page.click("text=Tasks");

        page.fill("#taskInput", "Learn CI Pipeline");
        page.click("#addTaskBtn");

        page.waitForSelector("text=Learn CI Pipeline");

        assertTrue(page.locator("text=Learn CI Pipeline").isVisible());
    }

    // 4️⃣ Search Functionality
    @Test
    void verifySearchTask() {
        page.click("text=Tasks");

        page.fill("#taskInput", "Playwright Testing");
        page.click("#addTaskBtn");

        page.fill("#searchInput", "Playwright");

        assertTrue(page.locator("text=Playwright Testing").isVisible());
    }

    // 5️⃣ Filter Completed Tasks
    @Test
    void verifyFilterCompleted() {
        page.click("text=Tasks");

        page.fill("#taskInput", "Complete Me");
        page.click("#addTaskBtn");

        page.waitForSelector("text=Complete Me");

        // Click checkbox near the task text
        Locator taskItem = page.locator("text=Complete Me").locator("..");
        taskItem.locator("input[type=checkbox]").check();

        // Click completed filter
        page.click("button[data-filter='completed']");

        page.waitForTimeout(1000);

        assertTrue(page.locator("text=Complete Me").isVisible());
    }


    // 6️⃣ Delete All Modal Test
    @Test
    void verifyDeleteAllTasks() {
        page.click("text=Tasks");

        page.fill("#taskInput", "Task 1");
        page.click("#addTaskBtn");

        page.click("#deleteAllBtn");

        assertTrue(page.locator("#modal").isVisible());

        page.click("#confirmDelete");

        page.waitForSelector("#emptyState");

        assertTrue(page.locator("#emptyState").isVisible());
    }
}
