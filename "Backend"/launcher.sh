#!/bin/bash

# Define programs to be launched in this array, call executable plus argvs
PROGRAMS=(
    "path/to/dummy" 
    "bash -c 'echo error >&2; sleep 2'"
    "path/to/dummy_two"
)

# Clear previous logs
rm -f stderr_*.log

# Arrays to hold PID and logfile pairs
PIDS=()
LOGS=()

# Launch each program
for cmd in "${PROGRAMS[@]}"; do
    echo "[launcher] Running: $cmd"

    # Generate a unique log file name based on time and PID
    LOGFILE="stderr_$$.$RANDOM.log"

    # Use bash to launch the command in background, redirecting stderr
    bash -c "$cmd" 2> "$LOGFILE" &
    PID=$!

    echo "[launcher]   -> PID: $PID, Log: $LOGFILE"

    PIDS+=("$PID")
    LOGS+=("$LOGFILE")
done

# Build arguments for Monitoring
ARGS=()
for i in "${!PIDS[@]}"; do
    ARGS+=("${PIDS[i]}" "${LOGS[i]}")
done

# Call Monitoring (compile it first)
./monitoring "${ARGS[@]}"