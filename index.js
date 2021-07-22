var fs = require("fs");
var request = require("axios");
const { default: axios } = require("axios");
const jsonToCSV = require("./Json2CSV");
const cliProgress = require("cli-progress");
const urlList = require("./input");

axios.defaults.timeout = 25000;

// @param {String} token - String containing your API Key
// @param {String} url - Encoded URI string container the URI you're targeting
// @param {Integer} width - Integer indicating the width of your target render
// @param {Integer} height - Integer indicating the height of your target render
// @param {String} output - String specifying the output format, "image" or "json"

const screenshotRequest = {
  getScreenshot: function (url) {
    return axios.get(url);
  },
};

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

async function main(urlList) {
  const screenshotList = [];

  bar1.start(urlList.length, 0);
  try {
    for (let i = 0; i < urlList.length; i++) {
      const token = "08H7TFK-4GN4HAJ-PFH9QQK-DSSB8HP";
      const url = encodeURIComponent(urlList[i]);
      const queryString = `https://shot.screenshotapi.net/screenshot?token=${token}&url=${url}&width=1400&height=800&output=json&file_type=png&block_ads=true&no_cookie_banners=true&wait_for_event=load`;

      const oneScreenshot = await screenshotRequest
        .getScreenshot(queryString)
        .catch((error) => {
          const result = {
            url: urlList[i],
            screenshot: "error",
          };
          screenshotList.push(result);
          return undefined;
        });

      if (oneScreenshot != undefined) {
        const result = {
          url: urlList[i],
          screenshot: oneScreenshot.data.screenshot,
        };
        screenshotList.push(result);
      }

      bar1.update(screenshotList.length);
    }
    bar1.stop();
  } catch (error) {
    console.log(error);
    return screenshotList;
  }
  return screenshotList;
}

main(urlList)
  .then(function (data) {
    const csv = jsonToCSV(data);
    fs.writeFileSync("./output.csv", csv);
  })
  .catch((error) => {
    console.log(error);
  });
