import { $ } from '../base.js'
// import './modal.js'

//подтверждение. 
$.confirm = function (options) {
  return new Promise((resolve, reject) => {
    const modal = $.modal({
      title: options.title,
      width: '400px',
      closable: false,
      content: options.content,
      onClose() {
        modal.destroy()
      },
      footerButtons: [
        {
          text: 'Отмена', type: 'secondary', handler() {
            modal.close()
            reject()
          }
        },
        {
          text: 'Удалить', type: 'danger', handler() {
            modal.close()
            resolve()
          }
        }
      ]
    })

    //т.к. этот блок выполняется асинхронно, анимация пропадает. Делаем "искуственную" задержку(фикс)
    setTimeout(() => modal.open(), 100)
  })
}
