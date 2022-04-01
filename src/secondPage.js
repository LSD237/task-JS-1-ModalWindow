import '@styles/scss/styles.scss'
import '@styles/scss/modal/modal.scss'
import { $ } from './base.js'
import './plugins/modal.js'
import './plugins/confirm.js'

console.log('second Page')

let cars = [
  { id: 1, title: 'BMW', price: 3000000, img: 'https://s.auto.drom.ru/photo/VYSNVRTJuris1ic5pN6jLWQKLaMDa7LmQ_h0Z0-0bpKaKNmEl_T9WpgjYKjRM91xzuqqSuNq45f-culU68Xy3OrGorPWfZKhuKfSIZzqzNJhzu1y9wQ.jpg' },
  { id: 2, title: 'AUDI', price: 2500000, img: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/24416e77-f4b4-4b71-8de3-9bb5fa8786bf/d3kuj6h-c6fc6c1e-a550-499c-989d-6e2a4b6c4d38.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI0NDE2ZTc3LWY0YjQtNGI3MS04ZGUzLTliYjVmYTg3ODZiZlwvZDNrdWo2aC1jNmZjNmMxZS1hNTUwLTQ5OWMtOTg5ZC02ZTJhNGI2YzRkMzgucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.tbWHDQ2zh6SCsJ49_Xf2D3s1j2WRfb7H4R6eX2-tS6k' },
  { id: 3, title: 'Mercedes', price: 2700000, img: 'https://wallcars.net/data/media/113/Mercedes-AMG_GT_2015_(40)_2560x1600.jpg' },
  { id: 4, title: 'Toyota', price: 1900000, img: 'https://avtonam.ru/wp-content/uploads/2016/09/toyota-land-cruiser-200-black-met.jpg' }
]

const modalCarCard = $.modal({
  title: 'Стоимость автомобиля',
  closable: true,
  width: '400px',
  footerButtons: [
    {
      text: 'Закрыть', type: 'primary', handler() {
        modalCarCard.close()
      }
    }
  ]
})

Second.addEventListener('click', event => {
  event.preventDefault()
  const id = +event.target.dataset.id
  const btnType = event.target.dataset.btn
  const car = cars.find(c => c.id === id)

  if (btnType === 'price') {
    modalCarCard.setContent(`<p>Цена автомобиля ${car.title}: <strong>${car.price} руб.</strong> </p>`)
    modalCarCard.open()
  } else if (btnType === 'remove') {
    $.confirm({
      title: 'Вы уверены?',
      content: `<p>Вы удаляете: <strong>${car.title}</strong></p>`
    }).then(() => {
      cars = cars.filter(c => c.id !== id)
      $.render(cars, '#cars')
    }).catch((err) => console.log(err))
  }
})

$.render(cars, '#cars')
