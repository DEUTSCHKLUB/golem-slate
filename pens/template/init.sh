#! /bin/bash
# shellcheck shell=bash
echo "Waiting for yagna to start"
yagna service run >> yagna.log 2>&1 &
sleep 5
echo "Getting App key"
export YAGNA_APPKEY=$(yagna app-key create requester)
echo "Initializing payment"
# --driver=NGNT
yagna payment init -r
yagna payment status
echo "Preparing codepen"
yarn
# Removing 90 minute limit
#echo "Sleeping for 90 minutes to keep docker running"
#sleep 90m
# Run indefinitely
tail -f /dev/null
#echo "Running codepen"
#yarn codepen
