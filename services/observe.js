const chokidar = require('chokidar');
const EventEmitter = require('events').EventEmitter;
const fsExtra = require('fs-extra');

class Observer extends EventEmitter {
  constructor() {
    super();
  }

  watchFolder(folder) {
    try {
      console.log(
        `[${new Date().toLocaleString()}] Watching for folder changes on: ${folder}`
      );

      var watcher = chokidar.watch(folder, { persistent: true });

      watcher.on('add', async filePath => {
        if (filePath.includes('error.log')) {
          console.log(
            `[${new Date().toLocaleString()}] ${filePath} has been added.`
          );

          // Read content of new file
          var fileContent = await fsExtra.readFile(filePath);

          // emit an event when new file has been added
          /* this could be where we broadcast file updates to the app. I'm still unsure where to utilize a module like this within express.
            I've added it to app.js emitter is a nice wrapper around normal JS custom events it seems, so we can make listeners on the front
          */
          this.emit('file-added', {
            message: fileContent.toString()
          });

          // remove file error.log
          await fsExtra.unlink(filePath);
          console.log(
            `[${new Date().toLocaleString()}] ${filePath} has been removed.`
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Observer;
