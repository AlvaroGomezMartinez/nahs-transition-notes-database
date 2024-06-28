function loadPartialHTML_(partial) {
    const htmlServ = HtmlService.createTemplateFromFile(partial);
    return htmlServ.evaluate().getContent();
}


function loadSearchView() {

    return loadPartialHTML_("_search");

}

function loadAddCustomersView() {

    return loadPartialHTML_("_addcustomers");

}