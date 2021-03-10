# golem SLATE
## Summary ##
SLATE is a code pen for writing a requester script to have work computed by the golem network.

SLATE is an SPA that utilizes dockerized yagna environments to
communicate with the golem network.

There is no need to setup the yagna daemon, prepare a Python or NodeJS development environment, write a full requester script, or even stay online while the requester is running!

The user only needs to provide 3 things:
* The hash for the desired gvmkit image
* A function to enumerate the tasks
* A function to process each task

The user may upload files for use in the requester script, and the user may download files returned from the golem worker.

[Demo Video](https://youtu.be/P7bNvsRU7P0)

*Link to the hosted copy shared with a member of the golem comms team*

## Use ##
Click the `Create a new SLATE` button to prepare a new working environment. If there are any slots open you will be taken to a new page. If not, try again later!

The new slate is created with the standard blender example prepared. You can view the code for it in the `codepen_import.ts` file.

You may create your own script by implementing the `CodePenParams` class in the same way the blender example has done. You may also upload files into your slate and reference them in your script.

**You may need to wait a few seconds for the yagna daemon to initialize. You may view yagna.log in slate to ensure it is running before clicking `Run`**

You may also choose to make no changes, and simply click `Run` to send the request to the network.

The output area will show the progress of running the request. Any files downloaded from the golem network by your request will be shown in the file list.

## Set-Up ##
### Back-end Setup ###
* cd into the pens directory
* Build the docker image:  
    > docker build --no-cache -t golem-slate Docker
* Create 10 pens 
    > ./create.sh
* Start 10 pens 
    > ./start.sh
* Run the front-end web application

(For more information about the back-end see pens/README.MD)

### Front-end Setup ###
* from the main directory
> npm install  
> npm run start

open your browser and go to:

http://localhost:3000/

## Known Limitations ##
* slates are currently not recycled. This means the slots will fill up and need to be manually reset before new ones can be created.
* the golem Alpha III network only allows requests to run for 30 minutes.

## Planned Features ##
* Support for Python and JavaScript slates
* Support for installing extra packages
* Support for reading & writing files from:
    * HTTPS
    * WebDAV
    * S3
    * IPFS
* Persistent workspaces