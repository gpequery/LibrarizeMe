$j(function() {

    $j('.titleMenu').hover(function() {
        $j(this).children('ul').slideDown('slow');
    }, function() {
        $j(this).children('ul').slideUp('slow');
    });

    //Modifie le formulaire formNavigateMenu pour avoir une navigation en post.
    $j('.menuNav').on('click', function() {
        $j('.formNavigateMenu').attr('action', $j(this).attr('data'));
        $j('.formNavigateMenu').submit();
    });

});
