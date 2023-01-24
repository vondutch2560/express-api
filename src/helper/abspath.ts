import * as dotenv from "dotenv";
import { resolve, join } from "path";
import os from "os";

dotenv.config();
export const rootDir = resolve("./");
export const staticDir = join(rootDir, "static");
export const mochiDir = join(staticDir, "mochi");
export const mochiAudioDir = join(staticDir, "mochi", "audio");
export const mochiMd5File = join(staticDir, "mochi", "md5.json");
export const smbShareDir = join(os.homedir(), "sambashare");
