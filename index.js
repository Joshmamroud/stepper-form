class StepperForm {
  constructor(formElement) {
    this.form = formElement;
    this.steps = [];
    this.form.querySelectorAll(".step").forEach((node, index) => this.steps.push(new Step(node, index)));
    this.nextButtons = this.form.querySelectorAll("button.next, a.next");
    this.prevButtons = this.form.querySelectorAll("button.prev, a.next");
    this.submitButtons = this.form.querySelectorAll("button.submit, a.submit");
    this.init();
  }

  init() {
    this._bindUIActions();
    this.currentStep = 0;
  }

  _bindUIActions() {
    this._addEventListeners([this.form], "submit", this._handleSubmit, this);
    this._addEventListeners(this.nextButtons, "click", this.nextStep, this);
    this._addEventListeners(this.prevButtons, "click", this.prevStep, this);
  }

  _handleSubmit(event) {
    event.preventDefault();
    if (this.currentStep.isValid) {
      // Do submit
    }
  }

  nextStep() {
    if (!this.step.isValid) return;
    this.currentStep = this.currentStep + 1;
  }

  prevStep() {
    this.currentStep = this.currentStep - 1;
  }

  set currentStep(index) {
    if (!this.steps[index]) return;
    this.updateNavigation(index);
    this.step = this.steps[index];
    this.steps.forEach(step => step.hide());
    this.step.show();
  }

  get currentStep() {
    return this.step.index;
  }

  updateNavigation(step) {
    this.prevButtons.forEach(button => {
      step === 0 ? button.classList.add("d-none") : button.classList.remove("d-none");
    });
    this.nextButtons.forEach(button => {
      step < this.steps.length - 1 ? button.classList.remove("d-none") : button.classList.add("d-none");
    });
    this.submitButtons.forEach(button => {
      step === this.steps.length - 1 ? button.classList.remove("d-none") : button.classList.add("d-none");
    });
  }

  _addEventListeners(nodeList, eventName, fn, self) {
    fn = self ? fn.bind(self) : fn;
    nodeList.forEach(node => {
      node.addEventListener(eventName, fn);
    });
  }
}

class Step {
  constructor(node, index) {
    this.node = node;
    this.inputs = node.querySelectorAll("input");
    this.index = index;
    this.valid = true;
  }

  show() {
    this.node.classList.remove("d-none");
  }

  hide() {
    this.node.classList.add("d-none");
  }

  get isValid() {
    this._validate();
    return this.valid;
  }

  set isValid(value) {}

  _validate() {
    this.valid = true;
    this.inputs.forEach(input => {
      const { valid } = input.validity;
      if (!valid) input.reportValidity();
      this.valid = valid ? this.valid : false;
    });
  }
}

window.addEventListener("load", function() {
  const formElement = document.querySelector("form.stepper-form");
  const stepperForm = new StepperForm(formElement);
});
