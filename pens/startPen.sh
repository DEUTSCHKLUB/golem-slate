#! /bin/bash
if [ $# -eq 0 ]
  then
    echo "You must specify the pen to start"
    exit 1
fi
# Change to the folder this script is in
cd $(dirname $0)
diskFile=$1.img
diskDir=$1
docker run -d -it --name=$diskDir --rm -v ${PWD}/$diskDir:/golem/work golem-slate bash -C ./init.sh