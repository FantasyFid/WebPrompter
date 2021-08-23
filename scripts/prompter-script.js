$(document).ready(function() {

    //Text init
    function textInit() {
        try {
            $('#text').html(localStorage.getItem('text'));
        } catch {(error) => {
                console.log(error);
            }
        }
    }
    
    textInit();

    ['selectstart'].forEach((elem) => {
        $(document).on(elem, (e) => e.preventDefault())
    });

    /*-----------------BUTTONS------------------*/

    //#exit-button executor

    $(window).on('keydown', (e) => {
        if (e.code == 'Escape' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            e.stopPropagation();

            window.location.href = "../index.html";
        }
    });

    //#controls-panel-button executor:

    function hideControls(event) {
        $('#controls-panel-button').off('click', hideControls);

        event.preventDefault();
        event.stopPropagation();

        if(movingPanelFlag) {
            closeMovingPanels();
        }

        $('.controls').css('bottom', '-200px');
        $('#controls-panel-button').css('transform', 'scale(1, -1)');

        $('#controls-panel-button').on('click', showControls);
    }

    function showControls(event) {
        $('#controls-panel-button').off('click', showControls);

        event.preventDefault();
        event.stopPropagation();

        $('.controls').css('bottom', '60px');
        $('#controls-panel-button').css('transform', 'scale(1, 1)');
        
        $('#controls-panel-button').on('click', hideControls);
    }

    function controlShowOnKey(e) {
        if (e.code == 'KeyC' && !e.ctrlKey && !e.shiftKey && !e.altKey) {    
            $(window).off('keydown', controlShowOnKey);
            $(window).on('keydown', controlHideOnKey);
    
            showControls(e);
        }
    }
    function controlHideOnKey(e) {
        if (e.code == 'KeyC' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
            $(window).off('keydown', controlHideOnKey);
            $(window).on('keydown', controlShowOnKey);

            hideControls(e);
        } 
    }

    $('#controls-panel-button').on('click', hideControls);
    $(window).on('keydown', controlHideOnKey);

    //#play-pause-batton executor:

    let speed = Number($('#speed-range').val());
    let pauseStatement = true;
    let reverseStatus = false;

    function playStatement() {
        pauseStatement = false;

        if (reverseStatus == false) {
            $('html').animate({scrollTop: Number($(document).scrollTop()) + Number(speed)}, 50, 'linear');
        } else {
            $('html').animate({scrollTop: Number($(document).scrollTop()) - Number(speed)}, 50, 'linear');
        }

        $('html').promise().done(() => {
            if(!pauseStatement) {
                playStatement();
            }
        });
/*         setTimeout(() => {
            if(!pauseStatement) {
                playStatement();
            }
        }, 100); */
    }

    function play(event) {
        event.preventDefault();
        event.stopPropagation();

        playStatement();

        $('#play-button').hide();
        $('#pause-button').show();

        $('#statement-button').off('click', play);
        $('#statement-button').on('click', pause);

        $('#play-pause-text').text('Pause');
    }

    function pause(event) {
        event.preventDefault();
        event.stopPropagation();

        $(document).stop();
        pauseStatement = true;

        $('#pause-button').hide();
        $('#play-button').show();

        $('#statement-button').off('click', pause);
        $('#statement-button').on('click', play);

        $('#play-pause-text').text('Play');
    }

    function playOnKey(e) {
        if (e.code == 'Space' && !e.ctrlKey && !e.shiftKey && !e.altKey) {    
            $(window).off('keydown', playOnKey);
            $(window).on('keydown', pauseOnKey);
    
            play(e);
        }
    }
    function pauseOnKey(e) {
        if (e.code == 'Space' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
            $(window).off('keydown', pauseOnKey);
            $(window).on('keydown', playOnKey);

            pause(e);
        } 
    }

    $('#statement-button').on('click', play);
    $(window).on('keydown', playOnKey);


    //#fullsreen-button-executor

    function toggleFullScreen() {
        if (!document.fullscreenElement &&    // alternative standard method
            !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        }
    }

    $('#fullscreen-button').on('click', toggleFullScreen);

    //#repeat-button

    function moveToStart() {
        if(reverseStatus == false) {
            $('html').animate({scrollTop: 0}, 1000);
        } else {
            $('html').animate({scrollTop: Math.round($(document).height() - $(window).height())}, 1000);
        }
    }
    function moveToStartOnKey(e) {
        if (e.code == 'KeyR' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            e.stopPropagation();

            moveToStart();
        }
    }

    $('#repeat-button').on('click', moveToStart);
    $(window).on('keydown', moveToStartOnKey);

    //#scroll-up-button executor

    function startScrollUp() {

        function scrollingUp() {
            if (reverseStatus == false) {
                $('html').animate({scrollTop: Number($(document).scrollTop()) - Number(15)}, 10, 'linear');
            } else {
                $('html').animate({scrollTop: Number($(document).scrollTop()) + Number(15)}, 10, 'linear');
            }
    
            $('html').promise().done(() => {
                if(scrollingUpStatus) {
                    scrollingUp();
                }
            });
        }

        let scrollingUpStatus = true;

        if (pauseStatement) {
            $('#scroll-up-button').on('mouseup', () => {
                scrollingUpStatus = false;
                $('#scroll-up-button').off('mouseup');
            });
            $(window).on('keyup', (e) => {
                if (e.code == 'ArrowUp' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                    scrollingUpStatus = false;
                    $(window).off('keyup');
                    $(window).on('keydown', scrollUpOnKey);
                }
            });

            scrollingUp();

        } else {
            pauseStatement = true;

            $('#scroll-up-button').on('mouseup', () => {
                scrollingUpStatus = false;
                playStatement();
                $('#scroll-up-button').off('mouseup');
            });
            $(window).on('keyup', (e) => {
                if (e.code == 'ArrowUp' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                    scrollingUpStatus = false;
                    playStatement();
                    $(window).off('keyup');
                    $(window).on('keydown', scrollUpOnKey);
                }
            });
 
            scrollingUp();
        }
    }
    function scrollUpOnKey(e) {
        if (e.code == 'ArrowUp' && !e.ctrlKey && !e.shiftKey && !e.altKey) {    
            $(window).off('keydown', scrollUpOnKey);

            startScrollUp(e);
        }
    }

    $('#scroll-up-button').on('mousedown', startScrollUp);
    $(window).on('keydown', scrollUpOnKey);

    //#scroll-down-button executor

    function startScrollDown() {

        function scrollingDown() {
            if (reverseStatus == false) {
                $('html').animate({scrollTop: Number($(document).scrollTop()) + Number(20)}, 10, 'linear');
            } else {
                $('html').animate({scrollTop: Number($(document).scrollTop()) - Number(20)}, 10, 'linear');
            }
    
            $('html').promise().done(() => {
                if(scrollingDownStatus) {
                    scrollingDown();
                }
            });
        }

        let scrollingDownStatus = true;

        if (pauseStatement) {
            $('#scroll-down-button').on('mouseup', () => {
                scrollingDownStatus = false;
                $('#scroll-down-button').off('mouseup');
            });
            $(window).on('keyup', (e) => {
                if (e.code == 'ArrowDown' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                    scrollingDownStatus = false;
                    $(window).off('keyup');
                    $(window).on('keydown', scrollDownOnKey);
                }
            });

            scrollingDown();

        } else {
            pauseStatement = true;

            $('#scroll-down-button').on('mouseup', () => {
                scrollingDownStatus = false;
                playStatement();
                $('#scroll-down-button').off('mouseup');
            });
            $(window).on('keyup', (e) => {
                if (e.code == 'ArrowDown' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                    scrollingDownStatus = false;
                    playStatement();
                    $(window).off('keyup');
                    $(window).on('keydown', scrollDownOnKey);
                }
            });

            scrollingDown();
        }
    }
    function scrollDownOnKey(e) {
        if (e.code == 'ArrowDown' && !e.ctrlKey && !e.shiftKey && !e.altKey) {    
            $(window).off('keydown', scrollDownOnKey);

            startScrollDown(e);
        }
    }

    $('#scroll-down-button').on('mousedown', startScrollDown);
    $(window).on('keydown', scrollDownOnKey);

    //This flag contains the information about activ moving panels:

    let movingPanelFlag = false;

    function closeMovingPanels() {
        closeLHPanel();
        closeFSPanel();
        closeSpeedPanel();

        movingPanelFlag = false;
    }

    //#line-height-button executor

    function openLHPanel(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if(movingPanelFlag) {
            closeMovingPanels();
        }

        movingPanelFlag = true;

        $('#moving-lh-panel').css('transform', 'scale(1, 1)');

        $('#line-height-button').off('click', openLHPanel);
        $('#line-height-button').on('click', closeLHPanel);
    }

    function closeLHPanel(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        movingPanelFlag = false;

        $('#moving-lh-panel').css('transform', 'scale(0, 0)');

        $('#line-height-button').off('click', closeLHPanel);
        $('#line-height-button').on('click', openLHPanel);
    }

    $('#line-height-button').on('click', openLHPanel);

    //#font-size-button executor

    function openFSPanel(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if(movingPanelFlag) {
            closeMovingPanels();
        }

        movingPanelFlag = true;

        $('#moving-fs-panel').css('transform', 'scale(1, 1)');

        $('#font-size-button').off('click', openFSPanel);
        $('#font-size-button').on('click', closeFSPanel);
    }

    function closeFSPanel(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        movingPanelFlag = false;

        $('#moving-fs-panel').css('transform', 'scale(0, 0)');

        $('#font-size-button').off('click', closeFSPanel);
        $('#font-size-button').on('click', openFSPanel);
    }

    $('#font-size-button').on('click', openFSPanel);
    
    //#speed-button executor

    function openSpeedPanel(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if(movingPanelFlag) {
            closeMovingPanels();
        }

        movingPanelFlag = true;

        $('#moving-speed-panel').css('transform', 'scale(1, 1)');

        $('#speed-button').off('click', openSpeedPanel);
        $('#speed-button').on('click', closeSpeedPanel);
    }

    function closeSpeedPanel(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        movingPanelFlag = false;

        $('#moving-speed-panel').css('transform', 'scale(0, 0)');

        $('#speed-button').off('click', closeSpeedPanel);
        $('#speed-button').on('click', openSpeedPanel);
    }

    $('#speed-button').on('click', openSpeedPanel);

    //#settings-button executor

    function openSettings(e) {
        $('#settings-button').off('click', openSettings);
        $('#settings-button').on('click', closeSettings);

        pause(e);
        $('html').off('wheel', onWheel);
        $(window).off('keydown', playOnKey);
        $(window).off('keydown', scrollUpOnKey);
        $(window).off('keydown', scrollDownOnKey);
        $(window).off('keydown', moveToStartOnKey);

        $('#moving-settings-panel').css('right', '0px');

        setTimeout(() => {
            $('body').append('<div id="blur"></div>');
            $('#blur').on('click', closeSettings);
        }, 300);

    }
    
    function closeSettings() {
        $('#settings-button').off('click', closeSettings);
        $('#settings-button').on('click', openSettings);

        $('#moving-settings-panel').css('right', '-420px');

        $('html').on('wheel', onWheel);
        $(window).on('keydown', playOnKey);
        $(window).on('keydown', scrollUpOnKey);
        $(window).on('keydown', scrollDownOnKey);
        $(window).on('keydown', moveToStartOnKey);

        setTimeout(() => {
            $('#blur').on('click', closeSettings);
            $('#blur').remove();
        }, 300);
    }

    $('#settings-button').on('click', openSettings);
    $('#close-settings-button').on('click', closeSettings);
    $(window).on('keydown', (e) => {
        if (e.code == 'KeyS' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            e.stopPropagation();

            $('#settings-button').trigger('click');
        }
    });

    /*-----------------SETTINGS------------------*/

    //#caps executor

    $('#caps').on('input', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if($('#caps').is(":checked")) {
            $('#text').html($('#text').html().toUpperCase());
        } else {
            textInit();
        }
    });
    

    //#vertical-flip executor
    
    $('#vertical-flip').on('input', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if($('#vertical-flip').is(":checked")) {
            if($('#horizontal-flip').is(":checked")) {
                $('.prompter-object').css('transform', 'scale(-1, -1)');
                $('#timer').css({
                    'transform': 'scale(-1, -1)',
                    'right': 'auto',
                    'left': '100px'
                });
                $('#exit-button').css({
                    'left': 'auto',
                    'right': '100px'
                });
                $('#pointer').css({
                    'left': 'auto',
                    'right': '-50px'
                });
            } else {
                $('.prompter-object').css('transform', 'scale(1, -1)');
                $('#timer').css('transform', 'scale(1, -1)');
            }
            reverseStatus = true;

            $('html').scrollTop(Math.round($(document).height() - $(window).height()));

        } else {
            if($('#horizontal-flip').is(":checked")) {
                $('.prompter-object').css('transform', 'scale(-1, 1)');
                $('#timer').css({
                    'transform': 'scale(-1, 1)',
                    'right': 'auto',
                    'left': '100px'
                });
                $('#exit-button').css({
                    'left': 'auto',
                    'right': '100px'
                });
                $('#pointer').css({
                    'left': 'auto',
                    'right': '-50px'
                });
            } else {
                $('.prompter-object').css('transform', 'scale(1, 1)');
                $('#timer').css('transform', 'scale(1, 1)');
            }
            reverseStatus = false;

            $('html').scrollTop(0);
        }
        play(e);
        pause(e); 
    });

    //#horizontal-flip executor
    
    $('#horizontal-flip').on('input', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if($('#horizontal-flip').is(":checked")) {
            if($('#vertical-flip').is(":checked")) {
                $('.prompter-object').css('transform', 'scale(-1, -1)');
                $('#text').css({
                    'padding-left': '30px',
                    'padding-right': '80ox'
                });
                $('#timer').css({
                    'transform': 'scale(-1, -1)',
                    'right': 'auto',
                    'left': '100px'
                });
                $('#exit-button').css({
                    'left': 'auto',
                    'right': '100px'
                });
                $('#pointer').css({
                    'left': 'auto',
                    'right': '-50px'
                });
            } else {
                $('.prompter-object').css('transform', 'scale(-1, 1)');
                $('#text').css({
                    'padding-left': '30px',
                    'padding-right': '80ox'
                });
                $('#timer').css({
                    'transform': 'scale(-1, 1)',
                    'right': 'auto',
                    'left': '100px'
                });
                $('#exit-button').css({
                    'left': 'auto',
                    'right': '100px'
                });
                $('#pointer').css({
                    'left': 'auto',
                    'right': '-50px'
                });
            }
        } else {
            if($('#vertical-flip').is(":checked")) {
                $('.prompter-object').css('transform', 'scale(1, -1)');
                $('#text').css({
                    'padding-left': '80px',
                    'padding-right': '30ox'
                });
                $('#timer').css({
                    'transform': 'scale(1, -1)',
                    'left': 'auto',
                    'right': '100px'
                });
                $('#exit-button').css({
                    'right': 'auto',
                    'left': '100px'
                });
                $('#pointer').css({
                    'right': 'auto',
                    'left': '-50px'
                });
            } else {
                $('.prompter-object').css('transform', 'scale(1, 1)');
                $('#text').css({
                    'padding-left': '80px',
                    'padding-right': '30ox'
                });
                $('#timer').css({
                    'transform': 'scale(1, 1)',
                    'left': 'auto',
                    'right': '100px'
                });
                $('#exit-button').css({
                    'right': 'auto',
                    'left': '100px'
                });
                $('#pointer').css({
                    'right': 'auto',
                    'left': '-50px'
                });
            }
        }
        play(e);
        pause(e); 
    });

    //#high-contrast executor

    $('#high-contrast').on('input', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if($('#high-contrast').is(":checked")) {
            $('#text').css('background-color', 'black');
            $('.control-elem').css({
                'padding-top': '0px',
                'padding-bottom': '0px',
                'border': '2px solid white'
            });
            $('.prompter-header,.prompter-footer').css({
                'background-color': 'white',
                'color': 'black'
            });
        } else {
            $('#text').css('background-color', 'rgb(33, 33, 33)');
            $('.control-elem').css({
                'padding-top': '5px',
                'padding-bottom': '5px',
                'border': 'none'
            });
            $('.prompter-header,.prompter-footer').css({
                'background-color': 'rgb(53, 53, 53)',
                'color': 'white'
            });
        }
    });

    //#high-contrast executor

    $('#high-contrast').on('input', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if($('#high-contrast').is(":checked")) {
            $('#text').css('background-color', 'black');
            $('.control-elem').css({
                'padding-top': '0px',
                'padding-bottom': '0px',
                'border': '2px solid white'
            });
        } else {
            $('#text').css('background-color', 'rgb(33, 33, 33)');
            $('.control-elem').css({
                'padding-top': '5px',
                'padding-bottom': '5px',
                'border': 'none'
            });
        }
    });

    /*-----------------RANGES------------------*/

    //#line-height-range executor

    $('#line-height-text').text($('#line-height-range').val());
    $(':root').css('--text-line-height', $('#line-height-range').val());

    function onLHRange(event) {
        event.preventDefault();
        event.stopPropagation();

        $(':root').css('--text-line-height', $('#line-height-range').val());
        $('#line-height-text').text($('#line-height-range').val());
    }
 
    $('#line-height-range').on('input', onLHRange);

    //#font-size-range executor

    $('#font-size-text').text($('#font-size-range').val() + 'px');
    $(':root').css('--text-font-size', $('#font-size-range').val() + 'px');

    function onFSRange(event) {
        event.preventDefault();
        event.stopPropagation();

        $(':root').css('--text-font-size', $('#font-size-range').val() + 'px');
        $('#font-size-text').text($('#font-size-range').val() + 'px');
    }

    $('#font-size-range').on('input', onFSRange);

    //#speed-range executor

    speed = Number($('#speed-range').val());

    $('#speed-text').text($('#speed-range').val());

     function onSpeedRange(event) {
        event.preventDefault();
        event.stopPropagation();

        speed = Number($('#speed-range').val());
        
        $('#speed-text').text($('#speed-range').val());
    }

    $('#speed-range').on('input', onSpeedRange);

    /*-----------------SCROLL------------------*/

    //mousewheel executor

    let currentID = 0;
    const deltaPixels = 70;

    function onWheel(e) {
        e = e.originalEvent;
        e.stopPropagation();

        let deltaPixel = deltaPixels;

        if (e.deltaY < 0) {
            deltaPixel = -1*deltaPixel;
        }

        clearTimeout(currentID);
        if(pauseStatement) {
            $('html').scrollTop(Number($(document).scrollTop()) + Number(deltaPixel));
        } else {
            pauseStatement = true;
            $('html').stop();
            $('html').scrollTop(Number($(document).scrollTop()) + Number(deltaPixel));
            pauseStatement = false;
            currentID = setTimeout(playStatement, 50);
        }
    }
      
    $('html').on('wheel', onWheel);

    //#progress-bar executor
    
    setTimeout(() => {
        let progress = 0;
        if (reverseStatus == false) {
            progress = ($(window).height() + $(window).scrollTop()) / $(document).height() * 100;
        } else {
            progress = ($(document).height() - $(window).scrollTop()) / $(document).height() * 100;
        }
        $('#progress-bar').css('width', progress + '%');
    }, 50);

    $(window).scroll((e) => {
        e.preventDefault();
        e.stopPropagation();

        if (reverseStatus == false) {
            if (Math.round($(window).scrollTop() + $(window).height()) == Math.round($(document).height())) {
                pause(e);
            }
        } else {
            if ($(window).scrollTop() == 0) {
                pause(e);
            }
        }

        let progress = 0;
        if (reverseStatus == false) {
            progress = ($(window).height() + $(window).scrollTop()) / $(document).height() * 100;
        } else {
            progress =($(document).height() - $(window).scrollTop()) / $(document).height() * 100;
        }
        $('#progress-bar').css('width', progress + '%');
    });

    $('#line-height-range,#font-size-range').on('input', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (reverseStatus == false) {
            if (Math.round($(window).scrollTop() + $(window).height()) == Math.round($(document).height())) {
                pause(e);
            }
        } else {
            if ($(window).scrollTop() == 0) {
                pause(e);
            }
        }

        let progress = 0;
        if (reverseStatus == false) {
            progress = ($(window).height() + $(window).scrollTop()) / $(document).height() * 100;
        } else {
            progress = ($(document).height() - $(window).scrollTop()) / $(document).height() * 100;
        }
        $('#progress-bar').css('width', progress + '%');
    });

        /*-----------------POINTER------------------*/

       ['dragenter', 'dragover', 'dragleave', 'drop', 'dragstart', 'dragend', 'drag'].forEach(eventName => {
            $('#pointer').on(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation()
            })
        });

        $('#pointer').on('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();

            let shiftY = e.clientY - $('#pointer').get()[0].getBoundingClientRect().top;
            let topBorder = 20;
            let bottomBorder = $(window).height() - 125;

            function moveAt(pageY) {
                if (pageY - shiftY >= topBorder && pageY - shiftY <= bottomBorder) {
                    $('#pointer').css('top', pageY - shiftY + 'px');
                }
            }
            function onMouseMove(e) {
                e.preventDefault();
                e.stopPropagation();

                moveAt(e.clientY);
            }

            $(document).on('mousemove', onMouseMove);

            $(document).on('mouseup', (e) => {
                e.preventDefault();
                e.stopPropagation();

                $(document).off('mousemove', onMouseMove);
                $(document).off('mouseup');
            });
        });

        /*-----------------TIMER------------------*/

        function calculateTime(speedCopy) {
            let scrollBottom = 0;
            if (reverseStatus == false) {
                scrollBottom = Math.abs($(document).height() - $(window).height() - $(window).scrollTop());
            } else {
                scrollBottom = $(window).scrollTop();
            }
            
            let timer = new Date(Math.round((scrollBottom / speedCopy) * 53));
            timer.setUTCHours(Math.round((new Date).getTimezoneOffset() / 60));

            return timer;
        }

        setTimeout(() => {
            $('#timer').text(calculateTime(Number($('#speed-range').val())).toLocaleString(navigator.language, {hour: '2-digit', minute:'2-digit', second: '2-digit'}))
        }, 50);

        $(window).scroll((e) => {
            e.preventDefault();
            e.stopPropagation();
    
            let time = calculateTime(speed);
            time = time.toLocaleString(navigator.language, {hour: '2-digit', minute:'2-digit', second: '2-digit'});

            $('#timer').text(time);
        });
   
       $('#speed-range').on('input', (e) => {
        e.preventDefault();
        e.stopPropagation();

        let time = calculateTime(Number($('#speed-range').val()));
        time = time.toLocaleString(navigator.language, {hour: '2-digit', minute:'2-digit', second: '2-digit'});

        $('#timer').text(time);
       });

       $('#line-height-range,#font-size-range').on('input', (e) => {
        e.preventDefault();
        e.stopPropagation();

        let time = calculateTime(speed);
        time = time.toLocaleString(navigator.language, {hour: '2-digit', minute:'2-digit', second: '2-digit'});

        $('#timer').text(time);
    });

});