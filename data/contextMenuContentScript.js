self.on('click', function (node, data) {
    
    var curr = node;

    while (curr !== null) {
        /*console.log("node.parentNode.nodeType: " + curr.nodeType);
        console.log("node.parentNode.nodeName: " + curr.nodeName);
        console.log("class: " + curr.className);*/

        //console.log("curr.className: " + curr.className);

        if (curr.className.indexOf("discover-table-row") !== -1) {
            break;
        }

        curr = curr.parentNode;
    }

    //curr is a row in discover, we need to find the date field
    var dateNode = null;

    if (curr.hasChildNodes()) {
        var children = curr.childNodes;
        for (var i = 0; i < children.length; i++) {
            if(children[i].className.indexOf("discover-table-timefield") !== -1)
            {
                dateNode = children[i];
                break;
            }
        }
    }

    console.log(dateNode.className);
    console.log(dateNode.innerText);

    var date = moment(dateNode.innerText, "MMMM Do YYYY, HH:mm:ss:SSS");
    
    self.postMessage(date);
});