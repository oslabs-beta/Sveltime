import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';

function serve() {
  // Keep a reference to a spawned server process
  let server;

  function toExit() {
      // kill the server if it exists
      if (server) server.kill(0);
  }

  return {
      writeBundle() {
      if (server) return;
      // Spawn a child server process
      server = require('child_process').spawn(
          'npm',
          ['run', 'start', '--', '--dev'],
          {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
          }
      );

      // Kill server on process termination or exit
      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
      },
  };
}

export default {
  // This `main.js` file we wrote
  input: 'src/main.js',
  output: {
    // The destination for our bundled JavaScript
    file: 'public/build/bundle.js',
    // Our bundle will be an Immediately-Invoked Function Expression
    format: 'iife',
    // The IIFE return value will be assigned into a variable called `app`
    name: 'app',
  },
  plugins: [
    svelte({
      // Tell the svelte plugin where our svelte files are located
      include: 'src/**/*.svelte',
    }),
    // Tell any third-party plugins that we're building for the browser
    resolve({ browser: true }),
    serve(),
    livereload('public'),
  ],
};