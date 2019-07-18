$(document).ready(function() {



	$.each($('.single-img-slider__list'), function(i, val) {
		$(val).slick({
			slidesToShow: 1,
			nextArrow: $(val).next(),
			prevArrow: $(val).prev()
		});
	})

	$('.qna__q').on('click', function() {
		$(this).parent().toggleClass('active');
		$(this).next().slideToggle();
	});
	

	$.each($('.packet-tabs'), function(i, val){
		$(val).slick({
			variableWidth: true,
			infinite: true,
			arrows: false
		})
	})

	$.each($('.row-slider'), function (i, val) {
		$(val).slick({
			infinite: true,
			speed: 300,
			slidesToShow: 1,
			centerMode: true,
			variableWidth: true,
			arrows: false
		})
	});

	$.each($('.banner-slider'), function (i, val) {
		$(val).slick({
			infinite: true,
			vertical: true,
			slidesToShow: 1,
			draggable: false,
			speed: 800,
			nextArrow: $(val).prev().find('.prev'),
			prevArrow: $(val).prev().find('.next'),
			responsive: [
			    {
			      breakpoint: 991,
			      settings: {
			        arrows: false
			      }
			    }
			]

		})
	});

	$('.row-slider').on('init reInit afterChange',function(event, slick, currentSlide, nextSlide){

		console.log('fff')
		var amount = slick.slideCount;
		$(this).next().find('.row-slider-range').attr('max',amount);

	})

	$('.main-banner__item.cur').animate({
		opacity: 1
	});

	$('.banner-slider').on('afterChange',function(event, slick, currentSlide, nextSlide){

		$('.main-banner__item.cur').animate({
			opacity: 0
		});

		$('.main-banner__item').removeClass('cur');


		$('.main-banner__item').eq(currentSlide).addClass('cur');

		$('.main-banner__item').eq(currentSlide).animate({
			opacity: 1
		});

	})

	$('.main-banner__item.cur').animate({
		opacity: 1
	}, 500)

	$('.row-slider').on('afterChange',function(e,slick,currentSlide){
		$(this).next().find('.row-slider-range').val(currentSlide+1);
	})

	$('.row-slider-range').on('input change',function(){
		$(this).parent().prev().slick('slickGoTo',this.value-1);
	});

	$('.row-slide').fancybox();


	$('.menu-toggle').on('click', function (e) {
		e.preventDefault();
		$(this).toggleClass('active');

		$('.header__botline').toggleClass('active');

		$('header').toggleClass('mobile');
		$('body').toggleClass('hd');

		if($('.header__botline').hasClass('active')) {
			$('.header__botline').fadeIn();
		} else {
			$('.header__botline').fadeOut();
		}
	});

	$('.header__topline .lang-block').clone().insertAfter('.header__botline .main-menu');
	$('.header__topline .soc-links').clone().insertAfter('.header__botline .main-menu');
	$('.header__topline .call-block').clone().insertAfter('.header__botline .main-menu');
	
	$('.main-menu__item.hasChild').on('click', function() {
		window.innerWidth < 992 ? $(this).find('.sub-menu').slideToggle() : false;

		$(this).toggleClass('active');
	});


	$('.packet-tabs__item').on('click', function(e){
		$('.packet-tabs__item').removeClass('cur');
		$(this).addClass('cur');

		let tabCt = $(this).find('.packet-tabs__link').attr('href');

		$('.tabCt').removeClass('cur');

		$(tabCt).addClass('cur');


	})


	$('.counter__btn').on('click', function(){

		if($(this).hasClass('counter__plus')) {
			var val = parseInt($(this).prev().val());
			val < 999 ? val++ : false
			$(this).prev().val(val)
		} else {
			var val = parseInt($(this).next().val());
			val > 0 ? val-- : false
			$(this).next().val(val)
		}
		
	})



	$.each($('.packet-tabs__item.cur'), function (i, val) {
		let k = $(val).find('.packet-tabs__link').attr('href');

		$('.tabCt').removeClass('cur');

		$(k).addClass('cur');		
	})


	if($('#main-map').length) {
		var myMap;
		ymaps.ready(init);

		function init () {
		    myMap = new ymaps.Map('main-map', {
		        center: [55.769859, 37.662102],
		        zoom: 17,
		        controls: ['zoomControl']
		    }, {
		        zoomControlSize: 'large'
		    });

		    myMap.behaviors.disable('scrollZoom')

		    myMap.geoObjects.add(new ymaps.Placemark([55.769859, 37.662102]))

		}
	}

	if($('#msk-map').length) {
		var myMap;
		ymaps.ready(init);

		function init () {
		    myMap = new ymaps.Map('msk-map', {
		        center: [55.769859, 37.662102],
		        zoom: 17,
		        controls: ['zoomControl']
		    }, {
		        zoomControlSize: 'small'
		    });

		     myMap.geoObjects.add(new ymaps.Placemark([55.769859, 37.662102]))

		    myMap.behaviors.disable('scrollZoom')

		}
	}

	if($('#spb-map').length) {
		var myMap;
		ymaps.ready(init);

		function init () {
		    myMap = new ymaps.Map('spb-map', {
		        center: [55.76, 37.64],
		        zoom: 10,
		        controls: []
		    }, {
		        
		    });

		    myMap.behaviors.disable('scrollZoom')

		}
	}
	if($('#smr-map').length) {
		var myMap;
		ymaps.ready(init);

		function init () {
		    myMap = new ymaps.Map('smr-map', {
		        center: [55.76, 37.64],
		        zoom: 10,
		        controls: []
		    }, {
		        
		    });

		    myMap.behaviors.disable('scrollZoom')

		}
	}
	if($('#nn-map').length) {
		var myMap;
		ymaps.ready(init);

		function init () {
		    myMap = new ymaps.Map('nn-map', {
		        center: [55.76, 37.64],
		        zoom: 10,
		        controls: []
		    }, {
		        
		    });

		    myMap.behaviors.disable('scrollZoom')

		}
	}
	if($('#tvr-map').length) {
		var myMap;
		ymaps.ready(init);

		function init () {
		    myMap = new ymaps.Map('tvr-map', {
		        center: [55.76, 37.64],
		        zoom: 10,
		        controls: []
		    }, {
		        
		    });

		    myMap.behaviors.disable('scrollZoom')

		}
	}
	if($('#ivn-map').length) {
		var myMap;
		ymaps.ready(init);

		function init () {
		    myMap = new ymaps.Map('ivn-map', {
		        center: [55.76, 37.64],
		        zoom: 10,
		        controls: []
		    }, {
		        
		    });

		    myMap.behaviors.disable('scrollZoom')

		}
	}


})

