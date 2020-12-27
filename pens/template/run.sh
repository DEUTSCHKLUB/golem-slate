#! /bin/bash
# shellcheck shell=bash
#echo "Waiting for yagna to start"
#yagna service run >> yagna.log 2>&1 &
#sleep 3
echo "setting yagna key"
export YAGNA_APPKEY=$(yagna app-key list --json | head -n 12 | tail -1 | cut -c8-39)
echo "Preparing codepen"
yarn
echo "Running codepen"
yarn codepen -h $1 -c $2 -m $3 -s $4 