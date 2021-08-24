$(document).ready(function() {
    'use strict';

    try {
        let object = localStorage.getItem("text");
        object = JSON.parse(object);
        if (object != null) {
            if (new Date(Number(object.timestamp) + 1000 * 3600) > new Date().getTime()) {
                $('#edit-area').html(object.value);
                if ($('#play-text').is(':hidden')) {
                    $('#edit-text').css({
                        'display': 'none',
                        'left': '20px'
                    });
                    $('#upload-text').css('display', 'flex');
                    $('#upload-text').animate({left: '20px'}, 300);
                    setTimeout(() => {
                        $('#play-text').css({
                            'display': 'flex',
                            'right': '20px'
                        });
                    }, 300);
                }
                openEditArea();
            }
        }
    } catch (error) {
        console.log(error);
    }

    //text init (setting to the local storage)
    function submiteFile(file) {
        $('#file-name').text(file.name);
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            let file = reader.result;
            file = file.replaceAll('\n', '<br>');
            $('#edit-area').html(file);
            if ($('#play-text').is(':hidden')) {
                $('#edit-text').css({
                    'display': 'none',
                    'left': '20px'
                });
                $('#upload-text').css('display', 'flex');
                $('#upload-text').animate({left: '20px'}, 300);
                setTimeout(() => {
                    $('#play-text').css({
                        'display': 'flex',
                        'right': '20px'
                    });
                }, 300);
            }
            openEditArea();
            let object = {value: file, timestamp: new Date().getTime()}       
            localStorage.setItem('text', JSON.stringify(object));
        }
    }
    /* file-input */

    $('#file-input').on('change', () => {
        let file = $('#file-input').get()[0].files[0];

        submiteFile(file);
    });

    /* drop-zone */
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        $('#drop-area').on(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    //This executors highlight the drop-area
    ['dragenter', 'dragover'].forEach(eventName => {
        $('#drop-area').on(eventName, () =>{
            $('#drop-area').addClass('highlight');
        });
    });
    ['dragleave', 'drop'].forEach(eventName => {
        $('#drop-area').on(eventName, () =>{
            $('#drop-area').removeClass('highlight');
        });
    });

    $('#drop-area').on('drop', (e) => {
        e = e = e.originalEvent;
        let dt = e.dataTransfer;
        let file = dt.files[0];
        
        submiteFile(file);
    });

    /* TEXT EDITING */

    /* Edit button */

    function openEditArea() {
        $('#moving-drop-area').css('left', '-150%');
        $('#moving-edit-area').css('right', '0');

        $('#edit-text').css('display', 'none');
        $('#upload-text').css('display', 'flex');
    }
    function closeEditArea() {
        $('#moving-edit-area').css('right', '-150%');
        $('#moving-drop-area').css('left', '0');

        $('#edit-text').css('display', 'flex');
        $('#upload-text').css('display', 'none');
    }

    $('#edit-text').on('click', openEditArea);
    $('#upload-text').on('click', closeEditArea);

    let observer = new MutationObserver(() => {
        //updating localStorage
        let file = $('#edit-area').html();
            
        if ($('#play-text').is(':hidden')) {
            $('#edit-text').css({
                'display': 'none',
                'left': '20px'
            });
            $('#upload-text').css('display', 'flex');
            $('#upload-text').animate({left: '20px'}, 300);
            setTimeout(() => {
                $('#play-text').css({
                    'display': 'flex',
                    'right': '20px'
                });
            }, 300);
        }       
        let object = {value: file, timestamp: new Date().getTime()};     
        localStorage.setItem('text', JSON.stringify(object));
    });
    observer.observe($('#edit-area').get()[0], {
        childList: true, // наблюдать за непосредственными детьми
        subtree: true, // и более глубокими потомками
        characterDataOldValue: true // передавать старое значение в колбэк
    });
    
    /* CHANGE COLOR BUTTON */

    //new button initing
    EasyEditor.prototype.changecolor = function(){
        $('#edit-area').on('click', closeColorMP);

        let isMPopen = false;

        function openColorMP() {  
            isMPopen = true;

            $('#change-color-mp').css('transform', 'scale(1, 1)');
        }
    
        function closeColorMP() {
            isMPopen = false;

            $('#change-color-mp').css('transform', 'scale(0, 0)');
    
        }

        let _this = this;
        let settings = {
            buttonIdentifier: 'changecolor',
            buttonHtml: 'changecolor',
            clickHandler: function(){
                if (!_this.getSelection().isCollapsed) {
                    if (isMPopen) {
                        closeColorMP();
                    } else {
                        openColorMP();
                        $('.colors').on('change', () => {
                            let color = $('input[name="colors"]:checked').val();
                            _this.wrapSelectionWithNodeName({ nodeName: 'span', style: 'color: ' + color, keepHtml: true });
                        })
                    }
                }
            }
        };
    
        _this.injectButton(settings);
    };
    //easy editor initing
    $('#edit-area').easyEditor({
        buttons: ['bold', 'italic', 'alignleft', 'aligncenter', 'alignright', 'changecolor', 'list', 'x'],
        buttonsHtml: {
            'bold': '<i class="fa fa-bold" aria-hidden="true"></i>',
            'italic': '<i class="fa fa-italic" aria-hidden="true"></i>',
            'align-left': '<i class="fa fa-align-left" aria-hidden="true"></i>',
            'align-center': '<i class="fa fa-align-center" aria-hidden="true"></i>',
            'align-right': '<i class="fa fa-align-right" aria-hidden="true"></i>',
            'list': '<i class="fa fa-list-ul" aria-hidden="true"></i>',
            'changecolor': '<i class="fa fa-font" aria-hidden="true"></i>',
            'remove-formatting': '<i class="fa fa-ban"></i>'
        }
    });

    //change color initing
    $('.toolbar-changecolor').attr('id', 'change-color-button');
    $('#change-color-button').append(`
    <form id="change-color-mp">
        <input id="red" class="colors" type="radio" name="colors" value="red">
        <input id="yellow" class="colors" type="radio" name="colors" value="yellow">
        <input id="orange" class="colors" type="radio" name="colors" value="orange">
        <input id="blue" class="colors" type="radio" name="colors" value="blue">
        <input id="green" class="colors" type="radio" name="colors" value="green">
        <div class="pin"></div>
    </form>`);
    $('#change-color-mp').css('transform', 'scale(0, 0)');
    $('#change-color-mp').on('click', (e) => e.stopPropagation())
});