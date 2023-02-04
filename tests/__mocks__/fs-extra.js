import path from "path";
import { fs } from "memfs";

const deps = {
  readFile: fs.promises.readFile,
  readdir: fs.promises.readdir,
  ensureDir: (path) =>
    fs.promises
      .access(path, fs.constants.F_OK)
      .catch(() => fs.promises.mkdir(path, { recursive: true })),
  writeFile: fs.promises.writeFile,
  remove: (path) =>
    fs.promises.rmdir(path).catch((err) => {
      if (err.code !== "ENOENT") throw err;
    }),
  copy: async (src, dest) => {
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    await deps.ensureDir(dest);

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await deps.copy(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  },
};

export default deps;
