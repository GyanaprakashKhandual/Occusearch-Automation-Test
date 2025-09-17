package tests;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class GetRequestTest {

    @BeforeClass
    public void setup() {
        // Base URI pointing to local server
        RestAssured.baseURI = "http://localhost:5000";
    }

    @Test
    public void testGetRootEndpoint() {
        Response response = RestAssured
                .given()
                .when()
                    .get("/")   // root endpoint
                .then()
                    .statusCode(200)   // validate response status code
                    .extract()
                    .response();

        // Print response body for debugging
        System.out.println("Response Body: " + response.getBody().asString());

        // Example assertion: check response is not empty
        Assert.assertFalse(response.getBody().asString().isEmpty(), "Response should not be empty");
    }
}
