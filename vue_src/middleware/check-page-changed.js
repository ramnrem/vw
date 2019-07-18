import store from '../store'
import { MessageBox } from 'element-ui';

export default (to, from, next) => {
  if (store.getters['page/changed']) {
    next(false)

    MessageBox.confirm('У вас есть несохраненные изменения, сохранить и продолжить?', 'Внимание!', {
      distinguishCancelAndClose: true,
      confirmButtonText: 'Сохранить',
      cancelButtonText: 'Отменить изминения',
      type: 'warning',
      dangerouslyUseHTMLString: true,
      closeOnHashChange: false
    }).then(() => {
      store.getters['page/callback']()
      store.dispatch('page/setChanged', false)

      next()
    }).catch(action => {
      if (action === 'cancel') {
        store.dispatch('page/setChanged', false)
        next()
      } else {
        next(false)
      }
    });
    
  } else {
    store.dispatch('page/setChanged', false)

    next()
  }
}
