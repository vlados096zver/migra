
$(document).ready(function () {

let stopWatchingObserver = false;

const observer = new IntersectionObserver((entries) => {
  if (stopWatchingObserver == true) return;
  entries.forEach((entry) => {
    var link = $(`.conversion__link[href='#${entry.target.id}']`);
    if (entry.isIntersecting) {
      // в зоне видимости появился заголовок
      // делаем все пункты не активными
      $(`.conversion__link`).each(function() {
        $(this).removeClass('conversion__link--active');
      });
      // и делаем активными нужные
      link.each(function() {
        $(this).addClass('conversion__link--active');
      })
    } else {
      link.each(function() {
        $(this).removeClass('conversion__link--active');
      });
    }
  });
}, {
  rootMargin: '0px 0px -50% 0px',
  threshold: 0.3
});

// вывод пунктов меню

let titles = $('.editor h2');
let list = $('.visible-links');
for (let title of titles) {
  observer.observe(title)
  $(title).attr('id', `${title.innerText.replace(/\s/gi, "_")}`);
  let link = $(`<li><a class="conversion__link" href="${'#' + title.innerText.replace(/\s/gi, "_")}">${title.innerText}</li>`);
  list.append(link);
}

var $btn = $('.hamburger_wraper');
var $vlinks = $('.conversion__nav .visible-links');
var $hlinks = $('.conversion__nav .hidden-links');

var $conversion = $('.conversion');
var $nav__holder = $('.conversion__holder');
var $nav__block = $('.conversion__block');

var breaks = [];

function updateNav() {
  // если меню не зафиксировано, то не нужно ничего делать
  if (!$conversion.hasClass('is-fixed')) return;

  var availableSpace = Math.max(($btn.hasClass('hidden') ? $nav__holder.width() : $nav__holder.width() - $btn.width() - 30) - $nav__block.width(), 0);

  if ($vlinks.width() > availableSpace || window.matchMedia('(max-width: 1350px)').matches) {
    breaks.push($vlinks.width());

    var $last = $vlinks.children(":not(.conversion__link--hidden)").last();
    $last.clone().prependTo($hlinks);
    // скрываем пункт, а не переносим, как было ранее. Это позволит отобразать его с помощью css, когда меню отфиксируется
    $last.addClass('conversion__link--hidden');

    if ($btn.hasClass('hidden')) {
      $btn.removeClass('hidden');
    }

  } else {

    if (availableSpace > breaks[breaks.length - 1]) {

      // Удаляем из скрытого меню
      $hlinks.children().first().remove();
      // отображаем в зафиксированном меню
      $vlinks.children(".conversion__link--hidden").first().removeClass('conversion__link--hidden');
      breaks.pop();
    }

    if (breaks.length < 1) {
      $btn.addClass('hidden');
      $hlinks.addClass('hidden');
    }
  }

  if ($vlinks.width() > availableSpace) {
    updateNav();
  }
}


$(window).resize(function() {
  updateNav();
});

$btn.on('click', function() {
  $hlinks.toggleClass('hidden');
});


const $block = $('.conversion');
const $header__menu = $('.main-header__menu');
window.addEventListener('scroll', () => {
	const {
		top
	} = $block[0].getBoundingClientRect();
	let menuHeight = $header__menu.height();
	let blockHight = $block.height()
	let is = top <= menuHeight;
	if ($block.hasClass('is-fixed')) {
		if (!is) {
			$block.removeClass('is-fixed');
			$block.css({
				'margin-bottom': ""
			});
		}
	} else {
		if (is) {
			$block.addClass('is-fixed');
			$block.css({
				'margin-bottom': blockHight - $block.height()
			});
		}
	}
	updateNav();
});


updateNav();

$('.conversion__nav').on("click", ".conversion__link", function() {
    stopWatchingObserver = true;
  let elems = $('.conversion__link');
  elems.each(function(index, item) {
    $(item).removeClass('conversion__link--active')
  });
  $(this).addClass('conversion__link--active');
  var target = $(this).attr('href');
  
  $('html, body').animate({

    scrollTop: $(target).offset().top - $('.main-header__menu').height() - $('.conversion').height()
  }, 800, function() {
    stopWatchingObserver = false;
  });
  return false;
});

if(window.matchMedia('(max-width: 1350px)').matches) {
    $('.conversion .hamburger_wraper').on('click', function () {
        $('.conversion .hamburger').toggleClass('line-active');
        //$('.visible-links').slideToggle();
    });
}


// faq items
$('.faq-item-header').click(function(){
    $(this).parent().toggleClass('active');
    $(this).parent().find('.faq-item-body').slideToggle();
});

$('.mobile-wrap').on('click', function () {
    $('.main-header .line-burger').toggleClass('line-active');
    $('.main-header__list').slideToggle();
});

$('.fixed__up').on('click', function() {
    $('html, body').animate({scrollTop: 0}, 700);
});

$(window).resize(function () {
    if ($(window).width() > 1349) {
        $('.main-header__list').attr('style', '');
        $('.main-header .line-burger').removeClass('line-active');
        $('.conversion__list').attr('style', '');
        $('.conversion .line-burger').removeClass('line-active');
    }
});

winWidth = $(window).width();

// menu

(function() {
    var navigation = $('.main-header--fixed')
    var media = matchMedia('(max-width: 1350px)'), matches = media.matches

    listener();

    $(window).resize(listener);
    media.addListener((e) => {
        matches = e.matches;
        listener();
    });

    $(window).scroll(listener);

    function listener() {
        var heightHeader
        var scrollTop = $(window).scrollTop()

        heightHeader = $(".main-header__holder").outerHeight(true);

        if (heightHeader <= scrollTop) {
            $('.main-header__navigation .container--inner').addClass('main-header__navigation--fixed');
            navigation.css({
            'top': -heightHeader + 'px'
            });
        } else {
            $('.main-header__navigation .container--inner').removeClass('main-header__navigation--fixed');
            navigation.css({
            'top': -scrollTop
            });
        }
    }
})();

$('.main-header__button').on('click', function (e) {
    var $parent = $(this).parent();
    $parent.find('.main-header__input').trigger('focus');
    $parent.find('.main-header__search').addClass('main-header__search-active');
});

$('html').on('click', function (e) {
    if (!$(e.target).is('.main-header__button button, .main-header__input, main-header__search-wrap, main-header__search-wrap, main-header__search-btn')) {
        $('.main-header__search').removeClass('main-header__search-active');
    }
});

var flag = true;
$(window).scroll(function() {
   countNum();
});
countNum();

function countNum() {
    if($('.numbers').length > 0) {
        var pos = $('.numbers').offset().top;
        var scroll = $(window).scrollTop();
        var wHeight = $(window).height();

        if(pos < (scroll + wHeight - 200) ) {
            if(flag) {
                flag = false;
                $('.numbers__num').addClass('numbers__num--active');
                $('.numbers__item').each(function() {
                    const $this = $(this);
                    const $value = $this.find('.numbers__num');
                    const value = $this.find('.numbers__num').data('num');
                    $({
                      value: 0
                    }).animate({
                      value,
                    }, {
                      duration: 3000,
                      step: function load_animate(val) {
                        $value.text(`${val.toFixed(0)} `);
                      },
                    });
//                     var i = 1;
//                     var num = $(this).data('num');
//                     var step = 3000 / num;
//                     var add = 1;
//                     if(step < 5) {
//                         if(step < 1) {
//                             add = parseInt(5 / step) + 1;
//                             step *= add;
//                         } else {
//                             add = parseInt((5 / step) * step) + 1;
//                             step *= add;
//                         }
//                     }

//                     var self = $(this);
//                     var timer = setInterval(function() {
//                         if(i <= num) {
//                             self.html(i);
//                         } else {
//                             clearInterval(timer);
//                         }

//                         if(num - i < add) {
//                             add = num - i + 1;
//                         }

//                         i += add;
//                     }, step);
                });
            }
        }
        
    }
}

function validate(input, length, regExp, error, phone) {

    $(input).on('blur keyup', function () {
        var value = $(this).val();
        var that = $(this);

        regExp = regExp == '' ? /./ : regExp;

        if (phone === true) {
            bool_reg = !regExp.test(value);
        } else {
            bool_reg = regExp.test(value);
        }

        if (value.length > length && value !== '' && bool_reg) {
            that.removeClass('form-fail').addClass('form-done');
            $(error).slideUp();
        } else {
            that.removeClass('form-done').addClass('form-fail');
            $(error).slideDown();
        }
    });

}

// деакцивация кнопки если есть поле с ошибкой

function disBtn(input, btn) {
    var input = $(input);
    input.on('blur keyup', function () {

        if (input.hasClass('form-fail')) {
            $(btn).attr('disabled', 'disabled');
        } else {
            $(btn).removeAttr('disabled');
        }

    });

}

// для проверки при нажатии

function valClick(input, length, regExp, error, phone) {
    var value = $(input).val();

    regExp = regExp == '' ? /./ : regExp;

    if (phone === true) {
        bool_reg = regExp.test(value);
    } else {
        bool_reg = !regExp.test(value);
    }

    if (value.length < length || value === '' || bool_reg) {
        $(input).addClass('form-fail');
        $(error).slideDown();
    }
}

//  деакцивация кнопки при нажатии

function disBtnClick(input, btn) {
    var input = $(input);

    if (input.hasClass('form-fail')) {
        $(btn).attr('disabled', 'disabled');
        return false;
    } else {
        return true;
    }

}

// $('input[type="tel"]').mask("+38 (999) 999-99-99");

var regName = /^[a-zA-Zа-яА-ЯёЁ]+/;
var regPhone = /\d+/i;
var regEmail = /[-.\w]+@[-.\w]+\.[-.\w]+/i;

validate('#m_email', 1, regEmail, '.mailing__error--email');
disBtn('#m_email', '.mailing__btn');

// пример использования

$('.contacts__btn').on('click', function() {
    var name = $('#c_fio').val();
    var phone = $('#c_phone').val();
    var msg = $('#c_msg').val();
        
    validate('#c_fio', 1, regName, '.contacts__fail-fio');
    validate('#c_phone', 1, '', '.contacts__fail-phone');
    disBtn('#c_fio, #c_phone', '.contacts__btn');

    valClick('#c_fio', 1, regName, '.contacts__fail-fio');
    valClick('#c_phone', 1, '', '.contacts__fail-phone');
    var btn_bool = disBtnClick('#c_fio, #c_phone', '.contacts__btn');

    if( cCaptcha() && btn_bool ) {
        $.ajax({
            url: myajax.url,
            type: 'POST',
            data: {
                action: 'contact',
                name: name,
                phone: phone,
                msg: msg,
            },
        }).done(function(data) {
            $('#c_fio, #c_phone, #c_msg').val('').removeClass('form-done');
            window.location.href = data;
//             var text = 'Ваше сообщение успещно отправлено!';

//             $('.msg-modal').html(text).addClass('msg-modal-active');
//             setTimeout(function() {
//                 $('.msg-modal').removeClass('msg-modal-active');
//             }, 2500); 
        });

    }
    return false;
});


$('#ov_call_btn').on('click', function() {
    var name = $('#p_fio').val();
    var phone = $('#p_phone').val();
    var country = $('#p_country').val();
    var type = $('#p_type').val();
    
    validate('#p_fio', 1, regName, '.overlay-call .inner__fail-fio');
    validate('#p_country', 1, regName, '.overlay-call .inner__fail-country');
    validate('#p_phone', 1, '', '.overlay-call .inner__fail-phone');
    disBtn('#p_fio, #p_country, #p_phone', '#ov_call_btn');

    valClick('#p_fio', 1, regName, '.overlay-call .inner__fail-fio');
    valClick('#p_country', 1, regName, '.overlay-call .inner__fail-country');
    valClick('#p_phone', 1, '', '.overlay-call .inner__fail-phone');
    var btn_bool = disBtnClick('#p_fio, #p_country, #p_phone', '#ov_call_btn');

    if( callCaptcha() && btn_bool ) {
        $.ajax({
            url: myajax.url,
            type: 'POST',
            data: {
                action: 'call',
                name: name,
                phone: phone,
                country: country,
                type: type,
            },
        }).done(function(data) {
            $('#p_fio, #p_country, #p_phone').val('').removeClass('form-done');
            $('.overlay-call').removeClass('overlay-active');
            window.location.href = data;
            
//             if(type == 'call') {
//                 var text = 'Ваша заявка на звонок успешно отправлена!';
//             } else if(type == 'cooperation') {
//                 var text = 'Ваша заявка на сотрудничество успешно отправлена!';
//             }

//             $('.msg-modal').html(text).addClass('msg-modal-active');
//             setTimeout(function() {
//                 $('.msg-modal').removeClass('msg-modal-active');
//             }, 2500); 
        });

    }
    return false;
});

$('.request__btn').on('click', function() {
    var name = $('#r_name').val();
    var surname = $('#r_surname').val();
    var lastname = $('#r_patronymic').val();
    var country = $('#r_country').val();
    var phone = $('#r_phone').val();
    var email = $('#r_email').val();

    var root = $('#request__root').prop('checked');
    var treatment = $('#request__treatment').prop('checked');
    
    validate('#r_surname', 1, regName, '.request__fail-surname');
    validate('#r_name', 1, regName, '.request__fail-name');
    validate('#r_patronymic', 1, regName, '.request__fail-patronymic');
    validate('#r_country', 1, regName, '.request__fail-country');
    validate('#r_phone', 1, '', '.request__fail-phone');
    validate('#r_email', 1, regEmail, '.request__fail-email');
    disBtn('#r_surname, #r_name, #r_patronymic, #r_country, #r_phone, #r_email', '.request__btn');

    valClick('#r_surname', 1, regName, '.request__fail-surname');
    valClick('#r_name', 1, regName, '.request__fail-name');
    valClick('#r_patronymic', 1, regName, '.request__fail-patronymic');
    valClick('#r_country', 1, regName, '.request__fail-country');
    valClick('#r_phone', 1, '', '.request__fail-phone');
    valClick('#r_email', 1, regEmail, '.request__fail-email');
    var btn_bool = disBtnClick('#r_surname, #r_name, #r_patronymic, #r_country, #r_phone, #r_email', '.request__btn');

    if( requestCaptcha() && btn_bool ) {
        $.ajax({
            url: myajax.url,
            type: 'POST',
            data: {
                action: 'request',
                name: name,
                surname: surname,
                lastname: lastname,
                country: country,
                phone: phone,
                email: email,
                root: root,
                treatment: treatment
            },
        }).done(function(data) {
            $('.overlay-request input').val('').removeClass('form-done');
            $('#request__root, #request__treatment').prop('checked', false);
            $('.overlay-request').removeClass('overlay-active');
            window.location.href = data;
//             var text = 'Ваше заявка успешно отправлена!';

//             $('.msg-modal').html(text).addClass('msg-modal-active');
//             setTimeout(function() {
//                 $('.msg-modal').removeClass('msg-modal-active');
//             }, 2500); 
        });

    }
    return false;
});
    
$('#pa_btn').on('click', function() {
    var name = $('#pa_name').val();
    var surname = $('#pa_first_name').val();
    var lastname = $('#pa_last_name').val();
    var country = $('#pa_country').val();
    var phone = $('#pa_phone').val();
    var email = $('#pa_email').val();
    var service = $('#pa_service').find('.select__item--active').data('value');
    
    validate('#pa_first_name', 1, regName, '.overlay-packages .inner__fail-first_name');
    validate('#pa_name', 1, regName, '.overlay-packages .inner__fail-name');
    validate('#pa_last_name', 1, regName, '.overlay-packages .inner__fail-last_name');
    validate('#pa_country', 1, regName, '.overlay-packages .inner__fail-country');
    validate('#pa_phone', 1, '', '.overlay-packages .inner__fail-phone');
    validate('#pa_email', 1, regEmail, '.overlay-packages .inner__fail-email');
    disBtn('#pa_name, #pa_first_name, #pa_last_name, #pa_country, #pa_phone, #pa_email', '#pa_btn');

    valClick('#pa_first_name', 1, regName, '.overlay-packages .inner__fail-first_name');
    valClick('#pa_name', 1, regName, '.overlay-packages .inner__fail-name');
    valClick('#pa_last_name', 1, regName, '.overlay-packages .inner__fail-last_name');
    valClick('#pa_country', 1, regName, '.overlay-packages .inner__fail-country');
    valClick('#pa_phone', 1, '', '.overlay-packages .inner__fail-phone');
    valClick('#pa_email', 1, regEmail, '.overlay-packages .inner__fail-email');
    var btn_bool = disBtnClick('#pa_name, #pa_first_name, #pa_last_name, #pa_country, #pa_phone, #pa_email', '#pa_btn');

    if( paCaptcha() && btn_bool ) {
        $.ajax({
            url: myajax.url,
            type: 'POST',
            data: {
                action: 'request_service',
                name: name,
                surname: surname,
                lastname: lastname,
                country: country,
                phone: phone,
                email: email,
                service: service,
            },
        }).done(function(data) {
            $('.overlay-packages input').val('').removeClass('form-done');
            $('.overlay-packages').removeClass('overlay-active');
            window.location.href = data;
//             var text = 'Ваше заявка успешно отправлена!';

//             $('.msg-modal').html(text).addClass('msg-modal-active');
//             setTimeout(function() {
//                 $('.msg-modal').removeClass('msg-modal-active');
//             }, 2500); 
        });

    }
    return false;
});

$('.overlay-close').click(function () {
    var overlay = $(this).parents('.overlay');
    overlay.removeClass('overlay-active');
});

$('.btn-national').on('click', function (e) {
    if( !$(e.target).is('.btn__call') ) {
        $('.overlay-request').addClass('overlay-active');
    }
});

$('.main-header__call, .popup__text, .popup__circle, .btn__call, .fixed__call, .steps__item--btn, a[href="#popup-callback"]').on('click', function (e) {
    var title = $(this).data('title');
    var type = 'cooperation';
    if(title === undefined) {
        title = "Заявка на звонок";
        type = 'call';
    }
    $('.overlay-call .inner__subtitle').text(title);
    $('#p_type').val(type);
    $('.overlay-call').addClass('overlay-active');
    return false;
});

$('table').wrap('<div class="about__wrap-table">');

$('.packages__btn').on('click', function() {
    var value = $(this).data('value');
    $('.overlay-packages').addClass('overlay-active');
    $('.inner__holder .select__item').removeClass('select__item--active');
    $('.select__item[data-value="' + value + '"]').addClass('select__item--active');
    var placeholder = $('.select__item[data-value="' + value + '"]').html();
    $('.inner__holder .select__placeholder').html(placeholder);
    return false;
});

    
    // cookie
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }

    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

var is_cookie = getCookie('popup_view');

if(is_cookie == undefined) {
    $('.popup__call').addClass('popup__active');
}

$('.popup__close').on('click', function(e) {
    e.preventDefault();
    setCookie('popup_view', false, {expires: 1209600});
    $('.popup__call').removeClass('popup__active');
});

(function() {

    if( $('#count__sec').length !== 0 ) {

        var count = $('#count__sec').html();
        var text = $('#count__sec--text');
        var textArr = ['секунд', 'секунду', 'секунды', 'секунды'];

        var time = setInterval(function() {
            count--;
            $('#count__sec').html(count);
            text.html(textArr[count]);
            if( count == 0 ) {
                clearTimeout(time);
                window.location.href = '/';
            }
        }, 1000);

    }

})();
    
var select_obj = {};

(function () {

    $('.select__wrap').each(function () {
        var id = $(this).attr('id');
        checkActive(this);
        var placeholder = $(this).find('.select__placeholder').html();
        select_obj[id] = placeholder;
    });

    $('.select__wrap').on('click', '.select__placeholder', function () {
        $('.select__list').removeClass('select__list--active');
        $('.select__placeholder').removeClass('changed');
        $(this).next().toggleClass('select__list--active');
        $(this).toggleClass('changed');
    });

    $('.select__wrap').on('click', '.select__item', function (e) {
        if ($(e.target).is('.select__item--disabled, .select__item--search, .select__item--search input')) {
            return false;
        } else {
            var container = $(this).parents('.select__wrap').attr('id');
            if ($('#' + container + ' .select__item--active').length == 1) {

                if (!$(this).hasClass('select__item--active')) {
                    $('#' + container + ' .select__item').removeClass('select__item--active');
                    $(this).addClass('select__item--active');
                    setPlaceholder(this);
                }

            } else {
                setPlaceholder(this);
                $(this).toggleClass('select__item--active');
            }
            $(this).parent().removeClass('select__list--active');
            $(this).parents('.select__wrap').find('.select__placeholder').removeClass('changed');
        }
    });

    $('body').on('click', function (e) {
        if (!$(e.target).is('.changed, .select__list, .select__item')) {
            $('.select__list').removeClass('select__list--active');
        }
    });

    function setPlaceholder(self) {
        var value = $(self).data('value');
        var value_pl = $(self).html();
        $(self).parents('.select__wrap').find('.select__placeholder').html(value_pl);
    }

    function checkActive(self) {
        var text = $(self).find('.select__item--active').text();
        if (text === undefined || text === '') {
            text = $(self).find('.select__item:eq(0)').addClass('select__item--active').text();
        }
        $(self).find('.select__placeholder').val(text);
    }

})();

function toggleSelect(id, value) {
    $(id).find('.select__item').removeClass('select__item--active');
    $(id).find('.select__item[data-value="' + value + '"]').addClass('select__item--active');
    $(id).find('.select__placeholder').html(value);
}

function getSelValue(id) {
    return $(id).find('.select__item--active').data('value');
}
    
});