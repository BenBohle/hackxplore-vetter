#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <signal.h>
#include <string.h>
#include <errno.h>
#include <time.h>
#include "c_components/testConverter.h"

int is_process_alive(pid_t pid) {
    return (kill(pid, 0) == 0 || errno == EPERM);
}

int get_exit_code(const char *exit_file) {
    int code = -1;
    FILE *f = fopen(exit_file, "r");
    if (f) {
        fscanf(f, "%d", &code);
        fclose(f);
    }
    return code;
}

long get_current_timestamp() {
    return (long)time(NULL);
}

int main(int argc, char *argv[]) {
    if (argc < 4 || (argc - 1) % 3 != 0) {
        fprintf(stderr, "Usage: %s <PID1> <LOG1> <EXIT1> [<PID2> <LOG2> <EXIT2> ...]\n", argv[0]);
        return 1;
    }

    int count = (argc - 1) / 3;
    pid_t *pids = malloc(sizeof(pid_t) * count);
    char **exits = malloc(sizeof(char *) * count);
    int *active = malloc(sizeof(int) * count);

    for (int i = 0; i < count; i++) {
        pids[i] = atoi(argv[1 + i * 3]);
        exits[i] = argv[3 + i * 3];
        active[i] = 1;
    }

    int running = count;
    while (running > 0) {
        for (int i = 0; i < count; i++) {
            if (!active[i]) continue;

            if (!is_process_alive(pids[i])) {
                int exit_code = get_exit_code(exits[i]);

                FailureData report;
                snprintf(report.program_name, sizeof(report.program_name), "UnknownProgram");
                snprintf(report.failure_reason, sizeof(report.failure_reason), "PID %d exited with code %d", pids[i], exit_code);
                report.exit_code = exit_code;
                report.pid_failure = pids[i];
                report.related_pid = getpid();
                report.timestamp = get_current_timestamp();

                char *json = jsonConverter(&report);
                if (json) {
                    sendJSONToServer(json);
                    free(json);
                }

                active[i] = 0;
                running--;
            }
        }
        usleep(500000);
    }

    free(pids);
    free(exits);
    free(active);

    return 0;
}
