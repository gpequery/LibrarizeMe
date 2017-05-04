$j(function() {

    $j('.inputSearch').on('keyup', function() {
        if ($j(this).val().length >= 3) {
            $j.post(
                'searchCode', {
                    'code': $j(this).val(),
                    'searchIndex': $j('.searchIndex').val(),
                    'page': '1'
                }, function(data) {
                    if (data != 'Nok' && data.lenth != 0) {
                        $j('.resultSearch').html(toHtmlProductList(data));
                    } else {
                        $j('.resultSearch').html('Aucun produit trouvé !');
                    }
                });
        }
    });

    $j('.searchIndex').on('click', function() {
        if ($j('.inputSearch').val().length >= 3) {
            $j.post(
                'searchCode', {
                    'code': $j('.inputSearch').val(),
                    'searchIndex': $j(this).val(),
                    'page': '1'
                }, function(data) {
                    if (data != 'Nok' && data.lenth != 0) {
                        $j('.resultSearch').html(toHtmlProductList(data));
                    } else {
                        $j('.resultSearch').html('Aucun produit trouvé !');
                    }
                });
        }
    });

    $j('.paginationProduct').on('click', function() {
        $j.post(
            'searchCode', {
                'code': $j('.inputSearch').val(),
                'page': '2'
            }, function(data) {
                if (data != 'Nok' && data.lenth != 0) {
                    $j('.resultSearch').html(toHtmlProductList(data));
                } else {
                    $j('.resultSearch').html('Aucun produit trouvé !')
                }
            });
    });
});

function toHtmlProductList(allProducts) {
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