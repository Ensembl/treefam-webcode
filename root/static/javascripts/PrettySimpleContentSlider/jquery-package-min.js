/*!
 * jQuery JavaScript Library v1.4.2
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Sat Feb 13 22:33:48 2010 -0500
 */
/* jquery easing 1.3 */

jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend( jQuery.easing,
{
def: 'easeOutQuad',
swing: function (x, t, b, c, d) {
return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
},
easeInQuad: function (x, t, b, c, d) {
return c*(t/=d)*t + b;
},
easeOutQuad: function (x, t, b, c, d) {
return -c *(t/=d)*(t-2) + b;
},
easeInOutQuad: function (x, t, b, c, d) {
if ((t/=d/2) < 1) return c/2*t*t + b;
return -c/2 * ((--t)*(t-2) - 1) + b;
},
easeInCubic: function (x, t, b, c, d) {
return c*(t/=d)*t*t + b;
},
easeOutCubic: function (x, t, b, c, d) {
return c*((t=t/d-1)*t*t + 1) + b;
},
easeInOutCubic: function (x, t, b, c, d) {
if ((t/=d/2) < 1) return c/2*t*t*t + b;
return c/2*((t-=2)*t*t + 2) + b;
},
easeInQuart: function (x, t, b, c, d) {
return c*(t/=d)*t*t*t + b;
},
easeOutQuart: function (x, t, b, c, d) {
return -c * ((t=t/d-1)*t*t*t - 1) + b;
},
easeInOutQuart: function (x, t, b, c, d) {
if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
return -c/2 * ((t-=2)*t*t*t - 2) + b;
},
easeInQuint: function (x, t, b, c, d) {
return c*(t/=d)*t*t*t*t + b;
},
easeOutQuint: function (x, t, b, c, d) {
return c*((t=t/d-1)*t*t*t*t + 1) + b;
},
easeInOutQuint: function (x, t, b, c, d) {
if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
return c/2*((t-=2)*t*t*t*t + 2) + b;
},
easeInSine: function (x, t, b, c, d) {
return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
},
easeOutSine: function (x, t, b, c, d) {
return c * Math.sin(t/d * (Math.PI/2)) + b;
},
easeInOutSine: function (x, t, b, c, d) {
return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
},
easeInExpo: function (x, t, b, c, d) {
return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
},
easeOutExpo: function (x, t, b, c, d) {
return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
},
easeInOutExpo: function (x, t, b, c, d) {
if (t==0) return b;
if (t==d) return b+c;
if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
},
easeInCirc: function (x, t, b, c, d) {
return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
},
easeOutCirc: function (x, t, b, c, d) {
return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
},
easeInOutCirc: function (x, t, b, c, d) {
if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
},
easeInElastic: function (x, t, b, c, d) {
var s=1.70158;var p=0;var a=c;
if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
if (a < Math.abs(c)) { a=c; var s=p/4; }
else var s = p/(2*Math.PI) * Math.asin (c/a);
return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
},
easeOutElastic: function (x, t, b, c, d) {
var s=1.70158;var p=0;var a=c;
if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
if (a < Math.abs(c)) { a=c; var s=p/4; }
else var s = p/(2*Math.PI) * Math.asin (c/a);
return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
},
easeInOutElastic: function (x, t, b, c, d) {
var s=1.70158;var p=0;var a=c;
if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
if (a < Math.abs(c)) { a=c; var s=p/4; }
else var s = p/(2*Math.PI) * Math.asin (c/a);
if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
},
easeInBack: function (x, t, b, c, d, s) {
if (s == undefined) s = 1.70158;
return c*(t/=d)*t*((s+1)*t - s) + b;
},
easeOutBack: function (x, t, b, c, d, s) {
if (s == undefined) s = 1.70158;
return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
},
easeInOutBack: function (x, t, b, c, d, s) {
if (s == undefined) s = 1.70158;
if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
},
easeInBounce: function (x, t, b, c, d) {
return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
},
easeOutBounce: function (x, t, b, c, d) {
if ((t/=d) < (1/2.75)) {
return c*(7.5625*t*t) + b;
} else if (t < (2/2.75)) {
return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
} else if (t < (2.5/2.75)) {
return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
} else {
return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
}
},
easeInOutBounce: function (x, t, b, c, d) {
if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
}
});

/* content slider */
/*
jQuery(function () {
    var current = 1;
    var iterate = function () {
        var i = parseInt(current + 1);
        var lis = jQuery('#rotmenu').children('li').size();
        if (i > lis) i = 1;
        display(jQuery('#rotmenu li:nth-child(' + i + ')'));
    }
    display(jQuery('#rotmenu li:first'));
    var slidetime = setInterval(iterate, 5000);
    jQuery('#rotmenu li').bind('click', function (e) {
        clearTimeout(slidetime);
        display(jQuery(this));
        e.preventDefault();
    });

    function display(elem) {
        var $this = elem;
        var repeat = false;
        if (current == parseInt($this.index() + 1)) repeat = true;
        if (!repeat) $this.parent().find('li:nth-child(' + current + ') a').stop(true, true).animate({
            'marginRight': '-20px'
        }, 300, function () {
            jQuery(this).animate({
                'opacity': '0.6'
            }, 700);
        });
        current = parseInt($this.index() + 1);
        var elem = jQuery('a', $this);
        elem.stop(true, true).animate({
            'marginRight': '0px',
            'opacity': '1'
        }, 300);
        var info_elem = elem.next();
        jQuery('#rot1 .heading').animate({
            'left': '-520px'
        }, 500, 'easeOutCirc', function () {
            jQuery('h5', jQuery(this)).html(info_elem.find('.info_heading').html());
            jQuery(this).animate({
                'left': '10px'
            }, 400, 'easeInOutQuad');
        });
        jQuery('#rot1 .description').animate({
            'bottom': '-270px'
        }, 500, 'easeOutCirc', function () {
            jQuery('p', jQuery(this)).html(info_elem.find('.info_description').html());
            jQuery(this).animate({
                'bottom': '0px'
            }, 400, 'easeInOutQuad');
        })
        jQuery('#rot1').prepend(
        jQuery('<img/>', {
            style: 'opacity:0',
            className: 'bg'
        }).load(

        function () {
            jQuery(this).animate({
                'opacity': '1'
            }, 600);
            jQuery('#rot1 img:first').next().animate({
                'opacity': '0'
            }, 700, function () {
                jQuery(this).remove();
            });
        }).attr('src', 'static/images/PrettySimpleContentSlider/' + info_elem.find('.info_image').html()).attr('width', '800').attr('height', '300'));
    }
});

// add by Michael Pehl
*/
jQuery(window).ready(function () {
    jQuery(".rotator , #rotmenu").fadeIn(1200);
});
