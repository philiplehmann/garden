// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// @ts-ignore
import NodeWebcam from "node-webcam";
import fs from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";

//Default options

var opts = {
  //Picture related

  width: 1920,

  height: 1080,

  quality: 100,

  // Number of frames to capture
  // More the frames, longer it takes to capture
  // Use higher framerate for quality. Ex: 60

  frames: 1,

  //Delay in seconds to take shot
  //if the platform supports miliseconds
  //use a float (0.1)
  //Currently only on windows

  delay: 0,

  //Save shots in memory

  saveShots: true,

  // [jpeg, png] support varies
  // Webcam.OutputTypes

  output: "png",

  //Which camera to use
  //Use Webcam.list() for results
  //false for default device

  device: false,

  // [location, buffer, base64]
  // Webcam.CallbackReturnTypes

  callbackReturn: "location",
  // callbackReturn: "base64",

  //Logging

  verbose: true,
};

const webcam = NodeWebcam.create(opts);

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BinaryData>
) {
  const filename = path.join(
    os.tmpdir(),
    "image-" + crypto.randomBytes(4).readUInt32LE(0)
  );
  webcam.capture(filename, (err: any, savedTo: string) => {
    if (err) {
      console.error(err);
      res.status(500);
      res.end();
    } else {
      res.setHeader("Content-Type", "image/png");
      const stream = fs.createReadStream(savedTo);
      stream.pipe(res);
    }
  });
}
