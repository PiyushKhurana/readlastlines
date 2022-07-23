(function () {
  const socket = io.connect("http://localhost:3000");
  const logSection = document.getElementById("logs");

  socket.on("fileUpdate", function (data) {
    if (data) {
      let logstrings = "";

      data.data.forEach((e) => {
        logstrings += "<div>" + e + "</div>";
      });

      logSection.innerHTML += logstrings;
    }
  });
})();
