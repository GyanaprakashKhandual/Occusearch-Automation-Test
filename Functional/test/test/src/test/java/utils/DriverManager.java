package utils;

import java.net.MalformedURLException;
import java.net.URL;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;

public class DriverManager {
    private static AppiumDriver driver;

    @SuppressWarnings("deprecation")
    public static AppiumDriver getDriver() throws MalformedURLException {
        if (driver == null) {
            UiAutomator2Options options = new UiAutomator2Options();
            options.setDeviceName("VIVO V112"); // Your real device name
            options.setPlatformName("Android");
            options.setAutomationName("UiAutomator2");

            // App identifiers for Occusearch
            options.setAppPackage("com.aussizzgroup.occusearch");
            options.setAppActivity("com.aussizzgroup.occusearch.MainActivity");

            // Use Appium 3.x root URL (no /wd/hub)
            driver = new AndroidDriver(new URL("http://127.0.0.1:4723/"), options);
        }
        return driver;
    }

    public static void quitDriver() {
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }
}
