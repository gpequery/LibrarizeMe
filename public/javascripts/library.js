$j(function() {
    sendRequest();

    $j('.inputSearch').on('keyup', function() {
        sendRequest();
    });

    $j('.searchIndex').on('click', function() {
        sendRequest();
    });

    $j('.popin').on('click', function() {
        $j('.popin').css('display', 'none');
        $j('.contentPopin').css('display', 'none');
    })

});

function sendRequest() {
    if ($j('.inputSearch').val().length >= 3) {
        $j.post(
            'searchCode', {
                'code': $j('.inputSearch').val(),
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
}

function toHtmlProductList(allProducts) {
    var infos;
    var html = '';

    for (var product of allProducts) {
        infos = getInfoSmall(product);

        html += '<div class=\'oneProduct\'>';

            if (infos['imgLink'] != null) {
                html += '<img src=' + infos['imgLink'] + ' onclick=\'getInfoProduct("' + infos['ASIN'] + '")\'/>';
            } else {
               html += '<img src=\'/images/product_no_image.png\' style=\'width: 160px\' onclick=\'getInfoProduct(\'' + infos['ASIN'] + '\')\'\/>';
            }

            html +=         '<span class=\'spanProductTitle\' title="' + infos['title'] + '">';
            html +=             getLittleTitle(infos['title']);
            html +=         '</span>';

            html +=         '<div class=\'' + infos['ASIN'] + '\'>';
            html +=             JSON.stringify(product);
            html +=         '</div>';

        html += '</div>';
    }

    return html;
}

function getInfoSmall(product) {
    var infos = [];

    infos['imgLink'] = product['MediumImage'] != undefined ? product['MediumImage'][0]['URL'][0] : null;
    infos['title'] = product['ItemAttributes'][0]['Title'][0].toString();
    infos['ASIN'] = product['ASIN'][0].toString();

    return infos;
}

function getInfoDetail(product) {
    var infos = [];

    infos['imgLink'] = product['LargeImage'] != undefined ? product['LargeImage'][0]['URL'][0] : null;
    infos['title'] = product['ItemAttributes'][0]['Title'][0].toString();
    infos['ASIN'] = product['ASIN'][0].toString();

    infos['imagesLink'] = [];
    for (var image of product['ImageSets'][0]['ImageSet']) {
        if (image['$']['Category'] != 'primary') {
            infos['imagesLink'].push({
                'large': image['LargeImage'][0]['URL'][0],
                'small': image['TinyImage'][0]['URL'][0]
            });
        }
    }

    return infos;
}

function getLittleTitle(title) {
    if (title.length >= 10 ) {
        return title.substr(0, 10) + ' ...';
    } else {
        return title;
    }
}

function getInfoProduct(productId) {
    $j('.popin').css('display', 'block');
    $j('.contentPopin').css('display', 'block');

    var infos = getInfoDetail(JSON.parse($j('.'+productId).html()));

    $j('.imgProductDetail').attr('src', infos['imgLink'].toString());

    var html = '';
    for(var image of infos['imagesLink']){

        html += '<img src=\'' + image['small'] + '\' />';
    }
    $j('.imagesProduct').html(html);
}
