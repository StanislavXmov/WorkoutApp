const { ipcRenderer } = require('electron');
ipcRenderer.send('workout:load');

class App {
  constructor(selector) {
    this.$app = document.querySelector(selector);
    this.$title = document.createElement('h1');
    this.$menu = document.createElement('div');
    this.$workoutList = document.createElement('div');
    this.$workoutModal = document.createElement('div');
    this.$closeModal = document.createElement('button');
    this.$allWorkout = document.createElement('button');
    this.$todayWorkout = document.createElement('button');
    this.workoutState = {};
    this.renderEl(this.$app, this.$title, null, 'Workout App');
    this.renderEl(this.$app, this.$menu, 'menu');
    this.renderEl(this.$app, this.$workoutList, 'workout__list');
    this.renderEl(this.$app, this.$workoutModal, 'workout__modal');
    this.renderEl(this.$app, this.$closeModal, ['btn','close__modal'], 'X');
    this.$closeModal.dataset.close = 'modal';
    this.renderEl(this.$menu, this.$allWorkout, ['btn','all__workout'], 'All Workout');
    this.renderEl(this.$menu, this.$todayWorkout, ['btn', 'today__workout'], 'Today Workout');
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
  init() {
    this.$allWorkout.addEventListener('click', this.showAllWorkout.bind(this));
    this.$todayWorkout.addEventListener('click', this.createTodayWorkout.bind(this));
    this.$app.addEventListener('click', (e) => {
      if (e.target.dataset.id) {
        e.preventDefault();
        const title = document.createElement('h2');
        title.textContent = e.target.dataset.id;
        this.$workoutModal.append(title);
        this.$workoutModal.style.display = 'block';
        this.$closeModal.style.display = 'block';
        this.workoutState[e.target.dataset.id].forEach(w => {
          const form = this.createForm(w);
          this.$workoutModal.append(form);
        });
      } else if (e.target.dataset.close) {
        this.$workoutModal.innerHTML = '';
        this.$workoutModal.style.display = 'none';
        this.$closeModal.style.display = 'none';
      }
    });
  }
  showAllWorkout() {
    this.$workoutList.innerHTML = '';
    const keys = Object.keys(this.workoutState);
    keys.forEach((w, i) => {
      const workoutBtn = document.createElement('button');
      workoutBtn.classList.add('btn', 'open__workout');
      workoutBtn.textContent = keys[i];
      workoutBtn.dataset.id = keys[i];
      this.$workoutList.append(workoutBtn);
    });
  }
  createTodayWorkout() {
    location.assign('./index.html');
  }
  createForm(options) {
    const formTemplate = document.createElement('form');
    formTemplate.classList.add('workout__item');
    formTemplate.innerHTML = `
      <input class="item__name" type="text" name="name" value="${options.exercise ? options.exercise : ''}" placeholder="workout" autocomplete="off" disabled>
      <input class="item__weight" type="number" value="${options.weight ? options.weight : ''}" name="weight" placeholder="weight" disabled>
      <input class="item__counter" type="number" value="${options.counter ? options.counter : ''}" name="counter" placeholder="counter" disabled>`;
    return formTemplate;
  }
}

const app = new App('.app');
ipcRenderer.on('workout:state', (e, workoutState) => {
  app.workoutState = workoutState;
});
ipcRenderer.on('workout:main', (e) => {
  location.assign('./main.html');
});
ipcRenderer.on('workout:workout', (e) => {
  location.assign('./index.html');
});