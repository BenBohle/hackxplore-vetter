#include "testConverter.h"
#include "cJSON.h"


char *jsonConverter() {
    // Create an example employee
    FailureData emp;
    strcpy(emp.program_name, "TestProgram");
    emp.exit_code = 1;
    strcpy(emp.failure_reason, "PID: 12345= Segmentation Fault");
    emp.pid_failure = 1234;
    emp.related_pid = 5678;
    emp.timestamp = 1617123456;
    // Convert the structure to JSON
    // Initialize cJSON
    cJSON *json = cJSON_CreateObject();
    if (json == NULL) {
        fprintf(stderr, "Failed to create JSON object\n");
        return NULL;
    }
    // Add data to the JSON object
    cJSON_AddStringToObject(json, "program_name", emp.program_name);
    cJSON_AddNumberToObject(json, "exit_code", emp.exit_code);
    cJSON_AddStringToObject(json, "failure_reason", emp.failure_reason);
    cJSON_AddNumberToObject(json, "pid_failure", emp.pid_failure);
    cJSON_AddNumberToObject(json, "related_pid", emp.related_pid);
    cJSON_AddNumberToObject(json, "timestamp", emp.timestamp);


    // Convert JSON object to a string and print it
    char *json_str = cJSON_Print(json);
    if (json_str == NULL) {
        fprintf(stderr, "Failed to print JSON object\n");
        cJSON_Delete(json);
        return NULL;
    }

   
    return json_str;
}
