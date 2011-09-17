window.addEvent('domready', function(){
    var viewer = new JSPano('pano', './assets/panos/sample.jpg');
   
    var timer;
    $('zoomIn').addEvents({
        mousedown: function(e){
            e.stop();
            timer = viewer.zoomIn.periodical(50, viewer);
        },
        mouseup: function(e){
            e.stop();
            clearInterval(timer);
        }
    });
    $('zoomOut').addEvents({
        mousedown: function(e){
            e.stop();
            timer = viewer.zoomOut.periodical(50, viewer);
        },
        mouseup: function(e){
            e.stop();
            clearInterval(timer);
        }
    });
});