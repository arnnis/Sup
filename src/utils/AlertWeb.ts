/*
	Author : Chion82 <tech@chionlab.moe>
	Based on Alert7 by Wildtyto
*/

/* eslint-disable */

/*
 * Alert7.js
 * https://github.com/Wildtyto/Alert7.js
 *
 * Copyright (c) 2016 Wildtyto
 * Licensed under the MIT licenses.
 */
'use strict';

export default () => {
  (function(Alert7) {
    var _TYPE_DEFAULT = 0;
    var _TYPE_CONFIRM = 1;

    (function() {
      Alert7 = window.Alert7 = Alert7 || _getInitialClass();
    })();

    function _getInitialClass() {
      Alert7Class.TYPE_DEFAULT = _TYPE_DEFAULT;
      Alert7Class.TYPE_CONFIRM = _TYPE_CONFIRM;
      Alert7Class.alert = _staticAlert;
      Alert7Class.break = _staticBreak;
      _appendCSS();
      return Alert7Class;
    }

    function _staticAlert(_title, _message) {
      var _tempAlert = new Alert7Class();
      var _args = [].splice.call(arguments, 2);
      _tempAlert.setTitle(_title);
      _tempAlert.setMessage(_message);
      while (_args.length) _tempAlert.addAction(_args.shift(), _args.shift());
      _tempAlert.present();
      return _tempAlert;
    }

    function _staticBreak() {
      throw null;
    }

    function _appendCSS() {
      var _styleElement = document.createElement('style');
      _styleElement.innerHTML =
        '' +
        '#Alert7,' +
        '#Alert7::after,' +
        '#Alert7 .alert7-container {' +
        'vertical-align: middle;' +
        '}' +
        '' +
        '#Alert7 {' +
        'position: fixed;' +
        'top: 0;' +
        'bottom: 0;' +
        'left: 0;' +
        'right: 0;' +
        'z-index: 1001;' +
        'background-color: rgba(0, 0, 0, 0.3);' +
        'text-align: center;' +
        'font-size: 16px;' +
        '-webkit-user-select: none;' +
        '   -moz-user-select: none;' +
        '    -ms-user-select: none;' +
        '        user-select: none;' +
        '}' +
        '' +
        '#Alert7.alert7-confirm {' +
        '}' +
        '' +
        '#Alert7::after,' +
        '#Alert7 .alert7-container {' +
        'display: inline-block;' +
        '}' +
        '' +
        '#Alert7::after {' +
        'height: 100%;' +
        "content: '';" +
        '}' +
        '' +
        '#Alert7 .alert7-container {' +
        'max-width: 240px;' +
        'width: 80%;' +
        'box-sizing: border-box;' +
        'background-color: rgba(255, 255, 255, 0.9);' +
        'border-radius: 18px;' +
        '}' +
        '' +
        '#Alert7 .alert7-title,' +
        '#Alert7 .alert7-message {' +
        'padding-left: 20px;' +
        'padding-right: 20px;' +
        'line-height:1.3em;' +
        '}' +
        '' +
        '#Alert7 .alert7-title {' +
        'padding-top: 20px;' +
        'font-size: 1.1em;' +
        'font-weight: bolder;' +
        'line-height: 2em;' +
        '}' +
        '' +
        '#Alert7 .alert7-message {' +
        'padding-bottom: 14px;' +
        'font-size: 0.8em;' +
        '}' +
        '' +
        '#Alert7 .alert7-actions {' +
        '}' +
        '' +
        '#Alert7 .alert7-actions button.alert7-action-item {' +
        'padding-top: 12px;' +
        'padding-bottom: 12px;' +
        'width: 100%;' +
        'background: 0;' +
        'border: 0;' +
        'border-top: 1px solid #E7E7E7;' +
        'outline: 0;' +
        'color: #59F;' +
        '}' +
        '' +
        '#Alert7 .alert7-actions button.alert7-action-item:last-of-type {' +
        'border-bottom-left-radius: 18px;' +
        'border-bottom-right-radius: 18px;' +
        '}' +
        '' +
        '#Alert7 .alert7-actions button.alert7-action-item:active {' +
        'background-color: #E7E7E7;' +
        '}' +
        '' +
        '#Alert7.alert7-confirm .alert7-actions button.alert7-action-item {' +
        'width: 50%;' +
        '}' +
        '' +
        '#Alert7.alert7-confirm .alert7-actions button.alert7-action-item:first-of-type {' +
        'border-bottom-left-radius: 18px;' +
        '}' +
        '' +
        '#Alert7.alert7-confirm .alert7-actions button.alert7-action-item:first-of-type:last-of-type {' +
        'width: 100%;' +
        '}' +
        '' +
        '#Alert7.alert7-confirm .alert7-actions button.alert7-action-item:nth-of-type(2) {' +
        'border-left: 1px solid #E7E7E7;' +
        'border-bottom-left-radius: 0;' +
        'border-bottom-right-radius: 18px;' +
        '}' +
        '' +
        '#Alert7.alert7-confirm .alert7-actions button.alert7-action-item:nth-of-type(n+3) {' +
        'display: none;' +
        '}' +
        '';
      document.getElementsByTagName('head')[0].appendChild(_styleElement);
    }

    function Alert7Class() {
      this.title = '';
      this.message = '';
      this.type = _TYPE_DEFAULT;
      this.actions = [];
      _createAlertElement(this);
    }

    function _createAlertElement(_self) {
      _self.instanceElement = document.createElement('div');
      _self.instanceElement.id = 'Alert7';
      _self.alertElement = document.createElement('div');
      _self.alertElement.className = 'alert7-container';
      _self.instanceElement.appendChild(_self.alertElement);
      _self.titleElement = document.createElement('div');
      _self.titleElement.className = 'alert7-title';
      _self.alertElement.appendChild(_self.titleElement);
      _self.messageElement = document.createElement('div');
      _self.messageElement.className = 'alert7-message';
      _self.alertElement.appendChild(_self.messageElement);
      _self.actionsElement = document.createElement('div');
      _self.actionsElement.className = 'alert7-actions';
      _self.alertElement.appendChild(_self.actionsElement);
    }

    Alert7Class.prototype.setTitle = function(_text) {
      this.title = _text || '';
    };

    Alert7Class.prototype.setMessage = function(_text) {
      this.message = _text || '';
    };

    Alert7Class.prototype.setType = function(_enum) {
      this.type = _enum || _TYPE_DEFAULT;
    };

    Alert7Class.prototype.addAction = function(_text, _handler) {
      this.actions.push({
        text: _text,
        handler: _handler,
      });
    };

    Alert7Class.prototype.present = function() {
      this.titleElement.innerText = this.titleElement.textContent = this.title;
      this.messageElement.innerHTML = this.messageElement.textContent = this.message;
      switch (this.type) {
        case _TYPE_CONFIRM:
          this.instanceElement.classList.add('alert7-confirm');
      }
      if (!this.actions.length) this.actions.push({});
      _createActions(this);
      document.querySelector('body').appendChild(this.instanceElement);
    };

    Alert7Class.prototype.dismiss = function() {
      if (!this.instanceElement.parentNode) return;
      this.instanceElement.parentNode.removeChild(this.instanceElement);
    };

    function _createActions(_self) {
      var _actions = _self.actions;
      var _numOfAction = _actions.length;
      var _tempActionElement;
      var _datum;
      _self.actionsElement.innerHTML = '';
      while (_numOfAction--) {
        _datum = _actions[_numOfAction];
        _tempActionElement = document.createElement('button');
        _tempActionElement.className = 'alert7-action-item';
        _tempActionElement.innerText = _tempActionElement.textContent = _datum.text || 'OK';
        _tempActionElement.addEventListener('click', _onClick(_datum.handler), false);
        _self.actionsElement.insertBefore(_tempActionElement, _self.actionsElement.firstChild);
      }

      function _onClick(_handler) {
        return function() {
          try {
            if (_handler) _handler();
            _self.dismiss();
          } catch (_error) {}
        };
      }
    }
  })(window.Alert7);

  function escapeHTML(string) {
    let pre = document.createElement('pre');
    let text = document.createTextNode(string);
    pre.appendChild(text);
    return pre.innerHTML;
  }

  const Alert = {
    alert(title, message = '', callbackOrButtons = [{text: 'OK', onPress: f => f}]) {
      let alert = new Alert7();
      alert.setTitle(title);
      alert.setMessage(escapeHTML(message));
      if (typeof callbackOrButtons === 'function') {
        const callback = callbackOrButtons;
        alert.addAction('OK', callback);
      } else {
        const buttons = callbackOrButtons;
        buttons.forEach(button => {
          alert.addAction(button.text, button.onPress || (f => f));
        });
        if (buttons.length === 2) {
          alert.setType(Alert7.TYPE_CONFIRM);
        }
      }
      alert.present();
    },

    prompt(
      title,
      message = '',
      callbackOrButtons = f => f,
      type = 'plain-text',
      defaultValue = '',
    ) {
      function getInputCallback(callback) {
        return () => {
          const text = document.getElementById('alert7-prompt-input').value;
          return callback(text);
        };
      }

      let alert = new Alert7();
      alert.setTitle(title);
      alert.setMessage(
        escapeHTML(message) +
          `<br/><input type="${
            type === 'secure-text' || type === 'login-password' ? 'password' : 'text'
          }" value="${defaultValue}" id="alert7-prompt-input" style="width: 100%; height: 18px; border: 1px solid #ccc;" />`,
      );
      if (typeof callbackOrButtons === 'function') {
        const callback = callbackOrButtons;
        alert.addAction('OK', getInputCallback(callback));
      } else {
        const buttons = callbackOrButtons;
        buttons.forEach(button => {
          alert.addAction(button.text, getInputCallback(button.onPress || (f => f)));
        });
        if (buttons.length === 2) {
          alert.setType(Alert7.TYPE_CONFIRM);
        }
      }
      alert.present();
    },
  };

  return Alert;
};
