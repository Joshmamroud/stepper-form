class StepperForm {
  constructor(element) {
    this.element = element;
    this.stepElements = element.querySelectorAll('.sf-step');
    this.nextBtnElements = element.querySelectorAll('button.sf-next, a.sf-next');
    this.prevBtnElements = element.querySelectorAll('button.sf-prev, a.sf-next');
    this.submitBtnElements = element.querySelectorAll('button.sf-submit, a.sf-submit');
    this.indicatorElement = element.querySelector('.sf-indicators');
    this.init();
  }

  init() {
    this.steps = StepperForm.createSteps(this.stepElements);
    this.indicatorElements = StepperForm.getIndicatorElements(this.steps);
    this.indicatorElement.appendChild(StepperForm.createIndicatorListElement(this.indicatorElements));
    this._bindUIActions();
    this.step = this.steps[0];
  }

  _bindUIActions() {
    StepperForm._addEventListeners([this.element], 'submit', this._handleSubmit, this);
    StepperForm._addEventListeners(this.nextBtnElements, 'click', this.nextStep, this);
    StepperForm._addEventListeners(this.prevBtnElements, 'click', this.prevStep, this);
    StepperForm._addEventListeners(this.indicatorElements, 'click', this._handleIndicatorClick, this);
  }

  _handleSubmit(event) {
    event.preventDefault();
    if (this.step.isValid) {
      // Do submit
    }
  }

  _handleIndicatorClick(event) {
    const indicator = event.currentTarget;
    this.currentStep = parseInt(indicator.dataset.step);
  }

  set currentStep(index) {
    const step = this.steps[index];
    if (index == undefined || !this.steps.length || !step || (this.step.index < index && !this.step.isValid)) return;
    this.steps.forEach(step => (step.isActive = false));
    this.step = step;
    this.step.isActive = true;
    this.updateControls(index);
  }

  get currentStep() {
    return this.step ? this.step.index : null;
  }

  // Controls
  nextStep() {
    if (!this.step.isValid) return;
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }

  updateControls(step) {
    this.prevBtnElements.forEach(button => {
      step === 0 ? button.classList.add('d-none') : button.classList.remove('d-none');
    });
    this.nextBtnElements.forEach(button => {
      step < this.steps.length - 1 ? button.classList.remove('d-none') : button.classList.add('d-none');
    });
    this.submitBtnElements.forEach(button => {
      step === this.steps.length - 1 ? button.classList.remove('d-none') : button.classList.add('d-none');
    });
  }

  // Static Methods
  static createSteps(stepElements) {
    if (!stepElements || !stepElements.length) return [];
    const steps = [];
    stepElements.forEach((element, index) => steps.push(new Step(element, index)));
    return steps;
  }

  static createIndicatorListElement(indicatorElements) {
    const indicatorListElement = document.createElement('ul');
    indicatorElements.forEach(element => {
      indicatorListElement.appendChild(element);
    });

    return indicatorListElement;
  }

  static getIndicatorElements(steps) {
    return steps.map(step => step.indicatorElement);
  }

  static _addEventListeners(elementList, eventName, fn, self) {
    fn = self ? fn.bind(self) : fn;
    elementList.forEach(element => {
      element.addEventListener(eventName, fn);
    });
  }
}

class Step {
  constructor(element, index) {
    this.element = element;
    this.inputElements = element.querySelectorAll('input');
    this.index = index;
    this.name = element.dataset.name || `Step ${index + 1}`;
    this.indicatorElement = Step.createIndicatorElement(this.index, this.name);
    this.active = false;
    this.valid = true;
    this.complete = false;
  }

  set isActive(value) {
    this.active = value;
    if (value) {
      this.element.classList.remove('d-none');
      this.indicatorElement.classList.add('active');
    } else {
      this.element.classList.add('d-none');
      this.indicatorElement.classList.remove('active');
    }
  }

  get isActive() {
    return this.active;
  }

  get isValid() {
    this._validate();
    return this.valid;
  }
  set isValid(value) {}

  static createIndicatorElement(index, name) {
    const indicatorElement = document.createElement('li');
    indicatorElement.classList.add('sf-indicator');
    indicatorElement.dataset.step = index;

    // Indicator Number
    const numberElement = document.createElement('span');
    numberElement.textContent = index + 1;
    numberElement.classList.add('sf-indicator-number');
    indicatorElement.appendChild(numberElement);

    // Indicator Name
    const nameElement = document.createElement('span');
    nameElement.textContent = name;
    nameElement.classList.add('sf-indicator-name');
    indicatorElement.appendChild(nameElement);

    return indicatorElement;
  }

  _validate() {
    this.valid = true;
    this.inputElements.forEach(input => {
      const { valid } = input.validity;
      if (!valid) input.reportValidity();
      this.valid = valid ? this.valid : false;
    });
  }
}

window.addEventListener('load', function() {
  const formElement = document.querySelector('form.sf-form');
  const stepperForm = new StepperForm(formElement);
});
