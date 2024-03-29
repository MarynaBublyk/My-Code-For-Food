import 'tui-pagination/dist/tui-pagination.css';
import Pagination from 'tui-pagination';
import { fetchAndRender, fetchFoodCategory } from '/js/products.js';

export { funcPagination, loadMoreTrendMoves, pages };

const FILTER = 'filter';

const refs = {
  paginationDop: document.querySelector('.paginationDop'),
  pagination: document.querySelector('.tui-pagination'),
  list: document.querySelector('.product-list'),
  // select: document.querySelector('.select'),
  search: document.querySelector('#search'),
};

const container = document.getElementById('pagination');

let totalPage;
let itemsPerPage;
let visiblePage = 3;
let pageOrigin;

//вытягивает с localStorage номер страницы - если была перегрузка страницы, то нужно вятянуть номер который был до перегрузки и
//  активировать пагинацию на этой же страничке
function storeData() {
  const storedData = localStorage.getItem(FILTER);
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      pageOrigin = parsedData.page;
      itemsPerPage = parsedData.limit;
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  }

}

//создание пагинации
function funcPagination(totalPage) {
  let options = {
    totalItems: totalPage,
    itemsPerPage: itemsPerPage,
    visiblePages: visiblePage,
    page: pageOrigin,
    centerAlign: true,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: {
      page: '<a href="#" class="tui-page-btn">{{page}}</a>',
      currentPage:
        '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
      moveButton:
        '<a href="#" class="tui-page-btn tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</a>',
      disabledMoveButton:
        '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</span>',
      moreButton:
        '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</a>',
    },
  };

  const pagination = new Pagination(container, options);
  pagination.on('beforeMove', loadMoreTrendMoves);
}

//в local storage меняем номер странички на выбраный номер в пагинации. Очищяет карточки и заново отрисовывает новые (новая партия)
function loadMoreTrendMoves(event) {
  const storedData = localStorage.getItem(FILTER);
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      parsedData.page = Number(`${event.page}`);
      localStorage.setItem('filter', JSON.stringify(parsedData));
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  }
  refs.list.innerHTML = '';
  fetchAndRender();
  scroll();
}

// определяем сколько всего будет товаров и вызываем пагинацию передавая этот параметр
async function pages(totalPage) {
  if (totalPage <= Number(itemsPerPage)) {
    refs.pagination.classList.replace('tui-pagination', 'paginationDop');
  } else {
    storeData();
    refs.pagination.classList.replace('paginationDop', 'tui-pagination');
  }
  if (itemsPerPage === 9 || itemsPerPage === 8) {
    visiblePage = 4;
  } else {
    visiblePage = 2;
  }
}


function scroll() {
  const view = document.querySelector('.container-pl');

  let rect = view.getBoundingClientRect();
  let x = rect.left;
  let y = rect.top;
  scrollTo(x, y);
  scrollTo({
    top: 600,
    behavior: 'smooth'
  });
}
