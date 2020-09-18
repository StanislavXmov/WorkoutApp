const {BrowserWindow} = require('electron');

const defaultProps = {
  width: 500,
  height: 515,
  icon: './assets/icon.png',
  backgroundColor: '#3d3d3d',
  show: false,
  resizable: false,
  webPreferences: {
    nodeIntegration: true
  }
}

class Window extends BrowserWindow {
  constructor({file, ...windowSettings}) {
    super({...defaultProps, ...windowSettings});
    this.loadFile(file);

    this.once('ready-to-show', () => {
      this.show();
    });
  }
}

module.exports = Window;