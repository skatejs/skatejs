import { remove } from 'fs-extra';

// This exists to work on all platforms.
async function rm({ path }) {
  return remove(path);
}
