import '@polymer/polymer/polymer-element.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="shared-styles">
  <template>
    <style>
      .card {
        display: block;
        margin: 0 auto;
        width: 50%;
        padding: 16px;
        color: #757575;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }

      .circle {
        display: inline-block;
        width: 64px;
        height: 64px;
        text-align: center;
        color: #555;
        border-radius: 50%;
        background: #ddd;
        font-size: 30px;
        line-height: 64px;
      }

      h1 {
        margin: 16px 0;
        color: #212121;
        font-size: 22px;
      }
      .alert-error {
        background: #ffcdd2;
        border: 1px solid #f44336;
        border-radius: 3px;
        color: #333;
        font-size: 14px;
        padding: 10px;
      }
      .alert-success {
        color: #3c763d;
        background-color: #dff0d8;
        border-color: #d6e9c6;
        border: 1px solid transparent;
        border-radius: 3px;
        font-size: 14px;
        padding: 10px;
      }
      .loader {
        height: 100%;
        display: -webkit-flexbox;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-flex-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        justify-content: center;
        margin-top: 100px;
      }
      paper-spinner {
        width: 150px;
        height: 150px;
      }
      .wrapper-btns {
        margin-top: 15px;
        text-align: center;
      }
      paper-button.link {
        color: #757575;
      }

      paper-button.primary {
        background-color: var(--paper-indigo-500);
        color: white;
        --paper-button-raised-keyboard-focus: {
          background-color: var(--paper-pink-a200) !important;
          color: white !important;
        };
      }
      

      input {
        position: relative; /* to make a stacking context */
        outline: none;
        box-shadow: none;
        margin: 0;
        padding: 0;
        width: 100%;
        max-width: 100%;
        border: none;
        color: var(--paper-input-container-input-color, var(--primary-text-color));
        -webkit-appearance: none;
        text-align: inherit;
        vertical-align: bottom;
        /* Firefox sets a min-width on the input, which can cause layout issues */
        min-width: 0;
        @apply --paper-font-subhead;
        @apply --paper-input-container-input;
      }
      iron-icon.success {
        height: 50px;
        width: 50px;
        color: green;
      }

    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
