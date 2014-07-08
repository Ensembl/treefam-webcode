(function cookieBanner(){
  function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
  }
  function getCookie(c_name) {
    var i, x, y, ARRcookies=document.cookie.split(";");
    for (i=0; i<ARRcookies.length; i++)
    {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
      y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
      x = x.replace(/^\s+|\s+$/g,"");
      if (x==c_name) {
        return unescape(y);
      }
    }
  }
  function slide(element, property, start, end, duration, units) {
    var s = element.style;
    s[property] = start + units;
    
    var pos = start;
    var frame = 0;
    var framerate = 25;
    var one_second = 1000;
    var interval = one_second*duration/framerate;
    var totalframes = one_second*duration/interval;
    var increment = (end-start)/totalframes;
    var tween = function () {
      frame++;
      pos += increment;
      s[property] = Math.round(pos) + units;
      if (frame < totalframes) {
        setTimeout(tween,interval);
      }
    }
    tween();
  }
  function createStyles() {
    var style = document.createElement('style');
    document.head.appendChild(style);
    
    style.type = 'text/css';
    style.innerHTML = " \
      #cookie-banner{position:absolute;top:-9999px;background-color:#222;width:100%;border-bottom:5px solid #222}\n \
      #cookie-banner p{margin:5px 0;color:#eee}\n \
      #cookie-banner a{color:#fff}\n \
      #cookie-banner a#cookie-dismiss{margin:0.5em 0;padding:3px 9px;-moz-border-radius:5px;-khtml-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;font-size:108%;border-width:1px;box-shadow:0px 2px 2px #adadad;-moz-box-shadow:0px 2px 2px #adadad;-khtml-box-shadow:0px 2px 2px #adadad;-webkit-box-shadow:0px 2px 2px #adadad;width:auto;*padding-top:0px;*padding-bottom:0px;border-color:#295c5c;background-color:#207a7a;background-image:-moz-linear-gradient(top, #54bdbd, #207a7a);background-image:-webkit-gradient(linear,left top,left bottom,color-stop(0, #54bdbd),color-stop(1, #207a7a));background-image:-webkit-linear-gradient(#54bdbd, #207a7a);background-image:linear-gradient(top, #54bdbd, #207a7a);filter:progid:DXImageTransform.Microsoft.gradient(startColorStr='#54bdbd', EndColorStr='#207a7a');color:#f8f8f8;text-shadow:#145251 0 1px 1px;display:inline;text-decoration:none;}\n \
    ";
  }
  function createBanner() {
    var banner = document.createElement('div');
    var wrapper = document.createElement('div');
    var inner = document.createElement('div');

    document.body.appendChild(banner);
    banner.appendChild(wrapper);
    wrapper.appendChild(inner);

    banner.id = "cookie-banner";
    wrapper.className = "container_24";
    inner.className = "grid_24";
    inner.innerHTML = " \
      <p>This web site uses cookies to store a small amount of information on your computer, as part of the functioning of the site.</p>\n \
      <p>Cookies used for the operation of the site have already been set.</p>\n \
      <p>To find out more about the cookies we use and how to delete them, see our <a href='/about/cookies'>Cookie</a> and <a href='/about/privacy'>Privacy</a> statements.</p>\n \
      <p><a id='cookie-dismiss' href='#'>Dismiss this notice</a></p>\n \
    ";
  }
  function openBanner() {
    var height = document.getElementById('cookie-banner').offsetHeight;
    slide(document.getElementById('cookie-banner'), 'top', -height, 0, 0.25, 'px');
    slide(document.body, 'paddingTop', 0, height, 0.25, 'px');
  }
  
  function closeBanner() {
    var height = document.getElementById('cookie-banner').offsetHeight;
    slide(document.getElementById('cookie-banner'), 'top', 0, -height, 0.25, 'px');
    slide(document.body, 'paddingTop', height, 0, 0.25, 'px');
  }
  
  function bindReady(handler){
    var called = false     
    function ready() {
      if (called) return
      called = true
      handler()
    }     
    if ( document.addEventListener ) {
      document.addEventListener( "DOMContentLoaded", function(){
        ready()
      }, false )
    } else if ( document.attachEvent ) { 
      if ( document.documentElement.doScroll && window == window.top ) {
        function tryScroll(){
          if (called) return
          if (!document.body) return
          try {
            document.documentElement.doScroll("left")
            ready()
          } catch(e) {
            setTimeout(tryScroll, 0)
          }
        }
        tryScroll()
      }
      document.attachEvent("onreadystatechange", function(){     
        if ( document.readyState === "complete" ) {
          ready()
        }
      })
    }
    if (window.addEventListener)
      window.addEventListener('load', ready, false)
    else if (window.attachEvent)
      window.attachEvent('onload', ready)
    /*  else  // use this 'else' statement for very old browsers :)
      window.onload=ready
    */
  }

  readyList = []      
  function onReady(handler) {  
    if (!readyList.length) { 
      bindReady(function() { 
        for(var i=0; i<readyList.length; i++) { 
          readyList[i]() 
        } 
      }) 
    }   
    readyList.push(handler) 
  }

  function init() {
    if (getCookie('cookies-accepted') !== 'true') {
      createStyles();
      createBanner();
    
      document.getElementById('cookie-dismiss').onclick = function() {
        setCookie('cookies-accepted', 'true', 30);
        closeBanner();
        return false;
      };

      openBanner();
    }
  }
  
  onReady(init);
})()
