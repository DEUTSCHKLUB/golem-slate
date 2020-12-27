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
docker kill $1
umount $diskDir
rmdir $diskDir
rm $diskFile