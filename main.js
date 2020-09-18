const {app, ipcMain, Menu, globalShortcut} = require('electron');
const path = require('path');
const Window = require('./Window');
const DataStore = require('./DataStore');

const appData = new DataStore({name: 'WorkoutApp'}); 

let mainWindow;
const menu = [
  {
    label: 'Workout App',
    submenu: [
      {
        label: 'Main Page',
        click: mainPage,
      },
      {
        label: 'Workout Page',
        click: workoutPage,
      },
      {
        label: 'Quit',
        click: app.quit,
      }
    ]
  }
];

function createMainWindow() {
  mainWindow = new Window({
    file: path.join('rendered', 'main.html')
  });
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
  // globalShortcut.register('Ctrl+Shift+I', () => mainWindow.toggleDevTools()); 
}

app.on('ready', createMainWindow);
app.on("window-all-closed", function() {
  app.quit();
});

ipcMain.on('workout:save', (e, workout) => {
  appData.saveWorkout(workout);
});
ipcMain.on('workout:load', (e) => {
  const data = appData.getWorkout();
  mainWindow.send('workout:state', data);
});

function mainPage() {
  mainWindow.send('workout:main');
}
function workoutPage() {
  mainWindow.send('workout:workout');
}