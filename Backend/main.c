#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <signal.h>
#include <string.h>
#include <errno.h>
#include <time.h>

void log_event(pid_t pid, const char *log_file, const char *event) {
    FILE *log = fopen("monitoring_output.log", "a");
    if (!log) {
        perror("fopen");
        return;
    }

    time_t now = time(NULL);
    char *timestamp = ctime(&now);
    timestamp[strlen(timestamp) - 1] = '\0'; // trim newline

    fprintf(log, "[%s] PID %d: %s (stderr: %s)\n", timestamp, pid, event, log_file);
    fclose(log);
}

int is_process_alive(pid_t pid) {
    return (kill(pid, 0) == 0 || errno == EPERM); // still alive
}

int main(int argc, char *argv[]) {
    if (argc < 4 || (argc - 1) % 3 != 0) {
        fprintf(stderr, "Usage: %s <PID1> <LOG1> <EXIT1> [<PID2> <LOG2> <EXIT2> ...]\n", argv[0]);
        return 1;
    }

    int count = (argc - 1) / 3;

    pid_t *pids = malloc(sizeof(pid_t) * count);
    char **logs = malloc(sizeof(char *) * count);
    char **exits = malloc(sizeof(char *) * count);
    int *active = malloc(sizeof(int) * count);

    for (int i = 0; i < count; i++) {
        pids[i] = atoi(argv[1 + i * 3]);
        logs[i] = argv[2 + i * 3];
        exits[i] = argv[3 + i * 3];
        active[i] = 1;
    }

    int running = count;
    while (running > 0) {
        for (int i = 0; i < count; i++) {
            if (!active[i]) continue;

            if (!is_process_alive(pids[i])) {
                // Read exit code from exit log file
                int code = -1;
                FILE *f = fopen(exits[i], "r");
                if (f) {
                    fscanf(f, "%d", &code);
                    fclose(f);
                }

                char message[256];
                if (code != -1) {
                    snprintf(message, sizeof(message), "Process terminated with exit code %d", code);
                } else {
                    snprintf(message, sizeof(message), "Process terminated (exit code unavailable)");
                }

                log_event(pids[i], logs[i], message);
                active[i] = 0;
                running--;
            }
        }
        usleep(500000); // check every 0.5 sec
    }

    free(pids);
    free(logs);
    free(exits);
    free(active);

    return 0;
}
