// Global props
window.customProps = {}

$(document).ready(function(){
    // Always start from the top of the page
    // $(window).scrollTop(0);

    // Set transition delay for fade-in items
    $('.fadein-item').each(function() {
        var $this = $(this);
    });

    // Append a dot to progress bar for each segment on page
    $('.segment-start').each(function(){
       $('.scroll-progress-bar-outer').append('<div class="scroll-progress-dot"></div>');
    });

    // Scroll to section on dot click
    $('.scroll-progress-dot').on('click', function() {
        console.log(jQuery(this).attr('segment-offset'));
        $(window).scrollTop(parseInt(jQuery(this).attr('segment-offset')) - 50);
    });
});

$(window).on('load', function() {
    // Fade out the loading screen
    $('.loading-screen').addClass('loading-done');

    $('.open-form-modal').click(function() {
        $('.form-modal-container').addClass('active');
        $('html').addClass('modal-active');
    });

    $('.background-overlay, .close-button').click(function() {
        $('.form-modal-container').removeClass('active');
        $('html').removeClass('modal-active');
    });

    // Form validation/submit

    // $('#main-contact-form').submit(function(e) {
    //     e.preventDefault();
    //     console.log(e);

    //     var form = $('#main-contact-form'),
    //         formData = {
    //             firstName: form.find('input[name="firstName"]').val(),
    //             lastName: form.find('input[name="lastName"]').val(),
    //             companyName: form.find('input[name="companyName"]').val(),
    //             email: form.find('input[name="email"]').val(),
    //             phone: form.find('input[name="phone"]').val(),
    //         };

    //         console.log(formData);
    //     $.ajax({
    //         type: 'POST',
    //         url: './contactform.php',
    //         data: formData,
    //         dataType: 'json',
    //         contentType: 'application/json; charset=utf-8',
    //         encode: true,
    //     }).done(function(data) {
    //         console.log(data)
    //     }).fail(function(data) {
    //         // form.prepend('<h5 class="error">Error: Could not reach the server.</h5>');
    //         console.log(data);
    //     });
    // });

    $('#main-contact-form').validate({
        // debug: true, 

        rules: {
           firstName: {
                required: true,
                minlength: 2,
           },

           lastName: {
                required: true,
                minlength: 2,
           },

           companyName: {
                required: true,
                minlength: 2,
           },

           email: {
                required: true,
                email: true
           },

           phone: {
                required: true,
                phoneUS: true
           }
        },

        submitHandler: function(form) {
            form.submit(function(e) {
                e.preventDefault();
                var formData = {
                    firstName: form.find('input[name="firstName"]'),
                    lastName: form.find('input[name="lastName"]'),
                    companyName: form.find('input[name="companyName"]'),
                    email: form.find('input[name="email"]'),
                    phone: form.find('input[name="phone"]'),
                };

                $.ajax({
                    type: 'POST',
                    url: 'contactform.php',
                    data: formData,
                    dataType: 'json',
                    encode: true,
                }).done(function(data) {
                    console.log(data)
                }).fail(function(data) {
                    form.prepend('<h5 class="error">Error: Could not reach the server.</h5>');
                });
            });
            console.log('submit handler');
            console.log('TEST 01');
        }
    });

    // Init common functions
    commonFns();
});

// Scroll events
var scrollTimeout;
$(window).on('scroll', function(){
    // window.clearTimeout(scrollTimeout);
    // scrollTimeout = window.setTimeout(function(){
    //     console.log('scrolled! 1');
        var heroContent = $('.hero-section .container');
        
        $(window).scrollTop() > heroContent.offset().top - heroContent.height() ?
            $('.logo').addClass('logo-only') :
            $('.logo').removeClass('logo-only');
        
        // Re-initialize common functions
        commonFns();
    // }, 1);
});

$(window).on('resize', function() {
    // Re-initialize common functions
    commonFns();
});

/*----------------------------------------------*/
/*               Common Functions               */
/* Initialized on load, scroll and resize event */
/*----------------------------------------------*/
function commonFns() {
    // Assign global props
    window.customProps.scrollAmount = $(window).scrollTop();
    window.customProps.windowH = $(window).height();
    window.customProps.totalH = $('body').height();
    window.customProps.scrollPercent = (window.customProps.scrollAmount / (window.customProps.totalH - window.customProps.windowH)) * 100;

    // Parallax Effect
    $('.parallax-item').each(function(i){
        var $this = $(this),
            multiplier = parseInt($this.data('parallax-multiplier')),
            parallaxOffset = parseInt((window.customProps.scrollAmount) * multiplier * 0.01);

            if ($this.parent().hasClass('bg-element')) {
                console.log(i + '------------------------------------------------');
                console.log('scroll amount: ' + (window.customProps.scrollAmount));
                console.log('top offset:' + ($this.offset().top));
                console.log('parallax scroll: ' + parallaxOffset);
                console.log(i + '------------------------------------------------');
            }

            $this.css({
                'transform': 'translateY(' + parallaxOffset + ')',
                '-webkit-transform': 'translateY(' + parallaxOffset + 'px)',
                '-moz-transform': 'translateY(' + parallaxOffset + 'px)',
                '-o-transform': 'translateY(' + parallaxOffset + 'px)',
                '-ms-transform': 'translateY(' + parallaxOffset + 'px)',
            });
    });

    // Element fade-in when scrolling to it
    $('.fadein-item').each(function(){
        var $this = jQuery(this),
            topOffset = $this.offset().top;

            if (window.customProps.scrollAmount >= (topOffset - window.customProps.windowH - 180)) {
                $this.css('transition-delay', ($this.data('animation-delay') * 200) + 'ms');
                $this.addClass('animated');
            }
    });

    /*------------------------------*/
    /* Progress bar functionalities */
    /*------------------------------*/
    // Show/hide progress bar when scrolling to/from hero section
    window.customProps.scrollAmount >= $('.hero-section').outerHeight() ?
        $('header').addClass('past-hero') :
        $('header').removeClass('past-hero');

    // Fill progress bar
    $('.scroll-progress-bar-fill').css('height', Math.ceil(window.customProps.scrollPercent) + '%')
        .attr('fill-percent', Math.ceil(window.customProps.scrollPercent));

    // Progress bar dot positioning and animation
    $('.scroll-progress-dot').each(function(index) {
        var $this = $(this),
            sectionOffset = $('.segment-start').eq(index).offset().top,
            dotOffset = (sectionOffset / (window.customProps.totalH)) * 100;

        // Set position of the dot
        $this.css('top', Math.ceil(dotOffset) + '%')
            .attr('top-offset', Math.ceil(dotOffset))
            .attr('segment-offset', Math.ceil(sectionOffset));

        // Animate to active state if scrolled to respective section
        parseInt($this.attr('top-offset')) <= parseInt($('.scroll-progress-bar-fill').attr('fill-percent')) ?
            $this.addClass('active') :
            $this.removeClass('active');
    });
}

window.customFns = {
}