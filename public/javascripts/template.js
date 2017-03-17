$j(function() {

    $j('.titleMenu').hover(function() {
        $j(this).children('ul').slideDown('slow');
    }, function() {
        $j(this).children('ul').hide('slow');
    });

});
