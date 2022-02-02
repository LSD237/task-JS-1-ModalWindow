//плагин
import { $ } from '../base.js'

let fruits = [
  { id: 1, title: 'Яблоки', price: 20, img: 'https://st.depositphotos.com/1020804/2370/i/600/depositphotos_23706663-stock-photo-red-apple-with-leaf-and.jpg' },
  { id: 2, title: 'Апельсины', price: 30, img: 'https://static-sl.insales.ru/images/products/1/583/434774599/imgonline-com-ua-Compressed-4rwDeDKaNHjtoyg.jpg' },
  { id: 3, title: 'Манго', price: 40, img: 'https://nebanan.com.ua/wp-content/uploads/2019/11/dizajn-bez-nazvaniya-29-e1602670749739.jpg' },
  { id: 4, title: 'Виноград', price: 50, img: 'https://foodcity.ru/storage/products/October2018/dSTg1Wk44PJACMVYH1Z5.jpg' },
  { id: 5, title: 'Арбуз', price: 60, img: 'https://fruktlove.ru/wp-content/uploads/2019/03/arbuz-krasnyj.jpg' }
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
      !closing && $modal.classList.add('open') //если "закрыто" и нет класса "open" не создавать окно
    },
    close() {
      closing = true
      $modal.classList.remove('open')
      $modal.classList.add('hide') //Добавляется класс со стилями анимации исчезновения
      setTimeout(() => {
        $modal.classList.remove('hide')
        closing = false //удаляется за ненадобностью(окно исчезло, класс анимации исчезновения не нужен при "переиспользовании")
        if (typeof options.onClose === 'function') {
          options.onClose()
        }
      }, ANIMATION_SPEED)
    }
  }

  const listener = event => {
    //*удобно
    //можем посмотреть "кликнутое", есть "dataset"(дата атрибуты на которые удобно назначать слушатель)
    //мы задавали в html дата атрибут "data-close", т.е. его и смотрим - "close"
    // console.log('Clicked', event.target.dataset.close)
    if (event.target.dataset.close) {
      modal.close()
    }
  }

  $modal.addEventListener('click', listener) //если нажат элемент с дата-атрибутом 'close' модалка закрывается

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


const priceModal = $.modal({
  title: "Цена на товар",
  closable: true,
  // content: `
  //   <h4>Modal is working</h4>
  //   <p>Текст в работающем окне</p>
  // `,
  width: "400px",
  footerButtons: [
    {
      text: 'Закрыть', type: 'primary', handler() {
        priceModal.close()
      }
    }
  ]
})

const toHTML = fruit => `
  <div class="col">
    <div class="card">
      <img src="${fruit.img}" alt="${fruit.title}">
      <div class="card-body">
        <h5 class="card-title">${fruit.title}</h5>
        <a class="btn btn-primary" data-btn="price" data-id="${fruit.id}" href="#">Посмотреть цену</a>
        <a class="btn btn-danger" data-btn="remove" data-id="${fruit.id}" href="#">Удалить</a>
      </div>
    </div>
  </div>
`
//динамическое добавление карточек с продуктами
function render() {
  //массив из html строк(шаблонов) соединяется через пустую строку
  const html = fruits.map(fruit => toHTML(fruit)).join('')
  document.querySelector('#fruits').innerHTML = html
}

render()

document.addEventListener('click', event => {
  event.preventDefault() //чтобы при клике в адреской строке не выводился "#" (не менялась адресная строка)
  const btnType = event.target.dataset.btn
  //* присваивается строка дата-атрибута (чтобы далее использовать это значение в методе ".find()" оно преобразовывается в число с помощью "+")
  const id = +event.target.dataset.id
  const fruit = fruits.find(f => f.id === id)

  if (btnType === 'price') {
    priceModal.setContent(`<p>Цена на ${fruit.title}: <strong>${fruit.price}руб.</strong></p>`)
    priceModal.open()
  } else if (btnType === 'remove') {
    $.confirm({
      title: 'Вы уверены?',
      content: `<p>Вы удаляете: <strong>${fruit.title}</strong></p>`
    }).then(() => {
      fruits = fruits.filter(f => f.id !== id)
      render()
    }).catch(() => {
      console.log('Cancel')
    })
  }
})

//**************************************** */
const toHtmlForGroceryList = fruit => `
  <p>${fruit.title}: <strong>${fruit.price} руб.</strong></p>
`

let htmlGroceryList = fruits.map(fruit => toHtmlForGroceryList(fruit)).join('')

const modalGroceryList = $.modal({
  title: 'Перечень продуктов',
  closable: true,
  width: '400px',
  content: `
    <div>${htmlGroceryList}</div>
  `,
  footerButtons: [
    {
      text: 'Закрыть', type: 'primary', handler() {
        modalGroceryList.close()
      }
    }
  ]
})

groceryList.addEventListener('click', event => {
  modalGroceryList.open()
})