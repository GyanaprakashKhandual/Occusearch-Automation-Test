package tests;

import java.net.MalformedURLException;

import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import io.appium.java_client.AppiumDriver;
import utils.DriverManager;

public class OpenAppTest {
    private AppiumDriver driver;

    @BeforeClass
    public void setUp() throws MalformedURLException {
        driver = DriverManager.getDriver();
        System.out.println("App launched successfully on device!");
    }

    @Test
    public void testOpenApp() {
        // Just validate driver is not null (basic test)
        assert driver != null : "Driver is null. App not launched!";
        System.out.println("Occusearch app is running on the device!");
    }

    @AfterClass
    public void tearDown() {
        DriverManager.quitDriver();
        System.out.println("App closed and driver quit successfully.");
    }
}
