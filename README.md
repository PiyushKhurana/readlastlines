# Log-Watching-Tail-Command-Implementation

## Problem statement
This problem requires you to implement a log watching solution (similar to the tail -f command in UNIX). However, in this case, the log file is hosted on a remote machine (same machine as your server code).

You have to implement the following:
  - A server side program to monitor the given log file and capable of streaming updates that happen in it. This will run on the same machine as the log file.
  - A web based client (accessible via URL like http://localhost/log) that prints the updates in the file as and when they happen and NOT upon page refresh. The page should be loaded once and it should keep getting updated in real-time. The user sees the last 10 lines in the file when he lands on the page. The server should not retransmit the entire file every time. It should only send the updates. The server should be able to handle multiple clients at the same time.
