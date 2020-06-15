function updateText() {
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  const curFiles = input.files;
  if (curFiles.length === 0) {
    const para = document.createElement("p");
    para.textContent = "No files currently selected for upload";
    preview.appendChild(para);
  } else {
    const list = document.createElement("ol");
    preview.appendChild(list);

    for (const file of curFiles) {
      const listItem = document.createElement("li");
      const para = document.createElement("p");
      para.textContent = `File name ${file.name}, file size ${returnFileSize(
        file.size,
      )}.`;
      const image = document.createElement("img");
      image.src = URL.createObjectURL(file);

      listItem.appendChild(image);
      listItem.appendChild(para);

      list.appendChild(listItem);
    }
  }
}

function returnFileSize(number) {
  if (number < 1024) {
    return number + "bytes";
  } else if (number >= 1024 && number < 1048576) {
    return (number / 1024).toFixed(1) + "KB";
  } else if (number >= 1048576) {
    return (number / 1048576).toFixed(1) + "MB";
  }
}

function readURL(input) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var data = reader.result;
    handleFile(data);
  };

  reader.readAsArrayBuffer(input);
}

const input = document.querySelector("input");
const preview = document.querySelector(".preview");

input.addEventListener("change", fileInputChanged, false);
function fileInputChanged() {
  updateText();
  const fileList = this.files;
  const file = fileList[0];
  readURL(file);
}

var ffmpeg_mp4 = require("../ffmpeg-mp4");

function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

function handleFile(arrayBuffer) {
  var res = ffmpeg_mp4({
    arguments: [
      "-i",
      "leslie_jordan_march.mp4",
      "-ss",
      "00:00:00",
      "-to",
      "00:00:15",
      "-c",
      "copy",
      "out.mp4",
    ],
    print: function (data) {
      console.log(data + "\n");
    },
    printErr: function (data) {
      console.log(data + "\n");
    },
    MEMFS: [{ name: "leslie_jordan_march.mp4", data: arrayBuffer }],
  });
  var file = res.MEMFS[0];
  download(file.data, file.name, "video/mp4");
}
