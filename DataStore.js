const Store = require('electron-store');

class DataStore extends Store {
  constructor (settings) {
    super(settings);
    this.workoutState = this.get('workoutState') || {};
  }
  saveWorkout(workout) {
    this.set('workoutState', workout);
    return this;
  }
  getWorkout() {
    this.workoutState = this.get('workoutState') || {};
    return this.workoutState;
  }
}
module.exports = DataStore;