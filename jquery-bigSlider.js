(function($) {
    $.fn.bigSlider = function(options) {
        var settings = $.extend({
            animationDuration: 200,
            focusType: 'default'
        }, options);

        this.each(function() {
            $(this).css({
                position: 'relative',
                overflow: 'hidden'
            });

            var images = $(this).find('img');
            images.each(function() {
                $(this).css({
                    position: 'absolute',
                    height: '100%'
                });
            });

            var arrowInitialColor = 'rgba(0, 0, 0, 0.3)';
            var arrowHoverColor = 'rgba(0, 0, 0, 0.5)';
            var leftArrow = $('<div>').text('<').css({
                'background-color': arrowInitialColor,
                position: 'absolute',
                left: 0,
                color: '#fff',
                padding: '20px 15px',
                cursor: 'pointer'
            });
            var rightArrow = leftArrow.clone().text('>').css({
                left: 'auto',
                right: 0
            });
            var leftShadow = $('<div>').css({
                'background-color': 'rgba(0, 0, 0, 0.25)',
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%'
            });
            var rightShadow = leftShadow.clone().css({
                left: 'auto',
                right: 0
            });
            if (settings.focusType == 'enlarge') {
                $([leftShadow, rightShadow]).each(function() {
                    // $(this).hide();
                });
            }
            $(this)
                .append(leftShadow)
                .append(rightShadow)
                .append(leftArrow)
                .append(rightArrow);

            var wrapper = this;
            $([leftArrow, rightArrow]).each(function() {
                $(this)
                    .css({
                        top: (($(wrapper).outerHeight() - $(this).outerHeight()) / 2) + 'px'
                    })
                    .hover(function() {
                        $(this).css({'background-color': arrowHoverColor});
                    }, function() {
                        $(this).css({'background-color': arrowInitialColor});
                    })
                    .on('selectstart dragstart', function(e) {
                        e.preventDefault();
                        return false;
                    });
            });

            var currentIndex = 0;
            var go = function(index, first) {
                var animationDuration = settings.animationDuration;
                if (first) {
                    animationDuration = 0;
                }
                var sizeRatio = .8;

                var originalHeight = [];
                if (settings.focusType == 'enlarge') {
                    images.each(function(_index, element) {
                        originalHeight.push($(this).css('height'));
                        $(this).css({height: (_index == index ? 100 : (100 * sizeRatio)) + '%'});
                    });
                }

                var x = 0;
                var xs = [];
                images.each(function() {
                    xs.push(x);
                    x += $(this).width();
                });
                var totalX = x;
                var offset = 0;
                if (index == (images.length - 1)) {
                    offset = $(wrapper).outerWidth() - totalX;
                } else if (index > 0) {
                    offset = (($(wrapper).outerWidth() - $(images.get(index)).width()) / 2) - xs[index];
                }
                if (settings.focusType == 'enlarge') {
                    images.each(function(_index, element) {
                        if (!originalHeight[_index]) {
                            $(this).css({height: 'auto'});
                        } else {
                            $(this).css({height: originalHeight[_index]});
                        }
                    });
                }

                images.each(function(_index, element) {
                    var properties = {
                        left: (xs[_index] + offset) + 'px',
                    };
                    if (settings.focusType == 'enlarge') {
                        $(this).css({
                            bottom: 0,
                        });
                        properties.height = (_index == index ? 100 : (100 * sizeRatio)) + '%';
                    }
                    $(this).animate(properties, animationDuration);
                });

                if (settings.focusType == 'enlarge') {
                    $([leftShadow, rightShadow]).each(function() {
                        $(this).css({width: 0, display: 'none'});
                    });
                } else {
                    if (index == 0) {
                        leftShadow.animate({width: 0}, animationDuration);
                        rightShadow.animate({width: ($(wrapper).outerWidth() - $(images.get(index)).width()) + 'px'}, animationDuration);
                    } else if (index == (images.length - 1)) {
                        leftShadow.animate({width: ($(wrapper).outerWidth() - $(images.get(index)).width()) + 'px'}, animationDuration);
                        rightShadow.animate({width: 0}, animationDuration);
                    } else {
                        $([leftShadow, rightShadow]).each(function() {
                            $(this).animate({width: ($(wrapper).outerWidth() - $(images.get(index)).width()) / 2 + 'px'}, animationDuration);
                        });
                    }
                }
            };

            var prev = function() {
                currentIndex = (((currentIndex - 1) % images.length) + images.length) % images.length;
                go(currentIndex);
            };

            var next = function() {
                currentIndex = (currentIndex + 1) % images.length;
                go(currentIndex);
            };

            leftArrow.click(prev);
            leftShadow.click(prev);
            rightArrow.click(next);
            rightShadow.click(next);

            go(currentIndex, true);
        });

        return this;
    };
}(jQuery));