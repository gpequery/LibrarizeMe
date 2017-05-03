$j(function() {

    $j('.inputSearch').on('keyup', function() {
        if ($j(this).val().length >= 3) {
            $j.post(
                'searchCode', {
                    'code': $j(this).val()
                }, function(data) {
                    if (data != 'Nok' && data.lenth != 0) {
                        $j('.resultSearch').html(toHtml(data));
                    } else {
                        $j('.resultSearch').html('Aucun produit trouvé !')
                    }
                });
        }
    });
});

function toHtml(allProducts) {
    var imgLink;
    var productTitle;

    var html = '';

    for (var product of allProducts) {
        imgLink = product['MediumImage'] != undefined ? JSON.stringify(product['MediumImage'][0]['URL'][0]) : null;
        productTitle = product['ItemAttributes'][0]['Title'][0].toString();

        html += '<div class=\'oneProduct\'>';

            if (imgLink != null) {
                html += '<img src=' + imgLink + '/>';
            } else {
                console.log('ICI');
               html += '<img src=\'/images/product_no_image.png\' style="width: 160px" />';
            }

            html +=         '<span class=\'spanProductTitle\' title="' + productTitle + '">';
            html +=             getLittleTitle(productTitle);
            html +=         '</span>';

        html += '</div>';
    }

    return html;
}

function getLittleTitle(title) {
    if (title.length >= 10 ) {
        return title.substr(0, 10) + ' ...';
    } else {
        return title;
    }
}