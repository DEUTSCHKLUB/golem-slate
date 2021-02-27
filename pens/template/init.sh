#! /bin/bash
# shellcheck shell=bash
echo "Waiting for yagna to start"
yagna service run >> yagna.log 2>&1 &
sleep 15
echo "Getting App key"
export YAGNA_APPKEY=$(yagna app-key create requester)
echo "Initializing payment"
# --driver=NGNT
yagna payment fund >> startup.log 2>&1
yagna payment init --sender >> startup.log 2>&1
yagna payment status >> startup.log 2>&1
echo "Preparing codepen"
# adding custom package for yajsapi
yarn add https://github.com/golemfactory/yajsapi/releases/download/0.3.1-alpha.2/yajsapi-0.3.1-alpha.2.tgz
yarn
# Removing 90 minute limit
#echo "Sleeping for 90 minutes to keep docker running"
#sleep 90m
# Run indefinitely
tail -f /dev/null
#echo "Running codepen"
#yarn codepen
