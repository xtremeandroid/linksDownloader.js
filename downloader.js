const fs = require("fs");
const path = require("path");
const axios = require("axios");

const downloadFolder = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadFolder)) {
  fs.mkdirSync(downloadFolder);
}

const links = [];

async function downloadFile(url, folder) {
  try {
    const fileName = path.basename(url);
    const filePath = path.join(folder, fileName);

    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(fileName));
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
  }
}

(async () => {
  const downloadPromises = links.map((link) =>
    downloadFile(link, downloadFolder)
  );
  const downloadedFiles = await Promise.all(downloadPromises);
  downloadedFiles.forEach((fileName) => {
    if (fileName) {
      console.log(`Downloaded: ${fileName}`);
    }
  });
})();
