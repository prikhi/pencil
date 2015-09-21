#!/usr/bin/env bash

function run_task {
  task=$@

  ${task}
  result=$?

  if [ "${result}" != "0" ]; then
    echo ":: Task has failed with exit code ${result}" 1>&2
    echo " -> ${task}"
    exit ${result}
  fi
}

export -f run_task
