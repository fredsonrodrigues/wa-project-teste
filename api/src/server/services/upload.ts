import { ServiceError } from 'errors/service';
import * as fs from 'fs';
import * as uuid from 'uuid';

const UPLOAD_DIR = 'upload';

export async function move(source: string): Promise<string> {
  await checkFolder();
  const newFilename = `${uuid()}.${source.split('.').pop()}`;

  return new Promise<string>((resolve, reject) => {
    fs.createReadStream(source)
      .pipe(fs.createWriteStream(getPath(newFilename)))
      .on('error', err => reject(err))
      .on('close', () => {
        fs.unlink(source, err => {
          err ? reject(err) : resolve(newFilename);
        });
      });
  });
}

export async function save(filename: string, base64: string): Promise<string> {
  await checkFolder();

  const ext = filename.split('.').pop();
  base64 = base64.split(',').pop();
  filename = `${uuid.v4()}.${ext}`;

  await fs.promises.writeFile(getPath(filename), base64, 'base64');
  return filename;
}

export function getPath(filename: string): string {
  if (filename.includes('..')) throw new ServiceError('change-folder-not-allowed');
  return `${UPLOAD_DIR}/${filename}`;
}

export async function remove(filename: string): Promise<void> {
  if (!filename) throw new ServiceError('provide a filename to exlude');
  await fs.promises.unlink(getPath(filename));
}

async function checkFolder(): Promise<void> {
  await fs.promises.access(UPLOAD_DIR).catch(() => {
    return fs.promises.mkdir(UPLOAD_DIR);
  });
}
