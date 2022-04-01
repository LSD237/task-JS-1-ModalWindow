import '@styles/scss/styles.scss'
import '@styles/scss/modal/modal.scss'
import { $ } from './base.js'
import './plugins/modal.js'
import './plugins/confirm.js'

console.log('home Page')

let fruits = [
  { id: 1, title: 'Яблоки', price: 20, img: 'https://st.depositphotos.com/1020804/2370/i/600/depositphotos_23706663-stock-photo-red-apple-with-leaf-and.jpg' },
  { id: 2, title: 'Апельсины', price: 30, img: 'https://static-sl.insales.ru/images/products/1/583/434774599/imgonline-com-ua-Compressed-4rwDeDKaNHjtoyg.jpg' },
  { id: 3, title: 'Манго', price: 40, img: 'https://nebanan.com.ua/wp-content/uploads/2019/11/dizajn-bez-nazvaniya-29-e1602670749739.jpg' },
  { id: 4, title: 'Виноград', price: 50, img: 'https://foodcity.ru/storage/products/October2018/dSTg1Wk44PJACMVYH1Z5.jpg' },
  { id: 5, title: 'Арбуз', price: 60, img: 'https://fruktlove.ru/wp-content/uploads/2019/03/arbuz-krasnyj.jpg' }
]

const priceModal = $.modal({
  title: "Цена на товара",
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

Home.addEventListener('click', event => {
  //! этот метод отменяет дефолтное поведение(ссылки перестают работать)
  event.preventDefault() //чтобы при клике в адреской строке не выводился "#" (не менялась адресная строка)
  const btnType = event.target.dataset.btn
  //* присваивается строка дата-атрибута (чтобы далее использовать это значение в методе ".find()" оно преобразовывается в число с помощью "+")
  const id = +event.target.dataset.id
  const fruit = fruits.find(f => f.id === id)

  if (btnType === 'price') {
    priceModal.setContent(`<p>Цена на ${fruit.title}: <strong>${fruit.price} руб.</strong></p>`)
    priceModal.open()
  } else if (btnType === 'remove') {
    $.confirm({
      title: 'Вы уверены?',
      content: `<p>Вы удаляете: <strong>${fruit.title}</strong></p>`
    }).then(() => {
      fruits = fruits.filter(f => f.id !== id)
      $.render(fruits, '#fruits')
      modalGroceryList.setContent(`<div>${fruits.map(fruit => toHtmlForGroceryList(fruit)).join('')}</div>`) //для перечьня продуктов
    }).catch((err) => console.log(err))
  }
})

$.render(fruits, '#fruits')

//*****************  список продуктов  *********************** */
const toHtmlForGroceryList = fruit => `
  <p>${fruit.title}: <strong>${fruit.price} руб.</strong></p>
`

const modalGroceryList = $.modal({
  title: 'Перечень продуктов',
  closable: true,
  width: '400px',
  content: `
    <div>${fruits.map(fruit => toHtmlForGroceryList(fruit)).join('')}</div>
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
