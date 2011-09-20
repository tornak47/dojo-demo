dojo.provide('app.views.PersonDetail');
dojo.require("dojo.cache");
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.declare('app.views.PersonDetail', [ dijit._Widget, dijit._Templated ], {
    
  templateString : dojo.cache('app.views', 'Person/PersonDetail.html'),
  tweetTemplate : dojo.cache('app.views', 'Person/Tweet.html'),
  weatherTemplate : dojo.cache('app.views', 'Person/Weather.html'),
 
  postMixInProperties : function() {
    this.isFavorite = this.person.isFavorite();
    this.favoriteText = this.isFavorite ? 'unfavorite' : 'favorite';
  },

  postCreate : function() {
    // templated widgets can refer to a specific element in their template by
    // adding a dojoAttachPoint attribute to the element. so, for example, if a
    // template has
    //
    //    <div dojoAttachPoint="textContainer"></div>
    //
    // then inside the templated widget, we can refer to that element as
    //
    //    this.textContainer
    //
    // this code takes advantage of attach points to add a "loading" class to
    // three elements in the template

    dojo.forEach([ 'latestTweet', 'olderTweets', 'weather' ], function(n) {
    dojo.addClass(this[n], 'loading'); }, this);
    this.connect(this.favorite, 'click', '_handleFavorite');
  },

  _handleFavorite : function() {
    dojo.publish('/favorites/' + (this.isFavorite ? 'remove' : 'add'), [ this.person.data ]);
    this.isFavorite = !this.isFavorite;
    this.favorite.innerHTML = this.isFavorite ? 'unfavorite' : 'favorite';
  },

  _setTweetsAttr : function(tweets) {
    // this method will be called when .set('tweets', someValue) is called on
    // an instance of app.views.Person. it receives someValue as its argument.
    // inside templated widgets, custom setter methods can be created for any
    // property by creating a method named _set<PropertyName>Attr.
    //
    // similarly, custom getters can be created using methods named
    // _get<PropertyName>Attr.

    dojo.removeClass(this.olderTweets, 'loading');
    dojo.removeClass(this.latestTweet, 'loading');

    var latest = tweets.shift();

    this.olderTweets.innerHTML = dojo.map(tweets, function(t) {
      return dojo.string.substitute(this.tweetTemplate, t);
    }, this).join('');

    this.latestTweet.innerHTML = dojo.string.substitute(
      this.tweetTemplate, latest
    );
  },

  _setWeatherDataAttr : function(weather) {
    // this method will be called when .set('weatherData', someValue) is called
    // on an instance of app.views.Person. it receives someValue as its argument.

    dojo.removeClass(this.weather, 'loading');
    this.weather.innerHTML = dojo.string.substitute(
      this.weatherTemplate, weather
    );
  }
});
app.views.PersonDetail.fromViewModel = function(model) {
    return new app.views.PersonDetail({placeHolder:'detail',person:model.person});
};