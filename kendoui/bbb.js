var model,
    router,
    imagePlaceHolder = { image_url: "", calculatedWidth: "400px", noAvatar: true },
    
var photos = new kendo.data.DataSource({
    transport: {
    	read: {
            url: "http://demos.kendoui.com/service/Products",
            dataType: "jsonp"
        }
    }
});




$(document).on("touchmove", false);

model = kendo.observable({
    photos: photos,
    currentVideo: imagePlaceHolder,
    currentPhoto: imagePlaceHolder2,
    query: "",
    showDetails: true,
    slideShow: false,
    currentQuery: null,

    
    
    
    
 

    thumbHref: function(item) {
        var currentQuery = this.get("currentQuery");

        if (currentQuery) {
            return "#search/" + encodeURIComponent(currentQuery) + "/photos/" + item.get("id");
        } else {
            return "#photos/" + item.get("id");
        }
    },

    thumbClass: function(item) {
        return item.get("id") === this.get("current") ? "selected" : "";
    },

    performSearch: function(e) {
        e.preventDefault();

        var query = this.get("query");

        if (query) {
            router.navigate("search/" + encodeURIComponent(query));
        } else {
            router.navigate("");
        }
    },

    toggleFocus: function() {
        $(document.body).toggleClass("focused");
    },

    searchFor: function(query, showFirst) {
        var that = this,
            currentQuery = this.get("currentQuery");

        if (currentQuery !== query) {
            this.set("currentQuery", query);
            this.set("query", query);
            if (query) {
                photos.read({ url: '/photos/search', settings: { term: query, page: 1, image_size: 1, rpp: 50 } });
            } else {
                photos.read(popularQuery);
            }

            if (showFirst) {
                photos.one("change", function() {
                    var data = this.data();
                    if (data.length) {
                        model.show(data[0].id);
                    } else {
                        alert('No results found, how about some kittens instead?');
                        router.navigate("search/kittens");
                    }
                })
            }
        }
    },

    scrollRight: function() {
        var width = $("#photo-thumbs").width();
        $("#photo-thumbs").animate({ scrollLeft: "+=" + width }, 500);
    },

    scrollLeft: function() {
        var width = $("#photo-thumbs").width();
        $("#photo-thumbs").animate({ scrollLeft: "-=" + width }, 500);
    },

    toggleShowDetails: function(e) {
        this.set("showDetails", !this.get("showDetails"));
        e.stopImmediatePropagation();
    },

    slideShowButtonText: function() {
        return this.get("slideShow") ? "stop" : "play";
    },

    detailsClass: function() {
        return this.get("showDetails") ? "visible" : "";
    },

    toggleSlideShow: function() {
        var slideShow = !this.get("slideShow");
        this.set("slideShow", slideShow);
        if (slideShow) {
            this.interval = setInterval(this.moveNext, 5000);
        } else {
            this.stopSlideShow();
        }
    },

    stopSlideShow: function() {
        clearInterval(this.interval);
    },

    moveNext: function() {
        var currentItem = photos.get(model.currentPhoto.id);
        var currentItemIndex = photos.data().indexOf(currentItem);

        if (currentItemIndex === -1) {
            return;
        }

        if (currentItemIndex == photos.data().length - 1) {
            currentItemIndex = 0;
        }

        var nextItem = photos.at(currentItemIndex + 1);
        if (model.currentQuery) {
            router.navigate("search/" + encodeURIComponent(model.currentQuery) + "/photos/" + nextItem.id);
        } else {
            router.navigate("photos/" + nextItem.id);
        }
    }
});

var main = new kendo.View("main", { model: model });

router = new kendo.Router({
    init: function() {
        main.render("#root");
    }
});

router.route("/", function(id) {
    model.searchFor("", true);
});

router.route("search/:query/photos/:id", function(query, id) {
    model.show(id);
    model.video(id);
    model.searchFor(query, false);
});

router.route("search/:query", function(query) {
    model.searchFor(query, true);
});

router.route("photos/:id", function(id) {
    model.show(id);
    model.showVideo(id);
    model.searchFor("", false);
});

$(function() {
    

    router.start();
});
