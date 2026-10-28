const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

async function initAndCommit() {
  const dir = path.resolve(__dirname, '..');
  console.log('Target directory:', dir);

  // 1. Init git repo if .git doesn't exist
  if (!fs.existsSync(path.join(dir, '.git'))) {
    console.log('Initializing git repository...');
    await git.init({ fs, dir, defaultBranch: 'main' });
  }

  // 2. Set author
  const author = {
    name: 'jenin-sourav',
    email: 'jenin.sourav@example.com',
  };

  // 3. Find files to add (excluding node_modules, .next, etc.)
  function getAllFiles(currentDir, relativePath = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git' || entry.name === 'school.db') {
        continue;
      }
      const fullPath = path.join(currentDir, entry.name);
      const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        files = files.concat(getAllFiles(fullPath, relPath));
      } else {
        files.push(relPath);
      }
    }
    return files;
  }

  const filesToAdd = getAllFiles(dir);
  console.log(`Staging ${filesToAdd.length} files...`);

  for (const filepath of filesToAdd) {
    await git.add({ fs, dir, filepath });
  }

  console.log('Creating commit...');
  const sha = await git.commit({
    fs,
    dir,
    author,
    message: 'feat: initial commit - Apex International School management system & portals',
  });

  console.log('Committed successfully with SHA:', sha);

  // Set remote
  const remotes = await git.listRemotes({ fs, dir });
  const hasOrigin = remotes.some((r) => r.remote === 'origin');
  if (hasOrigin) {
    await git.deleteRemote({ fs, dir, remote: 'origin' });
  }
  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: 'https://github.com/jenin-sourav/Index.git',
  });

  console.log('Remote origin configured to https://github.com/jenin-sourav/Index.git');
}

initAndCommit().catch((err) => {
  console.error('Error in initAndCommit:', err);
  process.exit(1);
});
