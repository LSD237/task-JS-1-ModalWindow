//плагин
import { $ } from '../base.js'

const fruits = [
  { id: 1, title: 'Яблоки', price: 20, img: 'https://st.depositphotos.com/1020804/2370/i/600/depositphotos_23706663-stock-photo-red-apple-with-leaf-and.jpg' },
  { id: 2, title: 'Апельсины', price: 30, img: 'https://static-sl.insales.ru/images/products/1/583/434774599/imgonline-com-ua-Compressed-4rwDeDKaNHjtoyg.jpg' },
  { id: 3, title: 'Манго', price: 40, img: 'https://nebanan.com.ua/wp-content/uploads/2019/11/dizajn-bez-nazvaniya-29-e1602670749739.jpg' }
]


Element.prototype.appendAfter = function (element) { //element это modal-body
  //this это футер. 
  element.parentNode.insertBefore(this, element.nextSibling)
}

function noop() { }

function _createModalFooter(buttons = []) {
  if (buttons.length === 0) {  //если нету кнопок
    return document.createElement('div')
  }

  const wrap = document.createElement('div')
  wrap.classList.add('modal-footer')

  buttons.forEach(btn => {
    const $btn = document.createElement('button')
    $btn.textContent = btn.text
    $btn.classList.add('btn')
    $btn.classList.add(`btn-${btn.type || 'secondary'}`)
    $btn.onclick = btn.handler || noop

    wrap.appendChild($btn)
  })

  return wrap
}
//приватная/системная ф-я (т.е. не должна вызываться напрямую. Начинается с _).
//(должна быть в ф-ии modal (та что ниже) но с вебпаком можем ее вынести, чтобы небыло награмождения внутри modal)
//результат работы этой функции присвоится приватной переменной $modal (в ф-ии ниже)
function _createModal(options) {
  const DEFAULT_WIDTH = '600px'
  const modal = document.createElement('div')
  modal.classList.add('vmodal')
  //элементам, по которым закрывается окно, добавляется дата атрибут "data-close"
  modal.insertAdjacentHTML('afterbegin', `
    <div class="modal-overlay" data-close="true">
      <div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}">
        <div class="modal-header">
          <span class="modal-title">${options.title || 'Окно'}</span>
          ${options.closable ? '<span class="modal-close" data-close="true">&times;</span>' : ''}
        </div>
        <div class="modal-body" data-content>
          ${options.content || ''}
        </div>
      </div>
    </div>
  `)
  const footer = _createModalFooter(options.footerButtons)
  //вставляется футер с помощью присвоенного через prototyp метода 'appendAfter' (классу Element)
  footer.appendAfter(modal.querySelector('[data-content]'))
  document.body.appendChild(modal)
  return modal
}


$.modal = function (options) {
  const ANIMATION_SPEED = 200
  //("$" в начале названия для приватной переменной) для отличия
  const $modal = _createModal(options)
  let closing = false //для защиты от некорректного поведения(открытие окна во время его закрытия)
  let destroyed = false

  const modal = {
    open() {
      if (destroyed) {
        return console.log("Modal is destroyed")
      }
      !closing && $modal.classList.add('open') //если "закрыто" не создавать окно
    },
    close() {
      closing = true
      $modal.classList.remove('open')
      $modal.classList.add('hide') //Добавляется класс со стилями анимации исчезновения
      setTimeout(() => {
        $modal.classList.remove('hide')
        closing = false //удаляется за ненадобностью(окно исчезло, класс анимации исчезновения не нужен при "переиспользовании")
      }, ANIMATION_SPEED)
    }
  }

  const listenr = event => {
    //*удобно
    //можем посмотреть "кликнутое", есть "dataset"(дата атрибуты на которые удобно назначать слушатель)
    //мы задавали в html дата атрибут "data-close", т.е. его и смотрим - "close"
    // console.log('Clicked', event.target.dataset.close)
    if (event.target.dataset.close) {
      modal.close()
    }
  }

  $modal.addEventListener('click', listenr)

  return Object.assign(modal, {
    destroy() {
      //? (обычное) удаление дом-узла из дом-дерева
      $modal.parentNode.removeChild($modal)
      destroyed = true
    },
    setContent(html) {
      //"[data-content]" - селектор атрибута
      $modal.querySelector('[data-content]').innerHTML = html
    }
  })
}


const modal = $.modal({
  title: "Модалочка",
  closable: true,
  content: `
    <h4>Modal is working</h4>
    <p>Текст в работающем окне</p>
  `,
  width: "400px",
  footerButtons: [
    {
      //ХЗ по поводу type: 'primary' т.к. это стили будстрап(нужны свои)
      text: 'Ok', type: 'primary', handler() {
        console.log("Primary btn clicked")
        modal.close()
      }
    },
    {
      text: 'Cancel', type: 'danger', handler() {
        console.log("Danger btn clicked")
        modal.close()
      }
    }
  ]
})

modal.open()
modal.setContent('<p>Датути, это собсна модалочка... нате - распишитесь!</p>')

//!

/*
  1. Динамически на основе массива(fruits) вывести список карточек
  2. Показать цену в модалке (и это должна быть 1 модалка)
*/

// openModal.addEventListener('click', function (event) {
//   modal.open()
// })