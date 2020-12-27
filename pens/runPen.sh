#! /bin/bash
if [ $# -eq 0 ]
  then
    echo "You must specify the pen to run"
    exit 1
fi
# Change to the folder this script is in
cd $(dirname $0)
echo "Start Running Pen $1"
# use the first argument for the disk image, remaining are passed into run.sh
docker exec -i -w /golem/work $1 ./run.sh $2 $3 $4 $5
echo "End Running Pen $1"