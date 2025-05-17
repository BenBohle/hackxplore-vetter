#!/bin/bash

PROGRAMS=(
    "dummy_programs/executables/will_crash"
    "dummy_programs/executables/will_crash_big_error_msg"
    "./dummy2"
)

rm -f stderr_*.log exitcode_*.log

PIDS=()
LOGS=()
CODES=()

for cmd in "${PROGRAMS[@]}"; do
    LOGFILE="stderr_$$.$RANDOM.log"
    EXITFILE="exitcode_$LOGFILE"

    bash -c "$cmd; echo \$? > $EXITFILE" 2> "$LOGFILE" &
    PID=$!

    PIDS+=("$PID")
    LOGS+=("$LOGFILE")
    CODES+=("$EXITFILE")
done

ARGS=()
for i in "${!PIDS[@]}"; do
    ARGS+=("${PIDS[i]}" "${LOGS[i]}" "${CODES[i]}")
done

./monitoring "${ARGS[@]}"
