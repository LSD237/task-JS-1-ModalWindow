import '@styles/scss/styles.scss'
import '@styles/scss/modal/modal.scss'
import { $S } from './baseS.js'
import './plugins/modalS.js'
import './plugins/confirmS.js'

console.log('Third Page')

let ammunition = [
  { id: 1, title: 'Патроны', price: 700, img: 'https://static.ukrinform.com/photos/2019_09/1569778760-734.jpg' },
  { id: 2, title: 'Бронежилет', price: 2500, img: 'https://punisher.com.ua/content/images/30/480x480l50nn0/bronezhilet-cit-uarm-95815007168060.jpg' },
  { id: 3, title: 'Защитный шлем', price: 1700, img: 'https://bronegilet.ru/upload/iblock/d73/shbm_p_3.jpg' },
  { id: 4, title: 'Автомат', price: 4000, img: 'https://pnevmat24.ru/image/catalog/product/24/61/41ddfdd79ad59a575eeafc92971ecb2f.jpg' }
]

const modalCarCard = $S.modal({
  width: '400px',
  title: 'Стоимость автомобиля',
  closable: true,
  footerButtons: [
    {
      text: 'Закрыть', type: 'primary', handler() {
        modalCarCard.close()
      }
    }
  ]
})

Thtird.addEventListener('click', event => {
  event.preventDefault()
  const id = +event.target.dataset.id
  const btnType = event.target.dataset.btn
  const amm = ammunition.find(а => а.id === id)

  if (btnType === 'price') {
    modalCarCard.setContent(`<p>Цена автомобиля ${amm.title}: <strong>${amm.price} руб.</strong></p>`)
    modalCarCard.open()
  } else if (btnType === 'remove') {
    $S.confirm({
      title: 'Вы уверены?',
      content: `Вы удаляете <strong>${amm.title}</strong>`
    }).then(() => {
      ammunition = ammunition.filter(a => a.id !== id)
      $S.render(ammunition, '#ammunition')
    }).catch((err) => console.log(err))
  }
})

$S.render(ammunition, '#ammunition')

