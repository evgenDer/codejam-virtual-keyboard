
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

  addEventsOnKeyboard() {
    document.addEventListener('keydown', (event) => {
      event.preventDefault();
      this.codeOfElement = event.code;
      this.keyHandlerDown(this.codeOfElement);
    });
    document.addEventListener('keyup', (event) => {
      this.codeOfElement = event.code;
      this.keyHandlerUp(this.codeOfElement);
    });
    document.addEventListener('mousedown', (event) => {
      this.codeOfElement = event.toElement.getAttribute('datacode');
      if (this.codeOfElement != null) {
        this.keyHandlerDown(this.codeOfElement);
      }
    });
    document.addEventListener('mouseup', (event) => {
      this.codeOfElement = event.toElement.getAttribute('datacode');
      if (this.codeOfElement != null) {
        this.keyHandlerUp(this.codeOfElement);
      }
    });
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
        this.deleteLetter(position);
        this.setCaret(position - 1);
        break;
      case 'Delete':
        this.deleteLetter(position + 1);
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
        this.transformShiftKeys();
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
    if (this.isAlt && this.isCtrl) {
      this.changeLanguage();
    }
    this.isAlt = false;
    this.isCtrl = false;
    switch (codeOfElement) {
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isShift = false;
        this.transformShiftKeys();
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

  deleteLetter(position) {
    let textValue = this.textArea.value;
    textValue = textValue.slice(0, position - 1) + textValue.slice(position);
    this.textArea.value = textValue;
  }

  transformShiftKeys() {
    const keyboard = this.keyboard.children;
    for (let i = 0, counterKey = 0; i < keyboard.length && counterKey < this.keys.length; i += 1) {
      if (keyboard[i].textContent.length === 1) {
        let textOfElement;
        if (this.isShift) {
          if (this.lang === 'ru') {
            textOfElement = this.keys[counterKey].ru;
          } else {
            textOfElement = this.keys[counterKey].en;
          }
        } else {
          if (this.lang === 'ru') {
            textOfElement = this.keys[counterKey].ru;
          } else {
            textOfElement = this.keys[counterKey].en;
          }
          textOfElement = this.isCapsLock ? textOfElement[0].toUpperCase()
            : textOfElement[0].toLowerCase();
        }
        keyboard[i].textContent = this.isShift ? textOfElement[1] : textOfElement[0];
        counterKey += 1;
      }
    }
  }


  changeLanguage() {
    if (this.lang === 'en') {
      this.lang = 'ru';
      localStorage.setItem('lang', 'ru');
    } else {
      this.lang = 'en';
      localStorage.setItem('lang', 'en');
    }
    const keyboard = this.keyboard.children;
    for (let i = 0, counterKey = 0; i < keyboard.length && counterKey < this.keys.length; i += 1) {
      let textOfElement;
      if (keyboard[i].textContent.length === 1) {
        if (this.lang === 'en') {
          textOfElement = this.keys[counterKey].en;
        } else {
          textOfElement = this.keys[counterKey].ru;
        }
        textOfElement = this.isCapsLock ? textOfElement[0].toUpperCase()
          : textOfElement[0].toLowerCase();
        keyboard[i].textContent = textOfElement;
        counterKey += 1;
      } else {
        i += 1;
      }
    }
  }

  keysCapsLock() {
    this.isCapsLock = !this.isCapsLock;
    const keyboard = this.keyboard.children;
    for (let i = 0; i < keyboard.length; i += 1) {
      if (keyboard[i].textContent.length === 1) {
        keyboard[i].textContent = this.isCapsLock ? keyboard[i].textContent.toUpperCase()
          : keyboard[i].textContent.toLowerCase();
      }
    }
  }

  printText() {
    this.textArea.setRangeText(this.textAreaValue, this.textArea.selectionStart, this.textArea.selectionEnd, 'end');
    this.textAreaValue = '';
  }
}

window.onload = () => {
  const keyboard = new Keyboard();
  keyboard.addEventsOnKeyboard();
  keyboard.createHtml();
};
