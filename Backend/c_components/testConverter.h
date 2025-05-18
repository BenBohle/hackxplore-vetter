#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>

typedef struct {
    char program_name[256];
    int exit_code;
    char failure_reason[256];
    int pid_failure;
    int related_pid;
    long timestamp;
} FailureData;

char *jsonConverter(FailureData *emp);
void sendJSONToServer(const char *json_data);