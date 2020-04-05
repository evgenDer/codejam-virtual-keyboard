
// eslint-disable-next-line import/extensions
import KEYBOARD from './src/keyboard.js';

class Keyboard {
  constructor() {
    this.codeOfElement = '';
    this.isCapsLock = false;
    this.isShift = false;
    this.isCtrl = false;
    this.isAlt = false;
    this.nodeShift = null;
    this.keys = [];
    this.textAreaValue = '';
    this.lang = localStorage.getItem('language') || 'en';
    this.textArea = document.createElement('textarea');
    this.keyboard = document.createElement('div');
    this.wrapper = document.createElement('div');
    this.textArea.id = 'textarea';
    this.textArea.focus();
  }

  createHtml() {
    this.textArea.id = 'textarea';
    this.wrapper.classList.add('wrapper');
    this.textArea.classList.add('textarea');
    this.keyboard.classList.add('keyboard');
    const info = document.createElement('p');
    info.textContent = 'Для смены языка нажмите: \'Ctrl\' + \'Alt\'';
    this.textArea.focus();
    document.body.append(this.wrapper);
    this.wrapper.append(this.textArea, this.keyboard, info);
    this.createKeys();
  }

  createKeys() {
    for (let i = 0; i < KEYBOARD.length; i += 1) {
      for (let j = 0; j < KEYBOARD[i].length; j += 1) {
        const key = document.createElement('div');
        key.classList.add('keyboard__key');
        if (Object.prototype.hasOwnProperty.call(KEYBOARD[i][j], 'width')) {
          key.style.width = KEYBOARD[i][j].width;
          key.insertAdjacentHTML('beforeend', Object.entries(KEYBOARD[i][j])[1][1]);
        }
        if (Object.keys(KEYBOARD[i][j]).length === 2) {
          key.classList.add('keyboard__key_long');
          key.insertAdjacentHTML('beforeend', Object.entries(KEYBOARD[i][j])[1][1]);
        }
        if (Object.prototype.hasOwnProperty.call(KEYBOARD[i][j], 'en')) {
          if (this.lang === 'en') {
            key.insertAdjacentHTML('afterbegin', KEYBOARD[i][j].en[0]);
            this.keys.push(KEYBOARD[i][j]);
          } else {
            key.insertAdjacentHTML('afterbegin', KEYBOARD[i][j].ru[0]);
            this.keys.push(this.keys.push(KEYBOARD[i][j].ru[0]));
          }
        }
        key.setAttribute('datacode', KEYBOARD[i][j].code);
        this.keyboard.append(key);
      }
      this.keyboard.append('\n');
    }
  }

  setCaret(position) {
    this.textArea.selectionStart = position;
    this.textArea.selectionEnd = position;
  }

  keyHandlerDown(codeOfElement) {
    this.textArea.focus();
    const position = this.textArea.selectionStart;
    switch (codeOfElement) {
      case 'Backspace':
        this.setCaret(position - 1);
        break;
      case 'Delete':
        this.setCaret(position);
        break;
      case 'CapsLock':
        document.querySelector(`div.keyboard__key[datacode="${codeOfElement}"]`).classList.toggle('key_active');
        this.keysCapsLock();
        break;
      case 'ArrowUp':
        this.textArea.selectionStart = 0;
        this.textArea.selectionEnd = this.textArea.selectionStart;
        this.textArea.focus();
        break;
      case 'ArrowDown':
        this.textArea.selectionStart = this.textArea.value.length;
        this.textArea.selectionEnd = this.textArea.selectionStart;
        this.textArea.focus();
        break;
      case 'ArrowRight':
        this.textArea.selectionStart += 1;
        this.textArea.selectionEnd = this.textArea.selectionStart;
        break;
      case 'ArrowLeft':
        this.textArea.selectionStart -= 1;
        this.textArea.selectionEnd = this.textArea.selectionStart;
        this.setCaret(this.textArea.selectionStart);
        break;

      case 'Enter':
        this.textArea.setRangeText('\n', this.textArea.selectionStart, this.textArea.selectionEnd, 'end');
        break;

      case 'ShiftLeft':
      case 'ShiftRight':
        this.isShift = true;
        break;
      case 'ControlLeft':
      case 'ControlRight':
        this.textAreaValue += '';
        this.printText();
        this.isCtrl = true;
        break;

      case 'AltLeft':
      case 'AltRight':
        this.isAlt = true;
        this.textAreaValue += '';
        this.printText();
        break;

      case 'Tab':
        this.textAreaValue += '   ';
        this.printText();
        break;

      case 'Space':
        this.textAreaValue += ' ';
        this.printText();
        break;

      case 'MetaLeft':
        this.textAreaValue += '';
        break;

      default:
        this.textAreaValue += document.querySelector(`div.keyboard__key[datacode="${codeOfElement}"]`).textContent;
        this.printText();
        break;
    }
    if (codeOfElement !== 'CapsLock') {
      const currentKey = document.querySelector(`div.keyboard__key[datacode="${codeOfElement}"]`);
      currentKey.classList.add('key_active');
    }
  }

  keyHandlerUp(codeOfElement) {
    this.isAlt = false;
    this.isCtrl = false;
    switch (codeOfElement) {
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isShift = false;
        break;
      case 'ControlLeft':
      case 'AltLeft':
      case 'MetaLeft':
        break;
      default:
        break;
    }
    if (codeOfElement !== 'CapsLock') {
      const currentKey = document.querySelector(`div.keyboard__key[datacode="${codeOfElement}"]`);
      currentKey.classList.remove('key_active');
    }
  }
}


window.onload = () => {
  const keyboard = new Keyboard();
  keyboard.createHtml();
};
