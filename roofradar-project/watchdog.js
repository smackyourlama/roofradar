const { exec, spawn } = require('child_process');

const PROCESS_NAME = 'src/cron.js';
const CHECK_INTERVAL = 10000; // 10 seconds

function checkAndRestart() {
    exec(`ps aux | grep "[n]ode ${PROCESS_NAME}"`, (error, stdout, stderr) => {
        if (!stdout) {
            console.log(`${new Date().toISOString()} - Process ${PROCESS_NAME} is not running. Restarting...`);
            const child = spawn('npm', ['run', 'cron'], {
                detached: true,
                stdio: 'ignore'
            });
            child.unref();
            console.log(`${new Date().toISOString()} - Restarted.`);
        }
    });
}

console.log(`Starting watchdog for ${PROCESS_NAME}...`);
setInterval(checkAndRestart, CHECK_INTERVAL);
checkAndRestart();
