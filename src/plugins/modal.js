//плагин
import { $ } from '../base.js'
//приватная/системная ф-я (т.е. не должна вызываться напрямую. Начинается с _).
//(должна быть в ф-ии modal (та что ниже) но с вебпаком можем ее вынести, чтобы небыло награмождения внутри modal)
//результат работы этой функции присвоится приватной переменной $modal (в ф-ии ниже)
function _createModal(options) {
  const modal = document.createElement('div')
  modal.classList.add('vmodal')
  modal.insertAdjacentHTML('afterbegin', `
    <div class="modal-overlay">
      <div class="modal-window">
        <div class="modal-header">
          <span class="modal-title">Modal title</span>
          <span class="modal-close">&times;</span>
        </div>
        <div class="modal-body">
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
        </div>
        <div class="modal-footer">
          <button>Ok</button>
          <button>Cancel</button>
        </div>
      </div>
    </div>
  `)
  document.body.appendChild(modal)
  return modal
}

/* 
  title: string //для параметра options, чтобы он применялся для html модалки
  closable: boolean //показываетяс крестик или нет
  content: string //наполнение для текста в модалке
  width: string ("400px") //ширина модалки
  destroy(): возвращает ничего //реализовать метод
  Закрытие окна по крестику и фону с анимацией
*/

$.modal = function (options) {
  const ANIMATION_SPEED = 200
  let closing = false //для защиты от некорректного поведения(открытие окна во время его закрытия)
  //("$"" в начале названия для приватной переменной) для отличия
  const $modal = _createModal(options)

  return {
    open() {
      !closing && $modal.classList.add('open') //если "закрыто" не создавать окно
    },
    close() {
      closing = true
      $modal.classList.remove('open')
      $modal.classList.add('hide') //Добавляется класс со стилями анимации исчезновения
      setTimeout(() => {
        $modal.classList.remove('hide')
        closing = false //удаляется за ненадобностью(окно исчезло, анимация не нужна при "переиспользовании")
      }, ANIMATION_SPEED)
    },
    destroy() { }
  }
}