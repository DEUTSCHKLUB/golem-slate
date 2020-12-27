#! /bin/bash
# shellcheck shell=bash
echo "Waiting for yagna to start"
yagna service run >> yagna.log 2>&1 &
sleep 5
echo "Getting App key"
export YAGNA_APPKEY=$(yagna app-key create requester)
echo "Initializing payment"
yagna payment init -r
yagna payment status
echo "Preparing codepen"
yarn
echo "Sleeping for 90 minutes to keep docker running"
sleep 90m
#echo "Running codepen"
#yarn codepen