package tests;

import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;

public class TaskManagerTest {

    static Playwright playwright;
    static Browser browser;
    Page page;

    @BeforeAll
    static void launchBrowser() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch(
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

        String filePath = Paths.get("index.html")
                .toAbsolutePath()
                .toUri()
                .toString();

        page.navigate(filePath);
    }

    @AfterEach
    void closePage() {
        page.close();
    }

    @Test
    void verifyHomePageLoads() {
        assertTrue(page.title().contains("Task Manager"));
    }

    @Test
    void verifyNavigationToTasksPage() {
        page.click("text=Tasks");
        assertTrue(page.locator("#tasks").isVisible());
    }

    @Test
    void verifyAddTaskFlow() {
        page.click("text=Tasks");
        page.fill("#taskInput", "Learn CI Pipeline");
        page.click("#addTaskBtn");
        page.waitForSelector("text=Learn CI Pipeline");
        assertTrue(page.locator("text=Learn CI Pipeline").isVisible());
    }

    @Test
    void verifySearchTask() {
        page.click("text=Tasks");
        page.fill("#taskInput", "Playwright Testing");
        page.click("#addTaskBtn");
        page.fill("#searchInput", "Playwright");
        assertTrue(page.locator("text=Playwright Testing").isVisible());
    }

    @Test
    void verifyFilterCompleted() {
        page.click("text=Tasks");
        page.fill("#taskInput", "Complete Me");
        page.click("#addTaskBtn");
        page.waitForSelector("text=Complete Me");

        Locator taskItem = page.locator("text=Complete Me").locator("..");
        taskItem.locator("input[type=checkbox]").check();

        page.click("button[data-filter='completed']");
        page.waitForTimeout(1000);

        assertTrue(page.locator("text=Complete Me").isVisible());
    }

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
