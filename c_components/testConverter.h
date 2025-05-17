#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>

typedef struct {
    char program_name[50];
    int exit_code;
    char failure_reason[100];
    int pid_failure;
    int related_pid;
    long timestamp;
} FailureData;

char *jsonConverter();