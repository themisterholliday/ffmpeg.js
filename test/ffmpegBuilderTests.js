var expect = require("chai").expect;
var CommandBuilder = require("../src/commandBuilder/fluent-ffmpeg-builder");

describe("CommandBuilder", function () {
  this.timeout(20000);

  describe("Should build expected arguments", function () {
    it("should print version to stdout", function () {
      // make sure you set the correct path to your video file
      var command = CommandBuilder("/path/to/your_movie.avi")
        // set video bitrate
        .videoBitrate(1024)
        // set target codec
        .videoCodec("divx")
        // set aspect ratio
        .aspect("16:9")
        // set size in percent
        .size("50%")
        // set fps
        .fps(24)
        // set audio bitrate
        .audioBitrate("128k")
        // set audio codec
        .audioCodec("libmp3lame")
        // set number of audio channels
        .audioChannels(2)
        // set custom option
        .addOption("-vtag", "DIVX")
        // set output format to force
        .format("avi");

      const expectedArguments = [
        "-i",
        "/path/to/your_movie.avi",
        "-b:a",
        "128k",
        "-acodec",
        "libmp3lame",
        "-ac",
        2,
        "-b:v",
        "1024k",
        "-vcodec",
        "divx",
        "-r",
        24,
        "-filter:v",
        "scale=w=trunc(iw*0.5/2)*2:h=trunc(ih*0.5/2)*2",
        "-vtag",
        "DIVX",
        "-f",
        "avi",
      ];
      expect(command.getArguments()).to.have.members(expectedArguments);
    });
  });
});
