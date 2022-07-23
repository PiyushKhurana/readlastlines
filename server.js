const fs = require("fs");
const utils = require("./utils");

const express = require("express");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const port = process.env.PORT ?? 3000;
const N = 10;
const filePath = process.argv[2] ?? "access_logs";

// Middleware to serve static assets
app.use("/js", express.static(__dirname + "/assets"));

/**
 * @route GET api.example.com/
 * @access public
 */
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

/**
 * Socketio connection to send realtime updates
 */
io.on("connection", function (client) {
  console.log(`Client connected (id':${client.id} )`);

  // Reading log file
  async function watchAndEmitFileChanges() {
    const lastByte = (await utils.getFileStats(filePath)).size;
    let lastReadPosition = lastByte;

    linesToSend = (await utils.readLastNLines(filePath, N)).split("\n");

    notifyClient(linesToSend);

    // Watch for changes
    fs.watch(filePath, function (event, filename) {
      // Open file in read mode
      fs.open(filePath, "r", function (err, fd) {
        // Get stas of the file to see how much content has been changed, Then read that particular data only
        fs.fstat(fd, function (err, fstats) {
          let difference = fstats.size - lastReadPosition;
          // Checking if file has changed

          if (difference) {
            let buffer = new Buffer.alloc(difference);

            fs.read(
              fd,
              buffer,
              0,
              buffer.length,
              lastReadPosition,
              function (err, bytes) {
                if (bytes > 0) {
                  changedContent = buffer.slice(0, bytes).toString();
                  notifyClient(changedContent.split("\n"));
                }
              }
            );
          }
          lastReadPosition = fstats.size;
        });
      });
    });
  }

  watchAndEmitFileChanges();

  function notifyClient(logs) {
    if (logs.length) {
      //Check if there is any lines to send
      client.emit("fileUpdate", { data: logs });
    }
  }
});

// Serve listening on port `PORT` || 3000
server.listen(port, () => {
  console.log(`Server is up and running at port ${port}`);
});
