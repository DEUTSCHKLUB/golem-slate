## Summary ##
This directory contains the back-end for slate.

The slates (or pens) that run are actually individual Docker containers.

Each slate works by creating a fixed size disk and mounting it into a directory. This fixed size disk is then mounted into the Docker container as the /golem/work directory.


## Use ##
There are 6 commands that can be invoked with a shell script. Only two scripts need to be run with root privileges: `createPen.sh` and `removePen.sh`. This is because these scripts will modify mount points on the system while creating or removing fixed size disks.

All functions take a single parameter which is the name of the pen to create. The slate code currently uses the naming convention of pen0, pen1, pen2, ...

When setting up a host, the `createPen.sh` must be called once for each pen you wish to create.

You will need to build the provided Docker image so that it is available in your local repository. To do this, run this command in the `pens` directory:

    docker build -t golem-slate Docker


## Set-Up ##
* cd into the pens directory
* Build a fresh docker image:  
    > docker build --no-cache -t golem-slate Docker
* Create 10 pens 
    > sudo ./create.sh
* Start 10 pens 
    > for t in {0..9}; do ./startPen.sh pen$t; done
* Run the front-end web application

## Tear-down ##
* cd into the pens directory
* Remove 10 pens
    > sudo ./remove.sh

## Commands ##
### createPen.sh pen0 ###
This will create a new pen.  
**This command should be run as root when setting up slate.**
* Create a fixed disk file called `pen0.img`
* Create a directory called `pen0`
* Copy the contents of the `template` directory will be copied into the new directory
* Set ownership of the new directory to the calling user to allow other actions to be ran without root privileges.

### removePen.sh pen0 ###
This will remove an existing pen.  
**This command should be run as root when removing slate.**
* Stop the Docker container for pen0
* Unmount the `pen0` directory
* Remove the `pen0` directory
* Remove the `pen0.img` disk image

### startPen.sh pen0 ###
This will start the Docker container for the specified pen.  
This command should be run when setting up a slate.   
This command will be ran by the front-end application.
* Start the Docker container for pen0

### stopPen.sh pen0 ###
This will stop the Docker container for the specified pen.  
This command will be ran by the front-end application.
* Stop the Docker container for pen0

### resetPen.sh pen0 ###
This will reset the pen to the template.  
This command will be ran by the front-end application.

* Call `stopPen.sh` to turn off the Docker container
* Remove the contents of the `pen0` directory
* Copy the contents of the `template` directory into the `pen0` directory
* Call `startPen.sh` to turn on the Docker container

### runPen.sh pen0 ###
This will run the requester script within the Docker container.  
This command will be ran by the front-end application.
* Execute the `run.sh` script within the pen0 Docker container

## Contents ##

    .
    ├── createPen.sh
    ├── Docker
    │   └── Dockerfile
    ├── removePen.sh
    ├── resetPen.sh
    ├── runPen.sh
    ├── startPen.sh
    ├── stopPen.sh
    └── template
        ├── codepen_base.ts
        ├── codepen_import.ts
        ├── cubes.blend
        ├── init.sh
        ├── node_modules
        │   ├── ...
        ├── package.json
        ├── run.sh
        └── tsconfig.json