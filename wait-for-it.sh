#!/usr/bin/env sh
#
# A pure-POSIX shell script to wait for a TCP host/port to become available.
#
# The script is a simplified version of https://github.com/vishnubob/wait-for-it
# It has been modified to use `nc` from busybox instead of bash-specific features.
#
# Usage:
#   ./wait-for-it.sh host:port [-t timeout] [-- command args...]
#
# Arguments:
#   host:port   - Host and port to check for.
#   -t timeout  - Timeout in seconds, 0 for no timeout. Default is 15 seconds.
#   -- command  - Command to execute after the host is available.

set -e

TIMEOUT=15
QUIET=0
HOST=
PORT=
CMD=

usage() {
    cat << USAGE >&2
Usage:
    $0 host:port [-t timeout] [-- command args...]
    -t TIMEOUT | --timeout=TIMEOUT  Timeout in seconds, 0 for no timeout
    -- COMMAND ARGS...             Execute command with args after the test finishes
USAGE
    exit 1
}

wait_for() {
    for i in `seq $TIMEOUT`; do
        nc -z "$HOST" "$PORT" >/dev/null 2>&1
        result=$?
        if [ $result -eq 0 ]; then
            if [ $QUIET -eq 0 ]; then echo "Host $HOST is available after $i seconds"; fi
            return 0
        fi
        sleep 1
    done
    echo "Timeout occurred after waiting $TIMEOUT seconds for $HOST:$PORT" >&2
    return 1
}

while [ $# -gt 0 ]
do
    case "$1" in
        *:* )
        HOST=$(printf "%s\n" "$1"| cut -d : -f 1)
        PORT=$(printf "%s\n" "$1"| cut -d : -f 2)
        shift 1
        ;;
        -t)
        TIMEOUT="$2"
        if [ "$TIMEOUT" = "" ]; then break; fi
        shift 2
        ;;
        --timeout=*)
        TIMEOUT="${1#*=}"
        shift 1
        ;;
        --)
        shift
        CMD=$@
        break
        ;;
        --help)
        usage
        ;;
        *)
        echo "Unknown argument: $1"
        usage
        ;;
    esac
done

if [ "$HOST" = "" ] || [ "$PORT" = "" ]; then
    echo "Error: you need to provide a host and port to test."
    usage
fi

wait_for

if [ "$CMD" != "" ]; then
    exec $CMD
fi 