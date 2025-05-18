#include "testConverter.h"
#include "cJSON.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>

char *jsonConverter(FailureData *emp) {
    if (!emp) return NULL;

    cJSON *json = cJSON_CreateObject();
    if (!json) return NULL;

    cJSON_AddNumberToObject(json, "timestamp", emp->timestamp);
    cJSON_AddStringToObject(json, "program_name", emp->program_name);
    cJSON_AddNumberToObject(json, "exit_code", emp->exit_code);
    cJSON_AddStringToObject(json, "failure_reason", emp->failure_reason);
    cJSON_AddNumberToObject(json, "pid_failure", emp->pid_failure);
    cJSON_AddNumberToObject(json, "related_pid", emp->related_pid);

    char *json_str = cJSON_PrintUnformatted(json);
    cJSON_Delete(json);
    return json_str;
}

void sendJSONToServer(const char *json_data) {
    CURL *curl = curl_easy_init();
    if (!curl) return;

    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");

    curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:3000/api/failure-data");
    curl_easy_setopt(curl, CURLOPT_POST, 1L);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data);
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

    CURLcode res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
        fprintf(stderr, "Failed to send JSON: %s\n", curl_easy_strerror(res));
    }

    curl_easy_cleanup(curl);
    curl_slist_free_all(headers);
}
