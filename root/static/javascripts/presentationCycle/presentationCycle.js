var presentationCycle = {
    
    /*
     * Presentation Cycle - a jQuery Cycle extension
     * Author:  Gaya Kessler
     * URL:     http://www.gayadesign.com
     * Date:	03-11-09
     */
    
    //slide options
    slideTimeout: 8000,
    containerId: "presentation_container",
    
    //cycle options
    cycleFx: 'scrollHorz',
    cycleSpeed: 600,  
    
    //progressbar options
    barHeight: 14,
    barDisplacement: 20,
    barImgLeft: "static/images/presentationCycle/pc_item_left.gif",
    barImgRight: "static/images/presentationCycle/pc_item_right.gif",
    barImgCenter: "static/images/presentationCycle/pc_item_center.gif",
    barImgBarEmpty: "static/images/presentationCycle/pc_bar_empty.gif",
    barImgBarFull: "static/images/presentationCycle/pc_bar_full.gif",
    
    //variables this script need
    itemCount: 0,
    currentItem: 0,
    itemBarWidth: 0,
    barContainer: "",
    barContainerActive: "",
    barContainerOverflow: "",
    disableAnimation: false,
    
    init: function() {
        
        presentationCycle.itemCount = jQuery('#' + presentationCycle.containerId).children().length;

        presentationCycle.barContainer = jQuery("<div></div>");
        jQuery(presentationCycle.barContainer).addClass("pc_bar_container");
        
        var subtrackSpace = (presentationCycle.itemCount * presentationCycle.barHeight);
        var totalWidth = jQuery('#' + presentationCycle.containerId).innerWidth() - presentationCycle.barDisplacement;
        var fillWidth = Math.floor((totalWidth - subtrackSpace) / (presentationCycle.itemCount - 1));
        presentationCycle.itemBarWidth = fillWidth;
        
        for (var i = 0; i < presentationCycle.itemCount; i++) {
            var item = jQuery("<div>&nbsp;</div>").appendTo(presentationCycle.barContainer);
            var extra_bar = true;
            if (i == 0) {
                jQuery(item).addClass("left");
                jQuery(item).css({
                    backgroundImage: "url(" + presentationCycle.barImgLeft + ")",
                    height: presentationCycle.barHeight + "px",
                    width: presentationCycle.barHeight + "px"
                });
            } else if (i == (presentationCycle.itemCount - 1)) {
                jQuery(item).addClass("right");
                jQuery(item).css({
                    backgroundImage: "url(" + presentationCycle.barImgRight + ")",
                    height: presentationCycle.barHeight + "px",
                    width: presentationCycle.barHeight + "px"
                });
                extra_bar = false;
            } else {
                jQuery(item).addClass("center");
                jQuery(item).css({
                    backgroundImage: "url(" + presentationCycle.barImgCenter + ")",
                    height: presentationCycle.barHeight + "px",
                    width: presentationCycle.barHeight + "px"
                });
            }
            jQuery(item).attr('itemNr', (i + 1));
            jQuery(item).css('cursor', 'pointer');
            jQuery(item).click(function() {
               presentationCycle.gotoSlide(jQuery(this).attr('itemNr'));
            });
            
            if (extra_bar == true) {
                var item = jQuery("<div>&nbsp;</div>").appendTo(presentationCycle.barContainer);
                jQuery(item).addClass("bar");
                 jQuery(item).css({
                    backgroundImage: "url(" + presentationCycle.barImgBarEmpty + ")",
                    height: presentationCycle.barHeight + "px",
                    width: fillWidth + "px"
                });
            }
        }
        
        var overflow = jQuery("<div></div>");
        jQuery(overflow).addClass("pc_bar_container_overflow");
        jQuery(overflow).css({
            overflow: "hidden",
            width: totalWidth + "px"
        });
        var underflow = jQuery("<div></div>");
        jQuery(underflow).addClass("pc_bar_container_underflow").appendTo(overflow);
        
        presentationCycle.barContainerActive = jQuery(presentationCycle.barContainer).clone().appendTo(underflow);
        jQuery(presentationCycle.barContainerActive).removeClass("pc_bar_container");
        jQuery(presentationCycle.barContainerActive).children().each(function () {
            jQuery(this).css({
                backgroundPosition: "right"
            });
            if (jQuery(this).css("background-image").match(presentationCycle.barImgBarEmpty)) {
                var newImg = jQuery(this).css("background-image").replace(presentationCycle.barImgBarEmpty, presentationCycle.barImgBarFull);
                jQuery(this).css("background-image", newImg);
            }
        });
        jQuery(overflow).css({
            width: presentationCycle.barHeight + "px",
            height: presentationCycle.barHeight + "px"
        });
        
        presentationCycle.barContainerOverflow = overflow;
        
        jQuery('#' + presentationCycle.containerId).cycle({
    		fx: presentationCycle.cycleFx,
            speed: presentationCycle.cycleSpeed,
            timeout: presentationCycle.slideTimeout,
            before: function(currSlideElement, nextSlideElement) { presentationCycle.beforeSlide(currSlideElement, nextSlideElement); }
    	});
        
        presentationCycle.barContainer.appendTo(jQuery('#' + presentationCycle.containerId));
        overflow.appendTo(jQuery('#' + presentationCycle.containerId));
        
        var i = 0;
        jQuery(".pc_bar_container_overflow .left, .pc_bar_container_overflow .center, .pc_bar_container_overflow .right").each(function () {
            jQuery(this).attr('itemNr', (i + 1));
            jQuery(this).css('cursor', 'pointer');
            jQuery(this).click(function() {
                presentationCycle.gotoSlide(jQuery(this).attr('itemNr'));
            });
            i++;
        });
    },
    
    beforeSlide: function(currSlideElement, nextSlideElement) {
        if (presentationCycle.currentItem == 0) {
            presentationCycle.currentItem = 1;
        } else {
            presentationCycle.currentItem = (presentationCycle.itemCount - (jQuery(nextSlideElement).nextAll().length)) + 2;
        }
        presentationCycle.animateProcess();
    },
    
    animateProcess: function() {
        var startWidth = (presentationCycle.itemBarWidth * (presentationCycle.currentItem - 1)) + (presentationCycle.barHeight * presentationCycle.currentItem);
        if (presentationCycle.currentItem != presentationCycle.itemCount) {
            var newWidth = (presentationCycle.itemBarWidth * (presentationCycle.currentItem)) + (presentationCycle.barHeight * (presentationCycle.currentItem + 1));   
        } else {
            var newWidth = presentationCycle.barHeight;
        }
        
        jQuery(presentationCycle.barContainerOverflow).css({
            width: startWidth + "px"
        });
        if (presentationCycle.disableAnimation == false) {
            jQuery(presentationCycle.barContainerOverflow).stop().animate({
                width: newWidth + "px"
            }, (presentationCycle.slideTimeout - 100));   
        }
    },
    
    gotoSlide: function(itemNr) {
        jQuery(presentationCycle.barContainerOverflow).stop();
        presentationCycle.disableAnimation = true;
        jQuery('#' + presentationCycle.containerId).cycle((itemNr - 1));
        jQuery('#' + presentationCycle.containerId).cycle('pause');
    }
    
}
