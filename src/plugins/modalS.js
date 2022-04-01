import { $S } from "../baseS";

Element.prototype.appendAfter = function (element) {
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

function _createModal(options) {
  const DEFAULT_WIDTH = '600px'
  const modal = document.createElement('div')
  modal.classList.add('vmodal')
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
  footer.appendAfter(modal.querySelector('[data-content]'))
  document.body.appendChild(modal)
  return modal
  let destroyed = false
}

$S.modal = function (options) {
  const ANIMATION_SPEED = 200
  const $modal = _createModal(options)
  let closing = false
  let destroyed = false

  const modal = {
    open() {
      if (destroyed) {
        return console.log("Modal is destroyed")
      }
      !closing && $modal.classList.add('open')
    },
    close() {
      closing = true
      $modal.classList.remove('open')
      $modal.classList.add('hide')
      setTimeout(() => {
        $modal.classList.remove('hide')
        closing = false
        if (typeof options.onClose === 'function') {    //? onClose()
          options.onClose()
        }
      }, ANIMATION_SPEED)
    }
  }

  const listener = event => {
    if (event.target.dataset.close) {
      modal.close()
    }
  }

  $modal.addEventListener('click', listener)

  return Object.assign(modal, {
    destroy() {
      $modal.parentNode.removeChild($modal)
      destroyed = true
    },
    setContent(html) {
      $modal.querySelector('[data-content]').innerHTML = html
    }
  })
}

const toHTML = i => `
<div class="col">
  <div class="card">
    <img src="${i.img}" alt="${i.title}">
    <div class="card-body">
      <h5 class="card-title">${i.title}</h5>
      <a class="btn btn-primary" data-btn="price" data-id="${i.id}" href="#">Посмотреть цену</a>
      <a class="btn btn-danger" data-btn="remove" data-id="${i.id}" href="#">Удалить</a>
    </div>
  </div>
</div>
`

$S.render = function (array, id) {
  const html = array.map(i => toHTML(i)).join('')
  document.querySelector(id).innerHTML = html
}