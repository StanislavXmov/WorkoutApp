const { ipcRenderer } = require("electron");
ipcRenderer.send('workout:load');

class Workout {
  constructor(selector) {
    this.$app = document.querySelector(selector);
    this.$workout = document.createElement('div');
    this.$addWorkoutBtn = document.createElement('button');
    this.$addWorkoutItemBtn = document.createElement('button');
    this.$date = document.createElement('h2');
    this.today = new Date().toLocaleDateString()
    this.workoutState = {};
    this.renderEl(this.$app, this.$date, null, this.today);
    this.renderEl(this.$app, this.$workout, 'workout');
    this.renderEl(this.$app, this.$addWorkoutBtn, ['btn','add__workout'], 'Save Workout');
    this.renderEl(this.$app, this.$addWorkoutItemBtn, ['btn', 'add__workout-item'], 'New exercise');
    this.init();
  }
  renderEl(root, el, cl, content) {
    if (Array.isArray(cl)) {
      cl.forEach(c => el.classList.add(c));
    } else if (typeof cl === 'string') {
      el.classList.add(cl)
    }
    content ? el.textContent = content : null;
    root.append(el);
  }
  renderItem(e, value) {
    this.createForm({exercise: value});
  }
  loadItem() {
    if (this.workoutState[this.today] && this.workoutState[this.today].length > 0) {
      this.workoutState[this.today].forEach(w => {
        this.createForm(w);
      });
    } else {
      this.renderItem();
    }
  }
  init() {
    this.$addWorkoutBtn.addEventListener('click', this.addWorkout.bind(this));
    this.$addWorkoutItemBtn.addEventListener('click', this.renderItem.bind(this));
    this.$app.addEventListener('click', (e) => {
      if (e.target.dataset.plus) {
        e.preventDefault();
        this.renderItem(e, e.target.form.name.value);
      } else if (e.target.dataset.delete) {
        e.preventDefault();
        e.target.form.remove();
      }
    });
  }
  createForm(options) {
    const formTemplate = document.createElement('form');
    formTemplate.classList.add('workout__item');
    formTemplate.innerHTML = `
      <input class="item__name" type="text" name="name" value="${options.exercise ? options.exercise : ''}" placeholder="workout" autocomplete="off">
      <button data-plus="item" class="btn plus-item">+</button>
      <input class="item__weight" type="number" value="${options.weight ? options.weight : ''}" name="weight" placeholder="weight">
      <input class="item__counter" type="number" value="${options.counter ? options.counter : ''}" name="counter" placeholder="counter">
      <button data-delete="item" class="btn delete-item">&times;</button>`;
    this.$workout.append(formTemplate);
    return formTemplate;
  }
  addWorkout() {
    const date = this.today;
    this.workoutState[date] = [];
    
    const forms = this.$app.querySelectorAll('form');
    forms.forEach(f => {
      this.workoutState[date].push({
        exercise: f.name.value,
        weight: f.weight.value,
        counter: f.counter.value,
      });
    });
    ipcRenderer.send('workout:save', this.workoutState);
    location.assign('./main.html');
  }
}

const workout = new Workout('.app');
ipcRenderer.on('workout:state', (e, workoutState) => {
  workout.workoutState = workoutState;
  workout.loadItem();
});
ipcRenderer.on('workout:main', (e) => {
  location.assign('./main.html');
});
ipcRenderer.on('workout:workout', (e) => {
  location.assign('./index.html');
});