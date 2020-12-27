#! /bin/bash
if [ $# -eq 0 ]
  then
    echo "You must specify the pen to remove"
    exit 1
fi
# Change to the folder this script is in
cd $(dirname $0)
diskFile=$1.img
diskDir=$1
# Stop the docker image
./stopPen.sh $1
# Clear the files
rm -rf $diskDir/*
# Copy the template again
cp -r ./template/* ./$diskDir/
# Start the docker again
./startPen.sh $1