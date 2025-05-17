#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <curl/curl.h>
#include "testConverter.h"

// Callback function to capture the response body
size_t write_callback(void *ptr, size_t size, size_t nmemb, char *data) {
    size_t total_size = size * nmemb;
    strncat(data, ptr, total_size);  // Append the response data to the buffer
    return total_size;
}

int main() {
    // Initialize libcurl
    CURL *curl;
    CURLcode res;

    // URL to which the request will be sent
    const char *url = "http://localhost:3000/api/failure-data";

    // JSON data to be sent in the body of the POST request
    const char *json_data = jsonConverter();  // Assuming jsonConverter() returns a valid JSON string
    if (json_data == NULL) {
        fprintf(stderr, "Failed to convert data to JSON\n");
        return 1;
    }

    // Initialize the CURL session
    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();

    if (curl) {
        // Set the URL for the request
        curl_easy_setopt(curl, CURLOPT_URL, url);

        // Set the HTTP POST method
        curl_easy_setopt(curl, CURLOPT_POST, 1L);

        // Set the data to be sent in the POST request
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data);

        // Set the content type to application/json
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        // Prepare to capture the response body
        char response_data[2048] = {0};  // Buffer to hold the response
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, response_data);

        // Send the POST request and capture the response
        res = curl_easy_perform(curl);

        // Check if the request was successful
        if (res != CURLE_OK) {
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        } else {
            // Print the response body
            printf("POST request sent successfully.\n");
            printf("Response: %s\n", response_data);
        }

        // Clean up
        curl_easy_cleanup(curl);
        curl_slist_free_all(headers);
    }

    // Clean up libcurl
    curl_global_cleanup();

    // Free the JSON data string
    free((void *)json_data);

    return 0;
}

// install cJSON library using brew:
// brew install cjson
// install libcurl using brew:
// brew install curl
// to compile: 
// gcc -o test testDataSent.c jsonConverter.c -lcurl -I/opt/homebrew/include/cjson -L/opt/homebrew/lib -lcjson
