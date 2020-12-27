#! /bin/bash
if [ $# -eq 0 ]
  then
    echo "You must specify the pen to create"
    exit 1
fi
# Change to the folder this script is in
cd $(dirname $0)
diskFile=$1.img
diskDir=$1
touch $diskFile
mkdir $diskDir
truncate -s 1G $diskFile
mke2fs -t ext4 -F $diskFile
mount $diskFile $diskDir
cp -r ./template/* ./$diskDir/
#change ownership to current user so it can access them
chown -R $SUDO_USER:$SUDO_USER ./$diskDir
# docker run -d -it --name=$diskDir --rm -v ${PWD}/$diskDir:/golem/work golem-slate bash -C ./init.sh