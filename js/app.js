/* ============================================
   Подножный корм — app.js v3
   Мини-игра (50 вопросов, рандомизация),
   форма заказа торта, меню, попап со скидкой
   Работает полностью на клиенте (без VPS)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeader();
  initMobileNav();
  initMenu();
  initGame();
  initCakeForm();
  initPopupDiscount();
  initCakeGallery();
  initLightbox();
});

/* ============================================
   Preloader
   ============================================ */
function initPreloader() {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  window.addEventListener('load', () => {
    setTimeout(() => pre.classList.add('hidden'), 300);
  });
  setTimeout(() => pre.classList.add('hidden'), 3000);
}

/* ============================================
   Header scroll
   ============================================ */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ============================================
   Mobile Nav
   ============================================ */
function initMobileNav() {
  const btn = document.getElementById('burgerBtn');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('active');
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   Меню — фильтрация
   ============================================ */
const MENU_DATA = [
  {
    id: 'breakfast', name: 'Завтраки', icon: '🌅',
    description: 'Каши, сырники, смузи, омлеты, вафли, боулы — всё без добавленного сахара',
    items: [
      { name: 'Омлет или глазунья из двух яиц', desc: 'С зеленью и помидорами черри', price: 310, tags: ['без сахара'] },
      { name: '«Кокосовые колобки»', desc: 'Сырники без глютена с мёдом и урбечом', price: 330, tags: ['без глютена'] },
      { name: '«Зелёные колобки»', desc: 'Сырники без глютена с зеленью и чесноком', price: 380, tags: ['без глютена'] },
      { name: 'Боул «С красной рыбой»', desc: 'Сложные углеводы, овощи, нут, кешью-соус', price: 619, tags: ['высокобелковое'] },
      { name: 'Боул «С копчёным тофу»', desc: 'Сложные углеводы, овощи, нут, кешью-соус', price: 599, tags: ['веган'] },
      { name: 'Вафли с красной рыбой', desc: 'Без глютена, слабосолёная рыба, огурец, кешью-соус', price: 540, tags: ['без глютена'] },
      { name: 'Вафли с бананом и мёдом', desc: 'Без глютена, свежий банан, натуральный мёд', price: 330, tags: ['без глютена'] },
      { name: 'Гранола с молоком', desc: 'Хрустящая гранола, свежее молоко', price: 330, tags: ['без сахара'] },
      { name: 'Зелёная гречка со шпинатом', desc: 'С сыром и варёным яйцом', price: 530, tags: ['высокобелковое'] },
      { name: 'Панкейки с кокосовым йогуртом', desc: 'Без глютена, орехи', price: 330, tags: ['веган', 'без глютена'] }
    ]
  },
  {
    id: 'coffee', name: 'Кофе', icon: '☕',
    description: 'Эспрессо, авторские напитки, кофе в джезве на песке',
    items: [
      { name: 'Эспрессо', desc: '30 мл', price: 139, tags: [] },
      { name: 'Американо', desc: '0.2–0.4 л', price: 189, tags: [] },
      { name: 'Флэт уайт', desc: '', price: 249, tags: [] },
      { name: 'Капучино', desc: '0.2–0.4 л', price: 199, tags: [] },
      { name: 'Латте', desc: '0.2–0.3 л', price: 269, tags: [] },
      { name: 'Раф', desc: '', price: 309, tags: [] },
      { name: 'Кофе по-восточному', desc: 'В джезве на песке, 100 мл', price: 179, tags: ['авторский'] },
      { name: 'Дагестанский капучино', desc: 'С урбечем', price: 269, tags: ['авторский'] },
      { name: 'Ночь в Сириусе', desc: 'Со специями, в турке', price: 209, tags: ['авторский'] },
      { name: 'Хюгге капучино', desc: 'Тыквенный урбеч, мёд, специи', price: 329, tags: ['авторский'] }
    ]
  },
  {
    id: 'cacao', name: 'Какао', icon: '🍫',
    description: 'Церемониальное какао — как пили ацтеки',
    items: [
      { name: 'Церемониальное какао', desc: 'Горькое, с пенкой, по-настоящему', price: 289, tags: ['авторский'] },
      { name: 'Какао с куркумой', desc: 'Золотое, согревающее', price: 319, tags: ['авторский'] },
      { name: 'Какао с перцем и мёдом', desc: 'Пряное, бодрящее', price: 309, tags: ['авторский'] }
    ]
  },
  {
    id: 'drinks', name: 'Напитки', icon: '🌿',
    description: 'Чай, лимонады, растительные напитки',
    items: [
      { name: 'Чай (ассорти)', desc: 'Зелёный, чёрный, травяной, улун', price: 189, tags: [] },
      { name: 'Лимонад домашний', desc: 'Без сахара, сезонный состав', price: 249, tags: ['без сахара'] },
      { name: 'Куркума-латте', desc: 'Растительное молоко, куркума, имбирь', price: 299, tags: ['веган'] },
      { name: 'Мятный морс', desc: 'Свежая мята, клюква', price: 229, tags: ['без сахара'] }
    ]
  },
  {
    id: 'desserts', name: 'Десерты', icon: '🍰',
    description: 'Без сахара, глютена и лактозы — но со вкусом',
    items: [
      { name: 'Шоколадный RAW торт', desc: 'С ягодами: черника, малина, ежевика', price: 1600, tags: ['без глютена'] },
      { name: 'RAW конфеты', desc: 'Шоколадные, с орехами', price: 150, tags: ['без глютена'] },
      { name: 'Бенто-десерт', desc: 'Фиговый крем, кокосовая стружка', price: 450, tags: ['без глютена'] },
      { name: '«Птичье молоко»', desc: 'Крем-бриошь, шоколадная глазурь', price: 1800, tags: ['без глютена'] },
      { name: 'Тарт', desc: 'С миндалём и мёдом', price: 380, tags: ['без глютена'] }
    ]
  }
];

function initMenu() {
  const container = document.getElementById('menuCategories');
  const filters = document.querySelectorAll('.filter-btn');
  if (!container) return;

  MENU_DATA.forEach(cat => {
    const div = document.createElement('div');
    div.className = 'menu-category visible';
    div.dataset.category = cat.id;
    div.innerHTML = `
      <div class="menu-category__header">
        <span class="menu-category__icon">${cat.icon}</span>
        <h3 class="menu-category__name">${cat.name}</h3>
      </div>
      <p class="menu-category__desc">${cat.description}</p>
      <div class="menu-items">
        ${cat.items.map(item => `
          <div class="menu-item">
            <div class="menu-item__header">
              <span class="menu-item__name">${item.name}</span>
              <span class="menu-item__price">${item.price} ₽</span>
            </div>
            ${item.desc ? `<p class="menu-item__desc">${item.desc}</p>` : ''}
            ${item.tags.length ? `<div class="menu-item__tags">${item.tags.map(t => `<span class="tag tag--${getTagClass(t)}">${t}</span>`).join('')}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(div);
  });

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      const cat = btn.dataset.category;
      container.querySelectorAll('.menu-category').forEach(el => {
        el.classList.toggle('visible', cat === 'all' || el.dataset.category === cat);
      });
    });
  });
}

function getTagClass(tag) {
  const map = {
    'веган': 'vegan', 'без глютена': 'gf',
    'высокобелковое': 'protein', 'острое': 'spicy',
    'авторский': 'author'
  };
  return map[tag] || 'default';
}

/* ============================================
   Мини-игра: банк из 50 вопросов.
   За раунд случайно выбираются 5,
   повторные прохождения — другие вопросы.
   ============================================ */
const GAME_QUESTIONS = [
  // --- Сахар и энергия ---
  { q: 'Почему после сладкого булки через час хочется спать?',
    options: ['Сахар даёт быстрый скачок глюкозы, а потом резкий спад — и появляется усталость', 'Это просто так: организм отдыхает после еды', 'Булка тяжёлая, желудку трудно её переварить'],
    correct: 0, explain: 'Сахар → резкий подъём глюкозы → выброс инсулина → резкое падение → сонливость. Фрукты и мёд дают более ровную энергию.' },
  { q: 'Что произойдёт, если съесть целую плитку шоколада за раз?',
    options: ['Станете очень бодрым на весь день', 'Сначала взрыв энергии, а через час — упадок сил и раздражительность', 'Ничего, шоколад же полезный'],
    correct: 1, explain: 'Больше порция — сильнее «качели» глюкозы. Поэтому мы кладём в десерты немного мёда и ягод, а не килограммы сахара.' },
  { q: 'Откуда берётся «вторая жизнь» после сладкого обеда?',
    options: ['Из хорошего настроения', 'Из отложенного эффекта сахара: сначала подъём, потом провал', 'Это нормально, так бывает у всех'],
    correct: 1, explain: 'Эффект сахара откладывается: чем больше съели, тем сильнее провал. Белок и сложные углеводы такого не дают.' },
  { q: 'Чем мёд отличается от обычного сахара?',
    options: ['Ничем, оба одинаково вредны', 'У мёда есть витамины и он слаще — его нужно меньше, плюс он усваивается мягче', 'Мёд вообще нельзя есть'],
    correct: 1, explain: 'Мёд содержит микроэлементы и ферменты, слаще сахара, поэтому используется в меньшем количестве. Это не «суперпродукт», но вариант честнее.' },
  { q: 'Почему на этикетках часто пишут «без добавленного сахара»?',
    options: ['Так модно', 'Сахар может быть скрыт в продуктах: соусы, хлеб, колбаса. Эта надпись означает, что производитель не добавлял его отдельно', 'Это маркетинг без смысла'],
    correct: 1, explain: 'В «полезных» йогуртах, хлебе и соусах сахар прячется под другими названиями. Надпись «без добавленного» — сигнал честности производителя.' },
  { q: 'Что такое «индекс гликемический» простыми словами?',
    options: ['Скорость, с которой продукт повышает сахар в крови', 'Количество калорий в продукте', 'Возраст продукта'],
    correct: 0, explain: 'Высокий ГИ (белый хлеб, сладости) — быстрый подъём и провал. Низкий ГИ (гречка, овощи, бобовые) — ровная энергия.' },
  { q: 'Почему фрукты полезнее конфет, хотя в них тоже сахар?',
    options: ['Во фруктах нет никакого сахара', 'Во фруктах сахар идёт вместе с клетчаткой, витаминами и водой — усваивается постепенно', 'Конфеты полезнее, потому что их меньше едят'],
    correct: 1, explain: 'Клетчатка замедляет всасывание сахара из фруктов — «качели» почти не бывают. Плюс вы получаете витамины и воду.' },
  { q: 'Что лучше перекусить перед сном, чтобы не проснуться голодным?',
    options: ['Плитку шоколада', 'Горсть орехов или йогурт', 'Стакан сладкого чая с печеньем'],
    correct: 1, explain: 'Белок и полезные жиры насыщают надолго и не вызывают скачков сахара. Шоколад и печенье дадут кратковременный подъём.' },
  { q: 'Правда ли, что «сахар вызывает зависимость»?',
    options: ['Нет, это городская легенда', 'Да, сахар воздействует на те же центры удовольствия, что и другие стимуляторы — от него тянет ещё и ещё', 'Только дети к нему зависимы'],
    correct: 1, explain: 'Исследования показывают: сахар активирует систему вознаграждения мозга. Отсюда привычка тянуться к сладкому снова и снова.' },
  { q: 'Что такое «скрытый сахар»?',
    options: ['Сахар, который добавляют в чай дома', 'Сахар в продуктах, где его не ждёшь: кетчуп, йогурты, батончики, готовые соусы', 'Сахар, растворённый в воде'],
    correct: 1, explain: 'В среднем человек съедает 20+ ложек сахара в день, даже не считая — всё из «готовых» продуктов. Читайте состав: «декстроза», «мальтоза», «сок концентрированный» — тоже сахар.' },

  // --- Белок ---
  { q: 'Зачем организму белок?',
    options: ['Только для мышц спортсменов', 'Это «кирпичики» для мышц, кожи, волос, ногтей, гормонов и иммунитета', 'Для красоты только'],
    correct: 1, explain: 'Белок участвует во всём: восстановление клеток, транспорт кислорода, ферменты, гормоны. Норма — примерно 1 г на кг веса в день.' },
  { q: 'Правда ли, что белок нужен только спортсменам?',
    options: ['Да, обычным людям достаточно овощей', 'Нет, всем — просто разным количеством', 'Белок полезен, но только утром'],
    correct: 1, explain: 'Спортсменам нужно чуть больше, но базовая потребность есть у каждого. Яйца, творог, рыба, бобовые — простые источники.' },
  { q: 'Какой продукт даст вам больше всего белка?',
    options: ['Стакан молока', '100 г куриной грудки', 'Ложка мёда'],
    correct: 1, explain: 'В 100 г курицы около 25–30 г белка, в стакане молока — 8–10 г, в мёде белка почти нет (это углевод).' },
  { q: 'Почему веганам сложнее получать белок?',
    options: ['Они совсем не едят белок', 'Растительный белок часто неполноценный — нужно комбинировать разные продукты (например, рис + бобовые)', 'Растения не содержат белка вообще'],
    correct: 1, explain: 'Ни один растительный продукт не содержит все 9 незаменимых аминокислот в идеальных пропорциях. Но комбинация злаков и бобовых закрывает пробел.' },
  { q: 'Когда лучше всего есть белок?',
    options: ['Только на завтрак', 'Равномерно в течение дня — в каждый приём пищи', 'Только вечером перед тренировкой'],
    correct: 1, explain: 'Организму проще использовать белок, если он поступает регулярно, а не всей порцией в один присест.' },
  { q: 'Что общего у яиц, творога и рыбы?',
    options: ['Все они без калорийности', 'Все — источники полноценного белка', 'Все можно есть без ограничения'],
    correct: 1, explain: 'Животный белок содержит полный набор аминокислот. Именно поэтому яйца и творог — классика здорового завтрака.' },
  { q: 'Почему сытные блюда с белком помогают не переедать?',
    options: ['Белок делает еду невкусной', 'Белок дольше переваривается и сильнее снижает аппетит, чем углеводы', 'Это (иллюзия)'],
    correct: 1, explain: 'Исследования показывают: белок — самый сытный макронутриент. Он дольше остаётся в желудке и подавляет голод.' },
  { q: 'Сколько белка нужно среднему взрослому человеку?',
    options: ['Около 1 грамма на кг веса в день', '10 граммов на кг', 'Белок вообще не важен'],
    correct: 0, explain: 'Для человека весом 70 кг — примерно 70 г белка в день. Это 2 яйца, порция творога и кусок курицы или рыбы.' },
  { q: 'Что будет, если есть мало белка?',
    options: ['Ничего, организм сам справится', 'Слабеют мышцы, кожа теряет упругость, медленнее восстанавливаетесь после болезней', 'Станете сильнее'],
    correct: 1, explain: 'Белок — строительный материал. Его дефицит бьёт по мышцам, иммунитету, волосам и ногтям.' },
  { q: 'Какой растительный источник белка самый известный?',
    options: ['Тофу и бобовые (чечевица, нут, фасоль)', 'Картофель', 'Кукурузные хлопья'],
    correct: 0, explain: 'Тофу — соевый «сыр» с высоким содержанием белка. Бобовые в сочетании с крупами дают полный аминокислотный профиль.' },

  // --- Жиры ---
  { q: 'Что такое «полезные жиры» и зачем они нужны?',
    options: ['Это жир от мяса — его нужно избегать', 'Жиры из орехов, авокадо, рыбы — нужны для кожи, мозга и гормонов', 'Это маргарин, только дорогой'],
    correct: 1, explain: 'Полезные жиры (омега-3, мононенасыщенные) — строительный материал для клеток. Без них кожа сохнет, мозг работает медленнее.' },
  { q: 'Почему оливковое масло считается полезным?',
    options: ['Оно самое дешёвое', 'Богато олеиновой кислотой и антиоксидантами, поддерживает сердце', 'Оно не имеет вкуса'],
    correct: 1, explain: 'Средиземноморская диета — одна из самых изученных. Оливковое масло снижает «плохой» холестерин и воспаление.' },
  { q: 'Что такое трансжиры?',
    options: ['Любые жиры, которые твердые при комнатной температуре', 'Искусственно созданные жиры (частично гидрогенезированные масла) — повышают риск сердечных проблем', 'Жиры растительного происхождения'],
    correct: 1, explain: 'Трансжиры встречаются в дешёвой выпечке, фастфуде, некоторых спредах. Они повышают «плохой» холестерин.' },
  { q: 'Зачем организму жир?',
    options: ['Он только откладывается впрок', 'Защищает органы, помогает усваивать витамины A, D, E, K, строит клетки мозга', 'Жир бесполезен'],
    correct: 1, explain: 'Жир — не враг. Без него витамины не усваиваются, кожа сохнет, нарушается работа гормонов.' },
  { q: 'Какая рыба богата омега-3?',
    options: ['Лосось, скумбрия, сардины', 'Карась', 'Любая рыба одинакова'],
    correct: 0, explain: 'Жирная рыба (лосось, скумбрия, сельдь, сардины) — лучший источник омега-3. Достаточно 2 порций в неделю.' },
  { q: 'Почему орехи полезны, но их не стоит есть ведрами?',
    options: ['Орехи не содержат жиров', 'Очень калорийные: горсть (30 г) в день — оптимально, больше — лишние калории', 'Орехи вредны'],
    correct: 1, explain: 'В 100 г орехов ~600 ккал. Горсть в день — норма. Больше — легко набрать лишние кило незаметно.' },
  { q: 'Чем сливочное масло отличается от маргарина?',
    options: ['Ничем', 'Сливочное — натуральный продукт без трансжиров, маргарин часто их содержит', 'Маргарин полезнее'],
    correct: 1, explain: 'Современные маргарины стали лучше, но классическое сливочное масло — прозрачный выбор без искусственных компонентов.' },
  { q: 'Почему авокадо называют «суперфудом»?',
    options: ['Оно вкусное', 'Богато мононенасыщенными жирами, калием, клетчаткой — всё сразу', 'Оно растёт высоко в горах'],
    correct: 1, explain: 'Авокадо сочетает полезные жиры, клетчатку и калий. Идеально для бутербродов и салатов.' },
  { q: 'Что происходит, когда вы едите слишком много насыщенных жиров?',
    options: ['Организм становится сильнее', 'Может повышаться «плохой» холестерин, растут риски для сердца', 'Ничего страшного'],
    correct: 1, explain: 'Насыщенные жиры (жирное мясо, сливки) в умеренных дозах нормальны. Избыток — фактор риска сердечно-сосудистых проблем.' },
  { q: 'Почему льняное семя полезно?',
    options: ['Оно хрустит', 'Источник растительной омега-3 (альфа-линоленовой кислоты) и клетчатки', 'Оно содержит витамин C'],
    correct: 1, explain: 'Льняное семя — один из немногих растительных источников омега-3. Ложка молотого семени в кашу — простой способ добавить пользу.' },

  // --- Углеводы ---
  { q: 'Что такое «сложные углеводы»?',
    options: ['Углеводы, которые сложно приготовить', 'Долгие цепочки (крупы, овощи, бобовые) — медленно расщепляются, дают ровную энергию', 'Углеводы из сладостей'],
    correct: 1, explain: 'Сложные углеводы (гречка, овсянка, картофель, бобовые) расщепляются медленно — вы не «проседаете» через час после обеда.' },
  { q: 'Зачем организму углеводы?',
    options: ['Они не нужны', 'Главный источник быстрой энергии для мозга и мышц', 'Только для похудения'],
    correct: 1, explain: 'Мозг потребляет ~120 г глюкозы в день. Полностью отказываться от углеводов — плохая идея.' },
  { q: 'Что полезнее: белый или цельнозерновой хлеб?',
    options: ['Белый — он мягче', 'Цельнозерновой: в нём больше клетчатки, витаминов и минералов', 'Одинаково'],
    correct: 1, explain: 'При производстве белого хлеба удаляют оболочку зерна — вместе с ней уходит клетчатка и часть питательных веществ.' },
  { q: 'Почему каши — основа здорового завтрака?',
    options: ['Они дешевые', 'Дают сложные углеводы + клетчатку = энергия на несколько часов', 'Они быстро готовятся'],
    correct: 1, explain: 'Овсянка, гречка, рис — медленные углеводы. С ними уровень глюкозы держится стабильно до обеда.' },
  { q: 'Что такое «клетчатка»?',
    options: ['Волокно в ткани', 'Нерастворимые волокна в растениях — улучшают пищеварение, питают полезные бактерии кишечника', 'Тип витамина'],
    correct: 1, explain: 'Клетчатка не усваивается, но критически важна: она «чистит» кишечник, снижает холестерин, помогает контролировать вес.' },
  { q: 'Сколько клетчатки нужно в день?',
    options: ['5–10 г', '25–30 г', '100 г'],
    correct: 1, explain: 'Рекомендуемая норма — 25–30 г. Это овощи, фрукты, крупы, бобовые. Большинство людей получает вдвое меньше.' },
  { q: 'Почему картофель в мундире полезнее фри?',
    options: ['Он дешевле', 'Сохраняет кожуру с клетчаткой и не впитывает масло при жарке', 'Фри не существует'],
    correct: 1, explain: 'При жарке картофель впитывает масло (до 30% веса!). В мундире — минимум обработок, максимум пользы.' },
  { q: 'Что такое «гликемический индекс»?',
    options: ['Скорость повышения сахара в крови после продукта', 'Вес продукта', 'Возраст продукта'],
    correct: 0, explain: 'Высокий ГИ (белый хлеб, сладости) — быстрый подъём и провал. Низкий ГИ (гречка, овощи, бобовые) — ровная энергия.' },
  { q: 'Почему бобовые (нут, чечевица) считаются «суперфудом»?',
    options: ['Они красивые', 'Сочетают белок + сложные углеводы + клетчатку в одном продукте', 'Они не содержат калорий'],
    correct: 1, explain: 'Бобовые — редкое сочетание: растительный белок, медленные углеводы, клетчатка. Основа питания во многих культурах.' },
  { q: 'Что полезнее: яблоко или яблочный сок?',
    options: ['Сок — он быстрее усваивается', 'Яблоко: в нём клетчатка, которая замедляет всасывание сахара', 'Одинаково'],
    correct: 1, explain: 'В соке клетчатка удалена, сахар усваивается мгновенно. Стакан сока = сахар из 2–3 яблок без клетчатки.' },

  // --- Вода и привычки ---
  { q: 'Сколько воды нужно пить в день?',
    options: ['Стакан', 'Около 1,5–2 литров (больше при жаре и нагрузке)', '10 литров'],
    correct: 1, explain: 'Ориентир — 30–35 мл на кг веса. При тренировках и жарке — больше. Чай и супы тоже учитываются.' },
  { q: 'Что произойдёт, если мало пить воду?',
    options: ['Ничего', 'Головная боль, усталость, сухость кожи, замедляется обмен веществ', 'Станете бодрее'],
    correct: 1, explain: 'Даже лёгкое обезвоживание (1–2%) ухудшает концентрацию и настроение. Тело на 60% состоит из воды.' },
  { q: 'Почему зелёный чай полезнее сладкой газировки?',
    options: ['Газировка не содержит сахара', 'В чае антиоксиданы (катехины) и L-теанин — мягко бодрит без скачка кофеина', 'Чай дешевле'],
    correct: 1, explain: 'L-теанин в зелёном чае даёт спокойную сосредоточенность. Газировка — чистый сахар без питательных веществ.' },
  { q: 'Что такое «умеренность» в питании?',
    options: ['Есть только одну еду', 'Сбалансированный рацион без крайностей: не голодать, не переедать', 'Диета на 500 ккал'],
    correct: 1, explain: 'Здоровое питание — это не запрет, а баланс. 80% времени ешьте цельные продукты, 20% — любимые радости.' },
  { q: 'Почему важно есть медленно?',
    options: ['Быстрее съедите', 'Сигнал сытости доходит до мозга через 15–20 минут — если есть быстро, легко переесть', 'Медленно есть скучно'],
    correct: 1, explain: 'Мозгу нужно время, чтобы «понять», что вы наелись. Медленное питание помогает остановиться вовремя.' },
  { q: 'Что полезнее: запекать или жарить овощи?',
    options: ['Жарить — вкуснее', 'Запекать или на пару: сохраняются витамины, нет лишнего масла', 'Одинаково'],
    correct: 1, explain: 'При жарке на масле теряется часть витаминов, добавляются калории. На пару и в духовке — максимум пользы.' },
  { q: 'Почему завтрак называют «самым важным приёмом пищи»?',
    options: ['Так говорят в рекламе', 'После ночного поста организму нужна энергия, чтобы запустить метаболизм на день', 'Завтрак всегда вкусный'],
    correct: 1, explain: 'Пропуск завтрака связан с перееданием в течение дня и снижением концентрации. Но главное — регулярность, а не ритуал.' },
  { q: 'Что такое «суперфуд»?',
    options: ['Секретный рецепт шеф-повара', 'Продукт, богатый микроэлементами: ягоды, зелень, орехи, рыба', 'Любой дорогой продукт'],
    correct: 1, explain: 'Суперфуд — не магия, а концентрация полезных веществ. Черника, шпинат, лосось, льняное семя — примеры.' },
  { q: 'Почему свежие ягоды полезнее варенья?',
    options: ['Варенье красивее', 'При варке разрушаются витамины, а сахара добавляют много', 'Ягоды дороже'],
    correct: 1, explain: 'В варенье на 100 г может быть 50–60% сахара. Свежие ягоды — тот же вкус без избытка.' },
  { q: 'Что лучше для фигуры: диета или сбалансированное питание?',
    options: ['Жёсткая диета — результат быстрее', 'Сбалансированное питание: устойчивый результат без срывов и вреда здоровью', 'Не есть вообще'],
    correct: 1, explain: 'Жёсткие диеты дают временный эффект и «эффект йо-йо». Сбалансированный рацион — долгосрочная стратегия.' },

  // --- Антиоксиданты и витамины ---
  { q: 'Что такое антиоксиданты?',
    options: ['Витамины группы B', 'Молекулы, которые защищают клетки от старения и повреждений', 'Тип белка'],
    correct: 1, explain: 'Антиоксиданты нейтрализуют свободные радикалы — молекулы, которые повреждают клетки. Источники: ягоды, зелень, какао, чай.' },
  { q: 'Какой овощ самый богатый витамином A?',
    options: ['Морковь', 'Огурец', 'Капуста'],
    correct: 0, explain: 'Морковь — рекордсмен по бета-каротину (предшественник витамина A). Важен для зрения и кожи.' },
  { q: 'Зачем организму витамин C?',
    options: ['Для роста волос', 'Поддерживает иммунитет, синтез коллагена, защищает от простуд', 'Для усвоения железа только'],
    correct: 1, explain: 'Витамин C — мощный антиоксидант. Цитрусовые, болгарский перец, киви, смородина — лучшие источники.' },
  { q: 'Почему шпинат называют «суперзеленым»?',
    options: ['Он зелёный', 'Богат железом, фолиевой кислотой, магнием, витаминами A, C, K', 'Он растёт быстро'],
    correct: 1, explain: 'Шпинат — чемпион по плотности питательных веществ. Листья салата беднее, но тоже полезны.' },
  { q: 'Что такое «пищеварение»?',
    options: ['Процесс превращения пищи в энергию и питательные вещества', 'Просто жевание', 'Секретный процесс'],
    correct: 0, explain: 'Пищеварение начинается во рту и заканчивается в кишечнике. Клетчатка и вода помогают ему работать.' },
  { q: 'Почему полезно есть разнообразные овощи?',
    options: ['Так красиво на тарелке', 'Разные цвета = разные витамины и антиоксиданты', 'Овощи всегда дешёвые'],
    correct: 1, explain: '«Ешьте радугу» — правило: красный (ликопин), оранжевый (бета-каротин), зелёный (фолат), фиолетовый (антоцианы).' },
  { q: 'Что такое «микробиом кишечника»?',
    options: ['Вирус', 'Миллиарды полезных бактерий, которые помогают переваривать пищу и укрепляют иммунитет', 'Тип инфекции'],
    correct: 1, explain: 'Клетчатка и ферментированные продукты (кефир, квашеная капуста) питают полезные бактерии кишечника.' },
  { q: 'Почему ферментированные продукты полезны?',
    options: ['Они кислые', 'Содержат пробиотики — живые культуры, которые улучшают микрофлору', 'Они хранятся долго'],
    correct: 1, explain: 'Квашеная капуста, кефир, йогурт, мисо — источники пробиотиков. Поддержка микрофлоры = здоровье кишечника и иммунитета.' },
  { q: 'Что полезнее: свежий салат или тушёные овощи?',
    options: ['Свежий — больше витаминов', 'Тушёные — лучше усваиваются некоторые вещества (ликопин, бета-каротин)', 'Одинаково'],
    correct: 1, explain: 'Легкая термическая обработка выделяет ликопин из томатов и бета-каротин из моркови. Комбинируйте оба варианта.' },
  { q: 'Почему важно читать состав продуктов?',
    options: ['Так интересно', 'Можно обнаружить скрытый сахар, соль, трансжиры и добавки', 'Состав всегда короткий'],
    correct: 1, explain: '«Полезный» батончик может содержать 5 видов сахара. Состав — единственный способ узнать правду о продукте.' }
];

let gameState = { current: 0, score: 0, answered: false, roundQuestions: [], usedIndices: [] };

function initGame() {
  const startBtn = document.getElementById('gameStartBtn');
  const restartBtn = document.getElementById('gameRestartBtn');
  if (!startBtn) return;

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', resetGame);
}

function pickRoundQuestions() {
  // Load used indices from localStorage to avoid repeats across rounds
  let used = [];
  try { used = JSON.parse(localStorage.getItem('pk_game_used') || '[]'); } catch(e) {}

  const all = [...Array(GAME_QUESTIONS.length).keys()];
  // Prefer unused questions
  const unused = all.filter(i => !used.includes(i));
  const pool = unused.length >= 5 ? unused : all;

  // Shuffle and take 5
  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 5);

  // Update used list
  shuffled.forEach(i => {
    if (!used.includes(i)) used.push(i);
  });
  // Reset used if we've gone through most of the bank
  if (used.length >= GAME_QUESTIONS.length * 0.8) used = [];
  try { localStorage.setItem('pk_game_used', JSON.stringify(used)); } catch(e) {}

  return shuffled.map(i => GAME_QUESTIONS[i]);
}

function startGame() {
  gameState = {
    current: 0, score: 0, answered: false,
    roundQuestions: pickRoundQuestions(),
    usedIndices: []
  };
  showScreen('gameQuestion');
  renderQuestion();
}

function resetGame() {
  showScreen('gameStart');
  document.getElementById('gameProgressBar').style.width = '0%';
}

function showScreen(id) {
  document.querySelectorAll('.game-screen').forEach(s => s.classList.add('game-screen--hidden'));
  document.getElementById(id).classList.remove('game-screen--hidden');
}

function renderQuestion() {
  const q = gameState.roundQuestions[gameState.current];
  gameState.answered = false;

  document.getElementById('gameCounter').textContent = `Вопрос ${gameState.current + 1} из 5`;
  document.getElementById('gameProgressBar').style.width = `${(gameState.current / 5) * 100}%`;
  document.getElementById('gameQuestionText').textContent = q.q;
  document.getElementById('gameFeedback').textContent = '';

  const optsContainer = document.getElementById('gameOptions');
  optsContainer.innerHTML = q.options.map((opt, i) =>
    `<button class="game-option" data-index="${i}">${opt}</button>`
  ).join('');

  optsContainer.querySelectorAll('.game-option').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index)));
  });
}

function handleAnswer(index) {
  if (gameState.answered) return;
  gameState.answered = true;

  const q = gameState.roundQuestions[gameState.current];
  const opts = document.querySelectorAll('.game-option');
  const isCorrect = index === q.correct;

  opts[q.correct].classList.add('game-option--correct');
  if (!isCorrect) opts[index].classList.add('game-option--wrong');
  else gameState.score++;

  document.getElementById('gameFeedback').textContent = q.explain;
  opts.forEach(o => o.style.pointerEvents = 'none');

  setTimeout(() => {
    gameState.current++;
    if (gameState.current < 5) renderQuestion();
    else showResult();
  }, 2500);
}

function showResult() {
  showScreen('gameResult');
  document.getElementById('gameProgressBar').style.width = '100%';

  const emoji = document.getElementById('gameResultEmoji');
  const title = document.getElementById('gameResultTitle');
  const text = document.getElementById('gameResultText');
  const discountDiv = document.getElementById('gameDiscount');

  if (gameState.score >= 4) {
    emoji.textContent = '🏆';
    title.textContent = `Отлично! ${gameState.score} из 5`;
    text.textContent = 'Вы настоящий знаток здорового питания. Скидка ваша!';
  } else if (gameState.score >= 3) {
    emoji.textContent = '👏';
    title.textContent = `Хорошо! ${gameState.score} из 5`;
    text.textContent = 'Неплохо! А теперь попробуйте у нас — и узнаете ещё больше на вкус.';
  } else {
    emoji.textContent = '🌱';
    title.textContent = `${gameState.score} из 5 — начало пути!`;
    text.textContent = 'Ничего страшного — именно для этого мы и здесь. Приходите, расскажем и покажем на практике!';
  }

  const code = generatePromoCode();
  document.getElementById('discountCode').textContent = code;
  try { localStorage.setItem('pk_promo_code', code); } catch(e) {}
  discountDiv.style.display = 'block';
}

function generatePromoCode() {
  const prefixes = ['ZHIVY', 'ENERGY', 'VITAMIN', 'NATURE', 'FRESH'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${prefix}-${num}`;
}

/* ============================================
   Форма заказа торта
   + расчёт ориентировочной стоимости
   + номер заказа (сообщение уходит в Telegram)
   ============================================ */
const CAKE_PRICES = {
  'raw-tort': { label: 'Шоколадный RAW торт', base: 1600, perKg: 1600 },
  'ptichye':  { label: '«Птичье молоко»',      base: 1800, perKg: 1800 },
  'bento':    { label: 'Бенто-десерт',         base: 450,  perKg: null },
  'tart':     { label: 'Тарт',                 base: 380,  perKg: null },
  'confetti': { label: 'RAW конфеты',          base: 150,  perPiece: true },
  'custom':   { label: 'Свой вариант',         base: null, perKg: null }
};
const WEIGHT_KG = { '500g': 0.5, '1kg': 1, '1500g': 1.5, '2kg': 2 };

function calcCakePrice(type, weight) {
  const p = CAKE_PRICES[type];
  if (!p || !p.base) return null;

  if (p.perPiece) {
    // Конфеты: считаем штуки по весу (≈30 г/шт), без веса — минимум 5 шт
    const count = weight ? Math.max(5, Math.round(WEIGHT_KG[weight] * 1000 / 30)) : 5;
    return { value: count * p.base, note: `${count} шт × ${p.base} ₽` };
  }
  if (p.perKg && weight) {
    const kg = WEIGHT_KG[weight];
    return { value: Math.round(p.base * kg / 10) * 10, note: `от ${p.base} ₽ за базовый размер` };
  }
  return { value: p.base, note: '' };
}

function formatPrice(v) {
  return v.toLocaleString('ru-RU') + ' ₽';
}

function generateOrderNumber() {
  // Формат: PK-2026-XXXX (последовательный счётчик в localStorage)
  let seq = 1;
  try {
    seq = parseInt(localStorage.getItem('pk_order_seq') || '0', 10) + 1;
    localStorage.setItem('pk_order_seq', String(seq));
  } catch(e) {}
  const year = new Date().getFullYear();
  return `PK-${year}-${String(seq).padStart(4, '0')}`;
}

function initCakeForm() {
  const form = document.getElementById('cakeForm');
  if (!form) return;

  const dateInput = document.getElementById('cakeDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  const promoInput = document.getElementById('cakePromo');
  if (promoInput) {
    try {
      const saved = localStorage.getItem('pk_promo_code');
      if (saved) promoInput.value = saved;
    } catch(e) {}
  }

  // --- Живой расчёт стоимости ---
  const typeSel = document.getElementById('cakeType');
  const weightSel = document.getElementById('cakeWeight');
  const estimateBox = document.getElementById('cakeEstimate');
  const estimateVal = document.getElementById('cakeEstimateValue');

  function updateEstimate() {
    const type = typeSel.value;
    const weight = weightSel.value;

    // Вес имеет смысл только для тортов и конфет
    const weightGroup = document.getElementById('cakeWeightGroup');
    const weightRelevant = ['raw-tort', 'ptichye', 'confetti'].includes(type);
    weightGroup.style.display = weightRelevant ? '' : 'none';
    if (!weightRelevant) weightSel.value = '';

    const result = calcCakePrice(type, weightRelevant ? weight : '');
    if (result) {
      estimateVal.textContent = '~' + formatPrice(result.value) + (result.note ? ` (${result.note})` : '');
      estimateBox.hidden = false;
    } else {
      estimateBox.hidden = true;
    }
  }
  typeSel.addEventListener('change', updateEstimate);
  weightSel.addEventListener('change', updateEstimate);

  // --- Отправка ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const type = form.type.value;

    if (!name || !phone || !type) {
      showToast('Заполните обязательные поля: имя, телефон и тип торта');
      return;
    }

    const phoneClean = phone.replace(/[\s\-\(\)]/g, '');
    if (phoneClean.length < 10) {
      showToast('Проверьте номер телефона');
      return;
    }

    const orderNumber = generateOrderNumber();
    const priceInfo = calcCakePrice(type, weightSel.value);

    const msg = [
      `🎂 ЗАКАЗ №${orderNumber}`,
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Вариант: ${CAKE_PRICES[type].label}`,
      form.date.value ? `Дата: ${formatDate(form.date.value)}` : '',
      weightSel.value && weightSel.value !== '' ? `Вес: ${weightSel.options[weightSel.selectedIndex].text}` : '',
      priceInfo ? `Ориентир: ~${formatPrice(priceInfo.value)}` : '',
      form.wish.value ? `Пожелания: ${form.wish.value}` : '',
      form.promo.value ? `Промокод: ${form.promo.value}` : ''
    ].filter(Boolean).join('\n');

    const tgUrl = `https://t.me/nutri_yulia?text=${encodeURIComponent(msg)}`;

    // Показываем пользователю номер заказа
    form.innerHTML = `
      <div style="text-align:center;padding:32px 0;">
        <div style="font-size:3rem;margin-bottom:16px;">✅</div>
        <h3 style="font-family:var(--font-display);margin-bottom:8px;">Заявка принята!</h3>
        <p style="color:var(--clr-text-muted);margin-bottom:16px;">Номер вашего заказа:</p>
        <div style="font-family:var(--font-display);font-size:1.6rem;font-weight:700;color:var(--clr-primary);padding:14px;background:var(--clr-bg);border:2px dashed var(--clr-primary);border-radius:var(--r-md);margin-bottom:16px;letter-spacing:0.05em;">${orderNumber}</div>
        <p style="color:var(--clr-text-muted);font-size:0.9rem;margin-bottom:24px;">Сохраните номер — по нему мы найдём ваш заказ.<br>Перезвоним в течение часа (08:00–20:00).</p>
        <a href="${tgUrl}" target="_blank" rel="noopener" class="btn btn--primary">Отправить детали в Telegram</a>
      </div>
    `;
    window.open(tgUrl, '_blank');
  });
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ============================================
   Toast
   ============================================ */
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.cssText = `
      position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%) translateY(20px);
      background: var(--clr-text); color: #fff; padding: 14px 24px;
      border-radius: var(--r-full); font-size: 0.88rem; z-index: 10001;
      opacity: 0; transition: all 0.3s var(--ease);
      box-shadow: var(--shadow-lg); white-space: nowrap;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3000);
}

/* ============================================
   Выпадающая скидка (popup)
   Появляется через 8 секунд или при скролле 50%
   ============================================ */
function initPopupDiscount() {
  const popup = document.getElementById('popupDiscount');
  if (!popup) return;

  let shown = false;
  let timerId = null;

  function showPopup() {
    if (shown) return;
    try {
      if (localStorage.getItem('pk_promo_code')) return;
    } catch(e) {}
    shown = true;
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    startTimer();
  }

  function closePopup() {
    popup.classList.remove('active');
    document.body.style.overflow = '';
    if (timerId) clearInterval(timerId);
  }

  setTimeout(showPopup, 8000);

  let scrollTriggered = false;
  window.addEventListener('scroll', () => {
    if (scrollTriggered) return;
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (scrolled > 0.5) { scrollTriggered = true; showPopup(); }
  }, { passive: true });

  popup.querySelectorAll('[data-close-popup]').forEach(el => {
    el.addEventListener('click', closePopup);
  });

  function startTimer() {
    let seconds = 600;
    const timerEl = document.getElementById('popupTimer');
    if (!timerEl) return;
    timerId = setInterval(() => {
      seconds--;
      if (seconds <= 0) { clearInterval(timerId); timerEl.textContent = 'время вышло'; return; }
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
    }, 1000);
  }
}

/* ============================================
   Галерея тортов — циклическая смена фото
   ============================================ */
const CAKE_IMAGES = [
  'Фото/Торт/Raw торт.jpg',
  'Фото/Торт/Птичье молоко.jpg',
  'Фото/Торт/Бенто.jpg',
  'Фото/Торт/Тарт.jpg',
  'Фото/Торт/Raw конфеты.jpg'
];

function initCakeGallery() {
  const thumbs = document.querySelectorAll('.cake-thumb');
  const mainImg = document.querySelector('.cake-gallery__main img');
  if (!thumbs.length || !mainImg) return;

  let currentIdx = 0;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const idx = parseInt(thumb.dataset.index);
      setMainImage(idx);
    });
  });

  // Auto-rotate every 4 seconds
  let autoRotate = setInterval(() => {
    currentIdx = (currentIdx + 1) % CAKE_IMAGES.length;
    setMainImage(currentIdx);
  }, 4000);

  // Pause on hover
  const gallery = document.querySelector('.cake-gallery');
  if (gallery) {
    gallery.addEventListener('mouseenter', () => clearInterval(autoRotate));
    gallery.addEventListener('mouseleave', () => {
      autoRotate = setInterval(() => {
        currentIdx = (currentIdx + 1) % CAKE_IMAGES.length;
        setMainImage(currentIdx);
      }, 4000);
    });
  }

  function setMainImage(idx) {
    currentIdx = idx;
    thumbs.forEach((t, i) => t.classList.toggle('cake-thumb--active', i === idx));
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = CAKE_IMAGES[idx];
      mainImg.style.opacity = '1';
    }, 200);
  }
}

/* ============================================
   Lightbox — просмотр фото на весь экран
   Клик по фото меню и главному фото торта
   ============================================ */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!lb || !img) return;

  function open(src, alt) {
    // Для превью с base64 src уже data-uri; для деплоя — относительный путь
    img.src = src;
    img.alt = alt || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    img.src = '';
  }

  // Фото в блоке «Что попробовать»
  document.querySelectorAll('.menu-photos img').forEach(p => {
    p.addEventListener('click', () => open(p.src, p.alt));
  });

  // Главное фото в блоке «На заказ»
  const mainCake = document.querySelector('.cake-gallery__main img');
  if (mainCake) {
    mainCake.addEventListener('click', () => open(mainCake.src, mainCake.alt));
  }

  // Закрытие
  lb.querySelectorAll('[data-close-lightbox]').forEach(el => {
    el.addEventListener('click', close);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('active')) close();
  });
}
